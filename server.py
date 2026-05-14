import http.server
import os
import socket
import socketserver
from functools import partial
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", 9911))

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
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
