<<<<<<< HEAD
const hero = document.querySelector(".hero");
const sharedBackdrop = document.querySelector(".shared-backdrop");

if (hero && sharedBackdrop) {
  const heroImages = ["images/image1.png.png", "images/image2.png.png"];
  const primaryLayer = sharedBackdrop.querySelector(".shared-backdrop-primary");
  const secondaryLayer = sharedBackdrop.querySelector(".shared-backdrop-secondary");
  let currentIndex = 0;

  const setLayerBackground = (layer, imagePath) => {
    layer.style.backgroundImage = `url("${imagePath}")`;
  };

  if (primaryLayer && secondaryLayer) {
    setLayerBackground(primaryLayer, heroImages[currentIndex]);
  }

  if (heroImages.length > 1 && primaryLayer && secondaryLayer) {
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroImages.length;
      setLayerBackground(secondaryLayer, heroImages[nextIndex]);
      sharedBackdrop.classList.add("is-transitioning");

      window.setTimeout(() => {
        setLayerBackground(primaryLayer, heroImages[nextIndex]);
        sharedBackdrop.classList.remove("is-transitioning");
        secondaryLayer.style.backgroundImage = "";
      }, 1400);

      currentIndex = nextIndex;
    }, 5000);
  }
}

window.addEventListener("scroll", () => {
  if (hero) {
    const scrollAmount = Math.min(window.scrollY, window.innerHeight);
    hero.style.setProperty("--hero-text-shift", `${scrollAmount * -0.35}px`);
    hero.style.setProperty("--hero-text-opacity", `${Math.max(0, 1 - scrollAmount / 420)}`);
  }

  document.querySelectorAll(".box").forEach((box) => {
    box.style.transform = "scale(1.02)";
  });
});

window.addEventListener("load", () => {
  window.dispatchEvent(new Event("scroll"));
});

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  const defaultTiltY = card.classList.contains("right") ? 3 : -3;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;
    const rotateY = (offsetX - 0.5) * 12 + defaultTiltY;
    const rotateX = (0.5 - offsetY) * 10 + 3;

    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glow-x", `${(offsetX * 100).toFixed(1)}%`);
    card.style.setProperty("--glow-y", `${(offsetY * 100).toFixed(1)}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "3deg");
    card.style.setProperty("--tilt-y", `${defaultTiltY}deg`);
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
  });
});

const eventPicker = document.querySelector(".event-picker");

if (eventPicker) {
  const eventValue = eventPicker.querySelector(".event-picker-value");
  const eventButtons = eventPicker.querySelectorAll(".event-option");
  const customEventInput = eventPicker.querySelector(".custom-event-input");
  let selectedEvent = "";

  const updateEventLabel = () => {
    if (selectedEvent === "Etc." && customEventInput.value.trim()) {
      eventValue.textContent = customEventInput.value.trim();
      return;
    }

    eventValue.textContent = selectedEvent || "Click to choose";
  };

  eventButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedEvent = button.dataset.value || "";

      eventButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const showCustomEvent = selectedEvent === "Etc.";
      customEventInput.hidden = !showCustomEvent;

      if (showCustomEvent) {
        customEventInput.focus();
      } else {
        customEventInput.value = "";
        eventPicker.removeAttribute("open");
      }

      updateEventLabel();
    });
  });

  if (customEventInput) {
    customEventInput.addEventListener("input", updateEventLabel);
  }

  updateEventLabel();
}

const budgetDetails = document.querySelector(".budget-details");
const customBudgetInput = document.querySelector(".custom-budget-input");

if (budgetDetails && customBudgetInput) {
  const budgetValue = budgetDetails.querySelector(".budget-value");
  const budgetButtons = budgetDetails.querySelectorAll(".budget-option");
  let selectedBudget = "";

  const updateBudgetLabel = () => {
    if (selectedBudget === "Etc." && customBudgetInput.value.trim()) {
      budgetValue.textContent = customBudgetInput.value.trim();
      return;
    }

    budgetValue.textContent = selectedBudget || "Choose budget";
  };

  budgetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedBudget = button.dataset.value || "";

      budgetButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const showCustomBudget = selectedBudget === "Etc.";
      customBudgetInput.hidden = !showCustomBudget;

      if (showCustomBudget) {
        customBudgetInput.focus();
      } else {
        customBudgetInput.value = "";
        budgetDetails.removeAttribute("open");
      }

      updateBudgetLabel();
    });
  });

  customBudgetInput.addEventListener("input", updateBudgetLabel);
  updateBudgetLabel();
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const eventSummary =
      document.querySelector(".event-picker-value")?.textContent?.trim() || "";
    const budgetSummary =
      document.querySelector(".budget-value")?.textContent?.trim() || "";
    const weddingDate =
      document.querySelector("#wedding-date-display")?.value?.trim() || "";

    const messageLines = [
      "New Wedding Inquiry",
      `Name: ${formData.get("name") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Wedding Date: ${weddingDate}`,
      `Event Type: ${eventSummary}`,
      `Budget: ${budgetSummary}`,
    ];

    const message = encodeURIComponent(messageLines.join("\n"));
    window.open(`https://wa.me/919315971839?text=${message}`, "_blank");
  });
}

const datePicker = document.querySelector(".date-picker");

if (datePicker) {
  const dateDisplay = datePicker.querySelector("#wedding-date-display");
  const dateValue = datePicker.querySelector("#wedding-date-value");
  const popup = datePicker.querySelector(".date-picker-popup");
  const title = datePicker.querySelector(".date-picker-title");
  const grid = datePicker.querySelector(".date-grid");
  const prevBtn = datePicker.querySelector('[data-direction="prev"]');
  const nextBtn = datePicker.querySelector('[data-direction="next"]');
  const clearBtn = datePicker.querySelector('[data-action="clear"]');
  const todayBtn = datePicker.querySelector('[data-action="today"]');

  const today = new Date();
  const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDisplayDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatValueDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSameDate = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const renderCalendar = () => {
    prevBtn.disabled = viewDate <= minMonthDate;

    title.textContent = viewDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    grid.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < 42; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "date-day";

      let isOutsideMonth = false;
      let cellDate;
      if (i < startDay) {
        cellDate = new Date(year, month - 1, daysInPrevMonth - startDay + i + 1);
        isOutsideMonth = true;
      } else if (i >= startDay + daysInMonth) {
        cellDate = new Date(year, month + 1, i - startDay - daysInMonth + 1);
        isOutsideMonth = true;
      } else {
        cellDate = new Date(year, month, i - startDay + 1);
      }

      if (isOutsideMonth) {
        button.classList.add("is-hidden");
        button.disabled = true;
        grid.appendChild(button);
        continue;
      }

      button.textContent = cellDate.getDate();

      if (isSameDate(cellDate, today)) {
        button.classList.add("is-today");
      }

      if (isSameDate(cellDate, selectedDate)) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        selectedDate = cellDate;
        viewDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
        dateDisplay.value = formatDisplayDate(cellDate);
        dateValue.value = formatValueDate(cellDate);
        popup.hidden = true;
        renderCalendar();
      });

      grid.appendChild(button);
    }
  };

  dateDisplay.addEventListener("click", () => {
    popup.hidden = !popup.hidden;
    if (!popup.hidden) {
      renderCalendar();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (viewDate <= minMonthDate) {
      return;
    }

    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  clearBtn.addEventListener("click", () => {
    selectedDate = null;
    dateDisplay.value = "";
    dateValue.value = "";
    renderCalendar();
  });

  todayBtn.addEventListener("click", () => {
    selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    dateDisplay.value = formatDisplayDate(selectedDate);
    dateValue.value = formatValueDate(selectedDate);
    renderCalendar();
  });

  document.addEventListener("click", (event) => {
    if (!datePicker.contains(event.target)) {
      popup.hidden = true;
    }
  });

  renderCalendar();
}

const hangingColumns = Array.from(document.querySelectorAll(".hanging-column"));
const columnPhotos = Array.from(document.querySelectorAll(".column-photo"));
const featuredPhoto = document.querySelector(".featured-photo");

if (hangingColumns.length || featuredPhoto) {
  const galleryScene = document.querySelector(".gallery-scene");
=======
const hero = document.querySelector(".hero");
const sharedBackdrop = document.querySelector(".shared-backdrop");

if (hero && sharedBackdrop) {
  const heroImages = ["image1.png.png", "image2.png.png"];
  const primaryLayer = sharedBackdrop.querySelector(".shared-backdrop-primary");
  const secondaryLayer = sharedBackdrop.querySelector(".shared-backdrop-secondary");
  let currentIndex = 0;

  const setLayerBackground = (layer, imagePath) => {
    layer.style.backgroundImage = `url("${imagePath}")`;
  };

  if (primaryLayer && secondaryLayer) {
    setLayerBackground(primaryLayer, heroImages[currentIndex]);
  }

  if (heroImages.length > 1 && primaryLayer && secondaryLayer) {
    setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroImages.length;
      setLayerBackground(secondaryLayer, heroImages[nextIndex]);
      sharedBackdrop.classList.add("is-transitioning");

      window.setTimeout(() => {
        setLayerBackground(primaryLayer, heroImages[nextIndex]);
        sharedBackdrop.classList.remove("is-transitioning");
        secondaryLayer.style.backgroundImage = "";
      }, 1400);

      currentIndex = nextIndex;
    }, 5000);
  }
}

window.addEventListener("scroll", () => {
  if (hero) {
    const scrollAmount = Math.min(window.scrollY, window.innerHeight);
    hero.style.setProperty("--hero-text-shift", `${scrollAmount * -0.35}px`);
    hero.style.setProperty("--hero-text-opacity", `${Math.max(0, 1 - scrollAmount / 420)}`);
  }

  document.querySelectorAll(".box").forEach((box) => {
    box.style.transform = "scale(1.02)";
  });
});

window.addEventListener("load", () => {
  window.dispatchEvent(new Event("scroll"));
});

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  const defaultTiltY = card.classList.contains("right") ? 3 : -3;

  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;
    const rotateY = (offsetX - 0.5) * 12 + defaultTiltY;
    const rotateX = (0.5 - offsetY) * 10 + 3;

    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glow-x", `${(offsetX * 100).toFixed(1)}%`);
    card.style.setProperty("--glow-y", `${(offsetY * 100).toFixed(1)}%`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "3deg");
    card.style.setProperty("--tilt-y", `${defaultTiltY}deg`);
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
  });
});

const eventPicker = document.querySelector(".event-picker");

if (eventPicker) {
  const eventValue = eventPicker.querySelector(".event-picker-value");
  const eventButtons = eventPicker.querySelectorAll(".event-option");
  const customEventInput = eventPicker.querySelector(".custom-event-input");
  let selectedEvent = "";

  const updateEventLabel = () => {
    if (selectedEvent === "Etc." && customEventInput.value.trim()) {
      eventValue.textContent = customEventInput.value.trim();
      return;
    }

    eventValue.textContent = selectedEvent || "Click to choose";
  };

  eventButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedEvent = button.dataset.value || "";

      eventButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const showCustomEvent = selectedEvent === "Etc.";
      customEventInput.hidden = !showCustomEvent;

      if (showCustomEvent) {
        customEventInput.focus();
      } else {
        customEventInput.value = "";
        eventPicker.removeAttribute("open");
      }

      updateEventLabel();
    });
  });

  if (customEventInput) {
    customEventInput.addEventListener("input", updateEventLabel);
  }

  updateEventLabel();
}

const budgetDetails = document.querySelector(".budget-details");
const customBudgetInput = document.querySelector(".custom-budget-input");

if (budgetDetails && customBudgetInput) {
  const budgetValue = budgetDetails.querySelector(".budget-value");
  const budgetButtons = budgetDetails.querySelectorAll(".budget-option");
  let selectedBudget = "";

  const updateBudgetLabel = () => {
    if (selectedBudget === "Etc." && customBudgetInput.value.trim()) {
      budgetValue.textContent = customBudgetInput.value.trim();
      return;
    }

    budgetValue.textContent = selectedBudget || "Choose budget";
  };

  budgetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedBudget = button.dataset.value || "";

      budgetButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const showCustomBudget = selectedBudget === "Etc.";
      customBudgetInput.hidden = !showCustomBudget;

      if (showCustomBudget) {
        customBudgetInput.focus();
      } else {
        customBudgetInput.value = "";
        budgetDetails.removeAttribute("open");
      }

      updateBudgetLabel();
    });
  });

  customBudgetInput.addEventListener("input", updateBudgetLabel);
  updateBudgetLabel();
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const eventSummary =
      document.querySelector(".event-picker-value")?.textContent?.trim() || "";
    const budgetSummary =
      document.querySelector(".budget-value")?.textContent?.trim() || "";
    const weddingDate =
      document.querySelector("#wedding-date-display")?.value?.trim() || "";

    const messageLines = [
      "New Wedding Inquiry",
      `Name: ${formData.get("name") || ""}`,
      `Email: ${formData.get("email") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Wedding Date: ${weddingDate}`,
      `Event Type: ${eventSummary}`,
      `Budget: ${budgetSummary}`,
    ];

    const message = encodeURIComponent(messageLines.join("\n"));
    window.open(`https://wa.me/919315971839?text=${message}`, "_blank");
  });
}

const datePicker = document.querySelector(".date-picker");

if (datePicker) {
  const dateDisplay = datePicker.querySelector("#wedding-date-display");
  const dateValue = datePicker.querySelector("#wedding-date-value");
  const popup = datePicker.querySelector(".date-picker-popup");
  const title = datePicker.querySelector(".date-picker-title");
  const grid = datePicker.querySelector(".date-grid");
  const prevBtn = datePicker.querySelector('[data-direction="prev"]');
  const nextBtn = datePicker.querySelector('[data-direction="next"]');
  const clearBtn = datePicker.querySelector('[data-action="clear"]');
  const todayBtn = datePicker.querySelector('[data-action="today"]');

  const today = new Date();
  const minMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = null;
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const formatDisplayDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatValueDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSameDate = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const renderCalendar = () => {
    prevBtn.disabled = viewDate <= minMonthDate;

    title.textContent = viewDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    grid.innerHTML = "";

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < 42; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "date-day";

      let isOutsideMonth = false;
      let cellDate;
      if (i < startDay) {
        cellDate = new Date(year, month - 1, daysInPrevMonth - startDay + i + 1);
        isOutsideMonth = true;
      } else if (i >= startDay + daysInMonth) {
        cellDate = new Date(year, month + 1, i - startDay - daysInMonth + 1);
        isOutsideMonth = true;
      } else {
        cellDate = new Date(year, month, i - startDay + 1);
      }

      if (isOutsideMonth) {
        button.classList.add("is-hidden");
        button.disabled = true;
        grid.appendChild(button);
        continue;
      }

      button.textContent = cellDate.getDate();

      if (isSameDate(cellDate, today)) {
        button.classList.add("is-today");
      }

      if (isSameDate(cellDate, selectedDate)) {
        button.classList.add("is-selected");
      }

      button.addEventListener("click", () => {
        selectedDate = cellDate;
        viewDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
        dateDisplay.value = formatDisplayDate(cellDate);
        dateValue.value = formatValueDate(cellDate);
        popup.hidden = true;
        renderCalendar();
      });

      grid.appendChild(button);
    }
  };

  dateDisplay.addEventListener("click", () => {
    popup.hidden = !popup.hidden;
    if (!popup.hidden) {
      renderCalendar();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (viewDate <= minMonthDate) {
      return;
    }

    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    renderCalendar();
  });

  clearBtn.addEventListener("click", () => {
    selectedDate = null;
    dateDisplay.value = "";
    dateValue.value = "";
    renderCalendar();
  });

  todayBtn.addEventListener("click", () => {
    selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    dateDisplay.value = formatDisplayDate(selectedDate);
    dateValue.value = formatValueDate(selectedDate);
    renderCalendar();
  });

  document.addEventListener("click", (event) => {
    if (!datePicker.contains(event.target)) {
      popup.hidden = true;
    }
  });

  renderCalendar();
}

const hangingColumns = Array.from(document.querySelectorAll(".hanging-column"));
const columnPhotos = Array.from(document.querySelectorAll(".column-photo"));
const featuredPhoto = document.querySelector(".featured-photo");

if (hangingColumns.length || featuredPhoto) {
  const galleryScene = document.querySelector(".gallery-scene");
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
  const SHARED_IDLE_AMPLITUDE = 2.8;
  const SHARED_IDLE_SPEED = 0.52;
  const SHARED_MAX_SWING = 3.4;
  const SHARED_TENSION = 0.06;
  const SHARED_DAMPING = 0.94;
<<<<<<< HEAD
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let scenePointerX = pointerX;
  let scenePointerY = pointerY;
  const photoUnits = [];
  const charmUnits = [];
  let animationFrame = null;
  let startTime = performance.now();

  const seedPhotoImages = (root) => {
    const targets = Array.from(root.querySelectorAll("[data-image]"));
    if (root.dataset && root.dataset.image) targets.unshift(root);
    targets.forEach((item) => {
      const image = item.querySelector(".photo-image");
      const imagePath = item.dataset.image;
      if (image && imagePath) {
        image.style.backgroundImage = `url("${imagePath}")`;
      }
    });
  };

  hangingColumns.forEach((column) => {
    seedPhotoImages(column);

    charmUnits.push({
      charm: column.querySelector(".chain-charm"),
      pupils: Array.from(column.querySelectorAll(".pupil")),
      pupilX: 0,
      pupilY: 0,
    });
  });

  columnPhotos.forEach((photo, index) => {
    photoUnits.push({
      element: photo,
      animatedElement: photo.querySelector(".column-photo-wrap"),
      angle: 0,
      velocity: 0,
      target: 0,
=======
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let scenePointerX = pointerX;
  let scenePointerY = pointerY;
  const photoUnits = [];
  const charmUnits = [];
  let animationFrame = null;
  let startTime = performance.now();

  const seedPhotoImages = (root) => {
    const targets = Array.from(root.querySelectorAll("[data-image]"));
    if (root.dataset && root.dataset.image) targets.unshift(root);
    targets.forEach((item) => {
      const image = item.querySelector(".photo-image");
      const imagePath = item.dataset.image;
      if (image && imagePath) {
        image.style.backgroundImage = `url("${imagePath}")`;
      }
    });
  };

  hangingColumns.forEach((column) => {
    seedPhotoImages(column);

    charmUnits.push({
      charm: column.querySelector(".chain-charm"),
      pupils: Array.from(column.querySelectorAll(".pupil")),
      pupilX: 0,
      pupilY: 0,
    });
  });

  columnPhotos.forEach((photo, index) => {
    photoUnits.push({
      element: photo,
      animatedElement: photo.querySelector(".column-photo-wrap"),
      angle: 0,
      velocity: 0,
      target: 0,
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
      shiftY: 0,
      shiftX: 0,
      scale: 1,
      depth: Number(photo.dataset.depth || 0.8),
      idlePhase: index * 0.45,
<<<<<<< HEAD
    });
  });

  if (featuredPhoto) {
    seedPhotoImages(featuredPhoto);

    photoUnits.push({
      element: featuredPhoto,
      animatedElement: featuredPhoto.querySelector(".featured-photo-wrap"),
      rope: featuredPhoto.querySelector(".featured-rope"),
      ropePath: featuredPhoto.querySelector(".featured-rope-path"),
      angle: 0,
      velocity: 0,
      target: 0,
=======
    });
  });

  if (featuredPhoto) {
    seedPhotoImages(featuredPhoto);

    photoUnits.push({
      element: featuredPhoto,
      animatedElement: featuredPhoto.querySelector(".featured-photo-wrap"),
      rope: featuredPhoto.querySelector(".featured-rope"),
      ropePath: featuredPhoto.querySelector(".featured-rope-path"),
      angle: 0,
      velocity: 0,
      target: 0,
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
      shiftY: 0,
      shiftX: 0,
      scale: 1,
      curve: 0,
      depth: 1,
      idlePhase: 2.2,
<<<<<<< HEAD
    });

    charmUnits.push({
      charm: featuredPhoto.querySelector(".chain-charm"),
      pupils: Array.from(featuredPhoto.querySelectorAll(".pupil")),
      pupilX: 0,
      pupilY: 0,
    });
  }

  const animateUnits = (timestamp) => {
    const elapsed = (timestamp - startTime) / 1000;
    scenePointerX += (pointerX - scenePointerX) * 0.035;
    scenePointerY += (pointerY - scenePointerY) * 0.035;

    const viewportWidth = window.innerWidth || 1;
    const viewportHeight = window.innerHeight || 1;
    const normalizedX = (scenePointerX / viewportWidth - 0.5) * 2;
    const normalizedY = (scenePointerY / viewportHeight - 0.5) * 2;

    photoUnits.forEach((item) => {
      const { element, animatedElement, depth } = item;
      const isHovered = element.matches(":hover");
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
=======
    });

    charmUnits.push({
      charm: featuredPhoto.querySelector(".chain-charm"),
      pupils: Array.from(featuredPhoto.querySelectorAll(".pupil")),
      pupilX: 0,
      pupilY: 0,
    });
  }

  const animateUnits = (timestamp) => {
    const elapsed = (timestamp - startTime) / 1000;
    scenePointerX += (pointerX - scenePointerX) * 0.035;
    scenePointerY += (pointerY - scenePointerY) * 0.035;

    const viewportWidth = window.innerWidth || 1;
    const viewportHeight = window.innerHeight || 1;
    const normalizedX = (scenePointerX / viewportWidth - 0.5) * 2;
    const normalizedY = (scenePointerY / viewportHeight - 0.5) * 2;

    photoUnits.forEach((item) => {
      const { element, animatedElement, depth } = item;
      const isHovered = element.matches(":hover");
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
      const idleAngle =
        Math.sin(elapsed * SHARED_IDLE_SPEED + item.idlePhase) * SHARED_IDLE_AMPLITUDE;
      const parallaxX = Math.sin(elapsed * (SHARED_IDLE_SPEED * 0.9) + item.idlePhase) * 8 * depth;
      const sceneLiftY = Math.cos(elapsed * (SHARED_IDLE_SPEED * 1.2) + item.idlePhase) * 2.2 * depth;
      const targetAngle = Math.max(
        -SHARED_MAX_SWING,
        Math.min(
          SHARED_MAX_SWING,
          idleAngle
        )
      );

      item.target += (targetAngle - item.target) * 0.095;
      item.shiftY += (((isHovered ? -0.5 : 0) + sceneLiftY) - item.shiftY) * 0.08;
      item.shiftX += (parallaxX - item.shiftX) * 0.08;
<<<<<<< HEAD

      const acceleration = (item.target - item.angle) * SHARED_TENSION;
      item.velocity = (item.velocity + acceleration) * SHARED_DAMPING;
      item.angle += item.velocity;
      item.angle = Math.max(-SHARED_MAX_SWING, Math.min(SHARED_MAX_SWING, item.angle));
      item.scale += ((isHovered ? 1.006 : 1) - item.scale) * 0.05;

      if (animatedElement) {
        animatedElement.style.setProperty("--photo-shift-x", `${item.shiftX.toFixed(2)}px`);
        animatedElement.style.setProperty("--photo-shift-y", `${item.shiftY.toFixed(2)}px`);
        animatedElement.style.setProperty("--photo-rotate", `${item.angle.toFixed(2)}deg`);
        animatedElement.style.setProperty("--photo-scale", item.scale.toFixed(3));
      }
    });

    charmUnits.forEach((item) => {
      if (item.charm && item.pupils.length) {
        const charmRect = item.charm.getBoundingClientRect();
        const charmCenterX = charmRect.left + charmRect.width / 2;
        const charmCenterY = charmRect.top + charmRect.height / 2;
        const lookX = pointerX - charmCenterX;
        const lookY = pointerY - charmCenterY;
        const lookLength = Math.max(1, Math.hypot(lookX, lookY));
        const normalizedX = lookX / lookLength;
        const normalizedY = lookY / lookLength;
        const maxOffsetX = 3.8;
        const maxOffsetY = 4.4;
        const targetPupilX = normalizedX * maxOffsetX;
        const targetPupilY = normalizedY * maxOffsetY;

        item.pupilX += (targetPupilX - item.pupilX) * 0.24;
        item.pupilY += (targetPupilY - item.pupilY) * 0.24;

        item.pupils.forEach((pupil) => {
          pupil.style.transform = `translate(-50%, -50%) translate(${item.pupilX.toFixed(2)}px, ${item.pupilY.toFixed(2)}px)`;
        });
      }
    });

    animationFrame = window.requestAnimationFrame(animateUnits);
  };

  const updateScenePointer = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };

  if (galleryScene) {
    galleryScene.addEventListener("pointermove", updateScenePointer, { passive: true });
  }

=======

      const acceleration = (item.target - item.angle) * SHARED_TENSION;
      item.velocity = (item.velocity + acceleration) * SHARED_DAMPING;
      item.angle += item.velocity;
      item.angle = Math.max(-SHARED_MAX_SWING, Math.min(SHARED_MAX_SWING, item.angle));
      item.scale += ((isHovered ? 1.006 : 1) - item.scale) * 0.05;

      if (animatedElement) {
        animatedElement.style.setProperty("--photo-shift-x", `${item.shiftX.toFixed(2)}px`);
        animatedElement.style.setProperty("--photo-shift-y", `${item.shiftY.toFixed(2)}px`);
        animatedElement.style.setProperty("--photo-rotate", `${item.angle.toFixed(2)}deg`);
        animatedElement.style.setProperty("--photo-scale", item.scale.toFixed(3));
      }
    });

    charmUnits.forEach((item) => {
      if (item.charm && item.pupils.length) {
        const charmRect = item.charm.getBoundingClientRect();
        const charmCenterX = charmRect.left + charmRect.width / 2;
        const charmCenterY = charmRect.top + charmRect.height / 2;
        const lookX = pointerX - charmCenterX;
        const lookY = pointerY - charmCenterY;
        const lookLength = Math.max(1, Math.hypot(lookX, lookY));
        const normalizedX = lookX / lookLength;
        const normalizedY = lookY / lookLength;
        const maxOffsetX = 3.8;
        const maxOffsetY = 4.4;
        const targetPupilX = normalizedX * maxOffsetX;
        const targetPupilY = normalizedY * maxOffsetY;

        item.pupilX += (targetPupilX - item.pupilX) * 0.24;
        item.pupilY += (targetPupilY - item.pupilY) * 0.24;

        item.pupils.forEach((pupil) => {
          pupil.style.transform = `translate(-50%, -50%) translate(${item.pupilX.toFixed(2)}px, ${item.pupilY.toFixed(2)}px)`;
        });
      }
    });

    animationFrame = window.requestAnimationFrame(animateUnits);
  };

  const updateScenePointer = (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  };

  if (galleryScene) {
    galleryScene.addEventListener("pointermove", updateScenePointer, { passive: true });
  }

>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
  photoUnits.forEach((item) => {
    const { element } = item;

    element.addEventListener("mouseenter", () => {
      element.classList.add("is-hovered");
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("is-hovered");
    });
  });
<<<<<<< HEAD

  animationFrame = window.requestAnimationFrame(animateUnits);

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
}

const revealCards = Array.from(document.querySelectorAll(".reveal-card"));
const INITIAL_VISIBLE_GALLERY_COUNT = 12;
const LOAD_MORE_BATCH_SIZE = 6;

if (revealCards.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  const observeVisibleCards = () => {
    revealCards
      .filter((card) => !card.classList.contains("is-hidden-card"))
      .forEach((card, index) => {
        card.style.setProperty("--stagger", `${index * 70}ms`);
        revealObserver.observe(card);
      });
  };

  revealCards.forEach((card, index) => {
    if (index >= INITIAL_VISIBLE_GALLERY_COUNT) {
      card.classList.add("is-hidden-card");
    }
  });

  observeVisibleCards();

  const loadMoreButton = document.querySelector(".load-more-btn");

  if (loadMoreButton) {
    const updateLoadMoreState = () => {
      const remainingCards = revealCards.filter((card) => card.classList.contains("is-hidden-card"));

      if (!remainingCards.length) {
        loadMoreButton.textContent = "No More Images";
        loadMoreButton.classList.add("is-finished");
        loadMoreButton.hidden = true;
        return;
      }

      loadMoreButton.textContent = "Load More Stories";
      loadMoreButton.classList.remove("is-finished");
    };

    updateLoadMoreState();

    loadMoreButton.addEventListener("click", () => {
      const nextBatch = revealCards
        .filter((card) => card.classList.contains("is-hidden-card"))
        .slice(0, LOAD_MORE_BATCH_SIZE);

      if (!nextBatch.length) {
        updateLoadMoreState();
        return;
      }

      nextBatch.forEach((card) => {
        card.classList.remove("is-hidden-card");
        card.classList.add("is-visible");
      });

      updateLoadMoreState();
    });
  }
}

const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const backdrop = lightbox.querySelector(".lightbox-backdrop");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const storyCards = Array.from(document.querySelectorAll(".story-card"));
  let activeStoryIndex = -1;

  const updateLightboxImage = (index) => {
    const storyCard = storyCards[index];

    if (!storyCard || !lightboxImage) {
      return;
    }

    const imagePath = storyCard.dataset.lightboxImage;
    const imageElement = storyCard.querySelector("img");
    lightboxImage.src = imagePath || "";
    lightboxImage.alt = imageElement?.alt || "Expanded wedding gallery image";
    activeStoryIndex = index;
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    activeStoryIndex = -1;
    if (lightboxImage) {
      lightboxImage.src = "";
    }
  };

  const navigateLightbox = (direction) => {
    if (!storyCards.length) {
      return;
    }

    const nextIndex =
      activeStoryIndex < 0
        ? 0
        : (activeStoryIndex + direction + storyCards.length) % storyCards.length;

    updateLightboxImage(nextIndex);
  };

  storyCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (!lightboxImage) {
        return;
      }

      updateLightboxImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  backdrop?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => navigateLightbox(-1));
  nextButton?.addEventListener("click", () => navigateLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }

    if (event.key === "ArrowLeft" && !lightbox.hidden) {
      navigateLightbox(-1);
    }

    if (event.key === "ArrowRight" && !lightbox.hidden) {
      navigateLightbox(1);
=======

  animationFrame = window.requestAnimationFrame(animateUnits);

  window.addEventListener("beforeunload", () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
  });
}

const revealCards = Array.from(document.querySelectorAll(".reveal-card"));
const INITIAL_VISIBLE_GALLERY_COUNT = 12;
const LOAD_MORE_BATCH_SIZE = 6;

if (revealCards.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  const observeVisibleCards = () => {
    revealCards
      .filter((card) => !card.classList.contains("is-hidden-card"))
      .forEach((card, index) => {
        card.style.setProperty("--stagger", `${index * 70}ms`);
        revealObserver.observe(card);
      });
  };

  revealCards.forEach((card, index) => {
    if (index >= INITIAL_VISIBLE_GALLERY_COUNT) {
      card.classList.add("is-hidden-card");
    }
  });

  observeVisibleCards();

  const loadMoreButton = document.querySelector(".load-more-btn");

  if (loadMoreButton) {
    const updateLoadMoreState = () => {
      const remainingCards = revealCards.filter((card) => card.classList.contains("is-hidden-card"));

      if (!remainingCards.length) {
        loadMoreButton.textContent = "No More Images";
        loadMoreButton.classList.add("is-finished");
        loadMoreButton.hidden = true;
        return;
      }

      loadMoreButton.textContent = "Load More Stories";
      loadMoreButton.classList.remove("is-finished");
    };

    updateLoadMoreState();

    loadMoreButton.addEventListener("click", () => {
      const nextBatch = revealCards
        .filter((card) => card.classList.contains("is-hidden-card"))
        .slice(0, LOAD_MORE_BATCH_SIZE);

      if (!nextBatch.length) {
        updateLoadMoreState();
        return;
      }

      nextBatch.forEach((card) => {
        card.classList.remove("is-hidden-card");
        card.classList.add("is-visible");
      });

      updateLoadMoreState();
    });
  }
}

const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const backdrop = lightbox.querySelector(".lightbox-backdrop");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const storyCards = Array.from(document.querySelectorAll(".story-card"));
  let activeStoryIndex = -1;

  const updateLightboxImage = (index) => {
    const storyCard = storyCards[index];

    if (!storyCard || !lightboxImage) {
      return;
    }

    const imagePath = storyCard.dataset.lightboxImage;
    const imageElement = storyCard.querySelector("img");
    lightboxImage.src = imagePath || "";
    lightboxImage.alt = imageElement?.alt || "Expanded wedding gallery image";
    activeStoryIndex = index;
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    activeStoryIndex = -1;
    if (lightboxImage) {
      lightboxImage.src = "";
    }
  };

  const navigateLightbox = (direction) => {
    if (!storyCards.length) {
      return;
    }

    const nextIndex =
      activeStoryIndex < 0
        ? 0
        : (activeStoryIndex + direction + storyCards.length) % storyCards.length;

    updateLightboxImage(nextIndex);
  };

  storyCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (!lightboxImage) {
        return;
      }

      updateLightboxImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  backdrop?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => navigateLightbox(-1));
  nextButton?.addEventListener("click", () => navigateLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }

    if (event.key === "ArrowLeft" && !lightbox.hidden) {
      navigateLightbox(-1);
    }

    if (event.key === "ArrowRight" && !lightbox.hidden) {
      navigateLightbox(1);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
    }
  });
}

const aboutRevealItems = Array.from(document.querySelectorAll(".about-reveal"));
const aboutStatNumbers = Array.from(document.querySelectorAll(".about-stat-num"));

if (aboutRevealItems.length) {
  const animatedStats = new WeakSet();

  const animateStatValue = (element) => {
    if (!element || animatedStats.has(element)) {
      return;
    }

    animatedStats.add(element);
    const target = Number(element.dataset.target || 0);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased).toString();

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        const statValue = entry.target.querySelector(".about-stat-num");
        if (statValue) {
          animateStatValue(statValue);
        }
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  aboutRevealItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 80}ms`;
    aboutObserver.observe(item);
  });

  aboutStatNumbers.forEach((item) => {
    const parentCard = item.closest(".about-stat-card");
    if (!parentCard) {
      animateStatValue(item);
    }
  });
}

const aboutGalleryStrip = document.querySelector(".about-gallery-strip");
const aboutGalleryPrev = document.querySelector(".about-gallery-prev");
const aboutGalleryNext = document.querySelector(".about-gallery-next");

if (aboutGalleryStrip && aboutGalleryPrev && aboutGalleryNext) {
  const getScrollAmount = () => {
    const firstImage = aboutGalleryStrip.querySelector("img");
    if (!firstImage) {
      return 320;
    }

    const imageStyles = window.getComputedStyle(firstImage);
    const gap = Number.parseFloat(window.getComputedStyle(aboutGalleryStrip).columnGap || window.getComputedStyle(aboutGalleryStrip).gap || "16");
    const width = firstImage.getBoundingClientRect().width;
    const marginRight = Number.parseFloat(imageStyles.marginRight || "0");
    return width + gap + marginRight;
  };

  const updateGalleryButtons = () => {
    const maxScrollLeft = aboutGalleryStrip.scrollWidth - aboutGalleryStrip.clientWidth;
    aboutGalleryPrev.disabled = aboutGalleryStrip.scrollLeft <= 8;
    aboutGalleryNext.disabled = aboutGalleryStrip.scrollLeft >= maxScrollLeft - 8;
  };

  const scrollGallery = (direction) => {
    aboutGalleryStrip.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth",
    });
  };

  aboutGalleryPrev.addEventListener("click", () => scrollGallery(-1));
  aboutGalleryNext.addEventListener("click", () => scrollGallery(1));
  aboutGalleryStrip.addEventListener("scroll", updateGalleryButtons, { passive: true });
  window.addEventListener("resize", updateGalleryButtons);
  updateGalleryButtons();
}

<<<<<<< HEAD
const navLinks = document.querySelectorAll(".top-nav a");
if (navLinks.length) {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("is-active");
    }
  });
}

const portfolioFilterButtons = Array.from(document.querySelectorAll(".portfolio-filter-btn"));
const portfolioFilterImages = Array.from(document.querySelectorAll(".portfolio-image-item"));

if (portfolioFilterButtons.length && portfolioFilterImages.length) {
  const applyFilter = (filter) => {
    portfolioFilterImages.forEach((img) => {
      const category = img.dataset.category || "all";
      const shouldShow = filter === "all" || category === filter;
      if (shouldShow) {
        img.style.display = "block";
        requestAnimationFrame(() => img.classList.remove("is-hidden"));
      } else {
        img.classList.add("is-hidden");
        window.setTimeout(() => {
          if (img.classList.contains("is-hidden")) {
            img.style.display = "none";
          }
        }, 350);
      }
    });
  };

  portfolioFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      portfolioFilterButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilter(filter);
    });
  });
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");
const portfolioViewImages = Array.from(document.querySelectorAll(".portfolio-image-item"));

if (lightbox && lightboxImage && portfolioViewImages.length) {
  let activeIndex = -1;

  const openLightbox = (index) => {
    const card = portfolioViewImages[index];
    const img = card ? card.querySelector("img") : null;
    if (!img) return;
    lightboxImage.src = img.src;
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    activeIndex = index;
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    window.setTimeout(() => {
      lightbox.hidden = true;
    }, 200);
    document.body.style.overflow = "";
  };

  const navigate = (direction) => {
    if (activeIndex < 0) return;
    const nextIndex =
      (activeIndex + direction + portfolioViewImages.length) % portfolioViewImages.length;
    openLightbox(nextIndex);
  };

  portfolioViewImages.forEach((card, index) => {
    const viewBtn = card.querySelector(".portfolio-view-btn");
    card.addEventListener("click", () => openLightbox(index));
    viewBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      openLightbox(index);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxBackdrop?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => navigate(-1));
  lightboxNext?.addEventListener("click", () => navigate(1));

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      navigate(1);
    }
  });
}

=======
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
const photographerRunner = document.querySelector(".photographer-runner");
const photographerFlash = document.querySelector(".photographer-flash");

if (photographerRunner && photographerFlash) {
  const STEP_DISTANCE = 72;
  const WALK_SPEED = 88;
  const SHOOT_PAUSE_MS = 820;
  const END_PAUSE_MS = 680;
<<<<<<< HEAD
=======
  const MAX_BOUNCE = 7;
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
  let direction = 1;
  let x = 0;
  let minX = 12;
  let maxX = 0;
  let travelledSinceShot = 0;
  let isShooting = false;
  let isTurning = false;
  let pauseUntil = 0;
  let lastFrame = performance.now();
<<<<<<< HEAD
=======
  let walkTime = 0;
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc

  const updateBounds = () => {
    const width = photographerRunner.offsetWidth || 160;
    minX = 12;
    maxX = Math.max(minX, window.innerWidth - width - 12);
    x = Math.min(Math.max(x, minX), maxX);
  };

  const triggerFlash = () => {
    photographerFlash.classList.remove("is-active");
    void photographerFlash.offsetWidth;
    photographerFlash.classList.add("is-active");
  };

<<<<<<< HEAD
  const renderRunner = (zoom = 1) => {
    const flip = direction === 1 ? 1 : -1;
    photographerRunner.style.transform =
      `translate3d(${x.toFixed(1)}px, 0, 0) scale(${zoom}) scaleX(${flip})`;
=======
  const renderRunner = (bounce = 0, zoom = 1) => {
    const flip = direction === 1 ? 1 : -1;
    photographerRunner.style.transform =
      `translate3d(${x.toFixed(1)}px, ${bounce.toFixed(1)}px, 0) scale(${zoom}) scaleX(${flip})`;
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
  };

  const beginShoot = (now) => {
    isShooting = true;
    pauseUntil = now + SHOOT_PAUSE_MS;
    travelledSinceShot = 0;
    photographerRunner.classList.add("is-shooting");
<<<<<<< HEAD
    renderRunner(1.08);
=======
    renderRunner(-12, 1.09);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
    window.setTimeout(triggerFlash, 180);
    window.setTimeout(() => photographerRunner.classList.remove("is-shooting"), SHOOT_PAUSE_MS - 140);
  };

  const turnAround = (now) => {
    isTurning = true;
    pauseUntil = now + END_PAUSE_MS;
    direction *= -1;
    photographerRunner.style.transition = "transform 420ms ease";
<<<<<<< HEAD
    renderRunner(1);
=======
    renderRunner(-4, 1);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
    window.setTimeout(() => {
      photographerRunner.style.transition = "none";
      isTurning = false;
    }, 420);
  };

  const animateRunner = (now) => {
    const delta = Math.min((now - lastFrame) / 1000, 0.04);
    lastFrame = now;

    if (now < pauseUntil) {
      if (isShooting) {
<<<<<<< HEAD
        renderRunner(1.08);
=======
        renderRunner(-10, 1.08);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
      }
      window.requestAnimationFrame(animateRunner);
      return;
    }

    if (isShooting) {
      isShooting = false;
      photographerRunner.classList.remove("is-shooting");
    }

    if (!isTurning) {
      const move = WALK_SPEED * delta * direction;
      x += move;
      travelledSinceShot += Math.abs(move);
<<<<<<< HEAD

      if ((direction === 1 && x >= maxX) || (direction === -1 && x <= minX)) {
        x = direction === 1 ? maxX : minX;
        renderRunner(1);
=======
      walkTime += delta * 7.2;

      if ((direction === 1 && x >= maxX) || (direction === -1 && x <= minX)) {
        x = direction === 1 ? maxX : minX;
        renderRunner(0, 1);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
        turnAround(now);
        window.requestAnimationFrame(animateRunner);
        return;
      }

      if (travelledSinceShot >= STEP_DISTANCE * 3) {
        beginShoot(now);
        window.requestAnimationFrame(animateRunner);
        return;
      }

<<<<<<< HEAD
      renderRunner(1);
=======
      const bounce = Math.abs(Math.sin(walkTime)) * -MAX_BOUNCE;
      renderRunner(bounce, 1);
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
    }

    window.requestAnimationFrame(animateRunner);
  };

  updateBounds();
  x = minX;
  renderRunner(0, 1);
  window.addEventListener("resize", updateBounds);
  window.requestAnimationFrame((now) => {
    lastFrame = now;
    animateRunner(now);
  });
}
<<<<<<< HEAD

const photographerStory = document.querySelector(".photographer-story");
const photographerBubble = document.querySelector(".photographer-bubble");
const photographerBubbleText = document.querySelector(".photographer-bubble-text");
const homeModelTrigger = document.querySelector(".home-model-trigger");

if (photographerStory && photographerFlash && homeModelTrigger) {
  const messages = ["Smile 😊", "Look here 📸", "Perfect shot ✨", "One more!"];
  let activeIndex = 0;
  let loopTimer = null;
  let isActive = false;

  const triggerFlash = () => {
    photographerFlash.classList.remove("is-active");
    void photographerFlash.offsetWidth;
    photographerFlash.classList.add("is-active");
  };

  const showBubble = (text) => {
    if (!photographerBubble || !photographerBubbleText) return;
    photographerBubble.classList.remove("is-show");
    window.setTimeout(() => {
      photographerBubbleText.textContent = text;
      photographerBubble.classList.add("is-show");
      triggerFlash();
      photographerStory.classList.add("is-flashing");
      window.setTimeout(() => photographerStory.classList.remove("is-flashing"), 220);
    }, 120);
  };

  const runSequence = () => {
    if (!isActive) return;
    showBubble(messages[activeIndex]);
    activeIndex = (activeIndex + 1) % messages.length;
    loopTimer = window.setTimeout(runSequence, 2300);
  };

  const stopSequence = () => {
    isActive = false;
    if (loopTimer) {
      window.clearTimeout(loopTimer);
      loopTimer = null;
    }
    if (photographerBubble) {
      photographerBubble.classList.remove("is-show");
    }
  };

  const startSequence = () => {
    if (isActive) return;
    isActive = true;
    activeIndex = 0;
    runSequence();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          photographerStory.classList.add("is-visible");
          startSequence();
        } else {
          photographerStory.classList.remove("is-visible");
          stopSequence();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(homeModelTrigger);
}

const revealTargets = document.querySelectorAll(".reveal-on-scroll");
if (revealTargets.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const countTargets = document.querySelectorAll(".count-up");
if (countTargets.length > 0) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCount = (el) => {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    const targetValue = Number.parseInt(el.dataset.target, 10);
    if (!Number.isFinite(targetValue)) return;

    if (prefersReducedMotion) {
      el.textContent = `${targetValue}`;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(targetValue * eased);
      el.textContent = `${currentValue}`;
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    countTargets.forEach((target) => countObserver.observe(target));
  } else {
    countTargets.forEach((target) => animateCount(target));
  }
}
=======
>>>>>>> 485e509dae385c61c38c00666c9f5131a423b1cc
