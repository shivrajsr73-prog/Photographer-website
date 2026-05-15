import http.server
import json
import os
import socket
import socketserver
import urllib.error
import urllib.parse
import urllib.request
from functools import partial
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", 9911))
INQUIRY_TO_PHONE = os.environ.get("INQUIRY_TO_PHONE", "+919315971838")
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.environ.get("TWILIO_FROM_NUMBER", "")

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def _send_json(self, code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != "/send-inquiry":
            self._send_json(404, {"ok": False, "message": "Not found"})
            return

        if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER]):
            self._send_json(500, {
                "ok": False,
                "message": "SMS gateway is not configured on the server.",
            })
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length).decode("utf-8")
            data = json.loads(raw_body or "{}")
        except (ValueError, json.JSONDecodeError):
            self._send_json(400, {"ok": False, "message": "Invalid request body"})
            return

        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        phone = str(data.get("phone", "")).strip()
        wedding_date = str(data.get("weddingDate", "")).strip()
        event_type = str(data.get("eventType", "")).strip()
        budget = str(data.get("budget", "")).strip()

        if not all([name, email, phone, wedding_date, event_type, budget]):
            self._send_json(400, {"ok": False, "message": "Please fill all required details."})
            return

        message_body = "\n".join([
            "New Inquiry",
            f"Name: {name}",
            f"Email: {email}",
            f"Phone: {phone}",
            f"Wedding Date: {wedding_date}",
            f"Event Type: {event_type}",
            f"Budget: {budget}",
        ])

        sms_data = urllib.parse.urlencode({
            "To": INQUIRY_TO_PHONE,
            "From": TWILIO_FROM_NUMBER,
            "Body": message_body,
        }).encode("utf-8")
        sms_url = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
        sms_request = urllib.request.Request(sms_url, data=sms_data, method="POST")

        try:
            password_manager = urllib.request.HTTPPasswordMgrWithDefaultRealm()
            password_manager.add_password(None, sms_url, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            opener = urllib.request.build_opener(urllib.request.HTTPBasicAuthHandler(password_manager))
            with opener.open(sms_request, timeout=15) as response:
                if response.status >= 400:
                    raise RuntimeError(f"Twilio returned status {response.status}")
        except (urllib.error.URLError, RuntimeError) as error:
            print(f"Inquiry SMS failed: {error}")
            self._send_json(500, {"ok": False, "message": "SMS could not be sent."})
            return
        except Exception as error:
            print(f"Inquiry SMS failed: {error}")
            self._send_json(500, {"ok": False, "message": "SMS could not be sent."})
            return

        print(f"Inquiry SMS sent to {INQUIRY_TO_PHONE}: {name} <{phone}>")
        self._send_json(200, {"ok": True, "message": "Your inquiry has been submitted."})

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            error_page = ROOT_DIR / "404.html"
            if error_page.is_file():
                content = error_page.read_bytes()
                self.send_response(404, message)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                if self.command != "HEAD":
                    self.wfile.write(content)
                return

        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        pass

class DualStackServer(socketserver.TCPServer):
    allow_reuse_address = True
    address_family = socket.AF_INET6

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except OSError:
            pass
        super().server_bind()

handler = partial(NoCacheHandler, directory=str(ROOT_DIR))
with DualStackServer(("::", PORT), handler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
