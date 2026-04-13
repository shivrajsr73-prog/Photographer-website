const hero = document.querySelector(".hero");
const sharedBackdrop = document.querySelector(".shared-backdrop");

if (hero && sharedBackdrop) {
  const heroImages = ["images/image1.png", "images/image2.png"];
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
    }, 3000);
  }
}

// Removed scroll-driven hero shifts to keep layout stable.

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

const contactHero = document.querySelector(".contact-page .hero#contact");
const ambientOrbs = Array.from(document.querySelectorAll(".contact-page .contact-hero-ambient .ambient-orb"));

if (contactHero && ambientOrbs.length) {
  const REPEL_RADIUS = 220;
  const MAX_PUSH = 78;
  let pointerX = -9999;
  let pointerY = -9999;
  let rafId = null;

  const applyRepel = () => {
    ambientOrbs.forEach((orb) => {
      const rect = orb.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = centerX - pointerX;
      const dy = centerY - pointerY;
      const distance = Math.hypot(dx, dy);

      if (distance < REPEL_RADIUS && distance > 0.001) {
        const strength = (REPEL_RADIUS - distance) / REPEL_RADIUS;
        const push = MAX_PUSH * strength;
        const shiftX = (dx / distance) * push;
        const shiftY = (dy / distance) * push;
        orb.style.setProperty("--orb-repel-x", `${shiftX.toFixed(2)}px`);
        orb.style.setProperty("--orb-repel-y", `${shiftY.toFixed(2)}px`);
      } else {
        orb.style.setProperty("--orb-repel-x", "0px");
        orb.style.setProperty("--orb-repel-y", "0px");
      }
    });

    rafId = null;
  };

  const requestRepelUpdate = () => {
    if (rafId !== null) {
      return;
    }
    rafId = window.requestAnimationFrame(applyRepel);
  };

  contactHero.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    requestRepelUpdate();
  }, { passive: true });

  window.addEventListener("pointermove", (event) => {
    const heroRect = contactHero.getBoundingClientRect();
    if (
      event.clientX >= heroRect.left &&
      event.clientX <= heroRect.right &&
      event.clientY >= heroRect.top &&
      event.clientY <= heroRect.bottom
    ) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      requestRepelUpdate();
    }
  }, { passive: true });

  contactHero.addEventListener("pointerleave", () => {
    pointerX = -9999;
    pointerY = -9999;
    requestRepelUpdate();
  });
}

const eventPicker = document.querySelector(".event-picker");

if (eventPicker) {
  const eventValue = eventPicker.querySelector(".event-picker-value");
  const eventButtons = eventPicker.querySelectorAll(".event-option");
  const customEventInput = eventPicker.querySelector(".custom-event-input");
  const eventOkButton = eventPicker.querySelector(".picker-ok");
  let selectedEvent = "";
  const preventEnterSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const updateEventLabel = () => {
    if (selectedEvent === "Etc." && customEventInput && customEventInput.value.trim()) {
      if (eventValue) {
        eventValue.textContent = customEventInput.value.trim();
      }
      return;
    }

    if (eventValue) {
      eventValue.textContent = selectedEvent || "Click to choose";
    }
  };

  eventButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedEvent = button.dataset.value || "";

      eventButtons.forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");

      const showCustomEvent = selectedEvent === "Etc.";

      if (customEventInput) {
        customEventInput.hidden = !showCustomEvent;

        if (showCustomEvent) {
          customEventInput.focus();
        } else {
          customEventInput.value = "";
          eventPicker.removeAttribute("open");
        }
      } else {
        eventPicker.removeAttribute("open");
      }

      updateEventLabel();
    });
  });

  customEventInput?.addEventListener("input", updateEventLabel);
  customEventInput?.addEventListener("keydown", preventEnterSubmit);

  eventOkButton?.addEventListener("click", () => {
    updateEventLabel();
    eventPicker.removeAttribute("open");
    document.querySelector(".budget-details summary")?.focus();
  });

  updateEventLabel();
}

const budgetDetails = document.querySelector(".budget-details");
const customBudgetInput = document.querySelector(".custom-budget-input");

if (budgetDetails && customBudgetInput) {
  const budgetValue = budgetDetails.querySelector(".budget-value");
  const budgetButtons = budgetDetails.querySelectorAll(".budget-option");
  const budgetOkButton = budgetDetails.querySelector(".picker-ok");
  let selectedBudget = "";
  const preventEnterSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const validateCustomBudget = () => {
    if (customBudgetInput.value && Number(customBudgetInput.value) < 20000) {
      customBudgetInput.setCustomValidity("Minimum budget must be 20,000");
      return false;
    }
    customBudgetInput.setCustomValidity("");
    return true;
  };

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

  customBudgetInput.addEventListener("input", () => {
    updateBudgetLabel();
    validateCustomBudget();
  });
  customBudgetInput.addEventListener("keydown", preventEnterSubmit);

  budgetOkButton?.addEventListener("click", () => {
    updateBudgetLabel();
    budgetDetails.removeAttribute("open");
    contactForm?.querySelector('button[type="submit"]')?.focus();
  });
  updateBudgetLabel();
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const customBudgetField = contactForm.querySelector(".custom-budget-input");
    if (
      customBudgetField &&
      !customBudgetField.hidden &&
      customBudgetField.value &&
      Number(customBudgetField.value) < 20000
    ) {
      customBudgetField.setCustomValidity("Minimum budget must be 20,000");
      customBudgetField.reportValidity();
      return;
    }
    customBudgetField?.setCustomValidity("");

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

  contactForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.tagName !== "BUTTON" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
    }
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

  const hasDatePickerParts =
    dateDisplay &&
    dateValue &&
    popup &&
    title &&
    grid &&
    prevBtn &&
    nextBtn &&
    clearBtn &&
    todayBtn;

  if (!hasDatePickerParts) {
    // Missing expected date picker elements on this page.
    // Skip wiring to avoid runtime errors.
  } else {

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
}

const hangingColumns = Array.from(document.querySelectorAll(".hanging-column"));
const columnPhotos = Array.from(document.querySelectorAll(".column-photo"));
const featuredPhoto = document.querySelector(".featured-photo");

if (hangingColumns.length || featuredPhoto) {
  const galleryScene = document.querySelector(".gallery-scene");
  const SHARED_IDLE_AMPLITUDE = 2.8;
  const SHARED_IDLE_SPEED = 0.52;
  const SHARED_MAX_SWING = 3.4;
  const SHARED_TENSION = 0.06;
  const SHARED_DAMPING = 0.94;
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
      shiftY: 0,
      shiftX: 0,
      scale: 1,
      depth: Number(photo.dataset.depth || 0.8),
      idlePhase: index * 0.45,
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
      shiftY: 0,
      shiftX: 0,
      scale: 1,
      curve: 0,
      depth: 1,
      idlePhase: 2.2,
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

  photoUnits.forEach((item) => {
    const { element } = item;

    element.addEventListener("mouseenter", () => {
      element.classList.add("is-hovered");
    });

    element.addEventListener("mouseleave", () => {
      element.classList.remove("is-hovered");
    });
  });

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

const storyLightbox = document.querySelector(".lightbox");
const storyCards = Array.from(document.querySelectorAll(".story-card"));

if (storyLightbox && storyCards.length) {
  const storyLightboxImage = storyLightbox.querySelector(".lightbox-image");
  const storyLightboxClose = storyLightbox.querySelector(".lightbox-close");
  const storyLightboxBackdrop = storyLightbox.querySelector(".lightbox-backdrop");
  const storyLightboxPrev = storyLightbox.querySelector(".lightbox-prev");
  const storyLightboxNext = storyLightbox.querySelector(".lightbox-next");
  let activeStoryIndex = -1;

  const updateLightboxImage = (index) => {
    const storyCard = storyCards[index];

    if (!storyCard || !storyLightboxImage) {
      return;
    }

    const imagePath = storyCard.dataset.lightboxImage;
    const imageElement = storyCard.querySelector("img");
    storyLightboxImage.src = imagePath || "";
    storyLightboxImage.alt = imageElement?.alt || "Expanded wedding gallery image";
    activeStoryIndex = index;
  };

  const closeLightbox = () => {
    storyLightbox.classList.remove("is-open");
    window.setTimeout(() => {
      storyLightbox.hidden = true;
    }, 200);
    document.body.style.overflow = "";
    activeStoryIndex = -1;
    if (storyLightboxImage) {
      storyLightboxImage.src = "";
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
      if (!storyLightboxImage) {
        return;
      }

      updateLightboxImage(index);
      storyLightbox.hidden = false;
      storyLightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });

  storyLightboxClose?.addEventListener("click", closeLightbox);
  storyLightboxBackdrop?.addEventListener("click", closeLightbox);
  storyLightboxPrev?.addEventListener("click", () => navigateLightbox(-1));
  storyLightboxNext?.addEventListener("click", () => navigateLightbox(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !storyLightbox.hidden) {
      closeLightbox();
    }

    if (event.key === "ArrowLeft" && !storyLightbox.hidden) {
      navigateLightbox(-1);
    }

    if (event.key === "ArrowRight" && !storyLightbox.hidden) {
      navigateLightbox(1);
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

const navLinks = document.querySelectorAll(".top-nav-links a");
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

const portfolioLightbox = document.querySelector(".lightbox");
const portfolioLightboxImage = document.querySelector(".lightbox-image");
const portfolioLightboxClose = document.querySelector(".lightbox-close");
const portfolioLightboxPrev = document.querySelector(".lightbox-prev");
const portfolioLightboxNext = document.querySelector(".lightbox-next");
const portfolioLightboxBackdrop = document.querySelector(".lightbox-backdrop");
const portfolioViewImages = Array.from(document.querySelectorAll(".portfolio-image-item"));

if (portfolioLightbox && portfolioLightboxImage && portfolioViewImages.length) {
  let activeIndex = -1;

  const openLightbox = (index) => {
    const card = portfolioViewImages[index];
    const img = card ? card.querySelector("img") : null;
    if (!img) return;
    portfolioLightboxImage.src = img.src;
    portfolioLightbox.hidden = false;
    void portfolioLightbox.offsetWidth;
    portfolioLightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    activeIndex = index;
  };

  const closeLightbox = () => {
    portfolioLightbox.classList.remove("is-open");
    window.setTimeout(() => {
      portfolioLightbox.hidden = true;
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

  portfolioLightboxClose?.addEventListener("click", closeLightbox);
  portfolioLightboxBackdrop?.addEventListener("click", closeLightbox);
  portfolioLightboxPrev?.addEventListener("click", () => navigate(-1));
  portfolioLightboxNext?.addEventListener("click", () => navigate(1));

  document.addEventListener("keydown", (event) => {
    if (portfolioLightbox.hidden) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      navigate(1);
    }
  });
}

const contactGalleryCards = Array.from(document.querySelectorAll(".contact-gallery-card"));
if (contactGalleryCards.length && document.body.classList.contains("contact-page")) {
  const contactLightbox = document.querySelector(".lightbox");
  const contactLightboxImage = contactLightbox?.querySelector(".lightbox-image");
  const contactLightboxClose = contactLightbox?.querySelector(".lightbox-close");
  const contactLightboxPrev = contactLightbox?.querySelector(".lightbox-prev");
  const contactLightboxNext = contactLightbox?.querySelector(".lightbox-next");
  const contactLightboxBackdrop = contactLightbox?.querySelector(".lightbox-backdrop");
  let activeIndex = -1;

  if (contactLightbox && contactLightboxImage) {
    const galleryGrid = document.querySelector(".contact-gallery-grid");

    const updateContactImage = (index) => {
      const card = contactGalleryCards[index];
      const img = card?.querySelector("img");
      if (!img) return false;
      contactLightboxImage.src = img.src;
      contactLightboxImage.alt = img.alt || "Expanded wedding gallery image";
      activeIndex = index;
      return true;
    };

    const openContactLightbox = (index) => {
      if (!updateContactImage(index)) return;
      contactLightbox.hidden = false;
      contactLightbox.classList.add("is-open");
    };

    const closeContactLightbox = () => {
      contactLightbox.classList.remove("is-open");
      contactLightbox.hidden = true;
      contactLightboxImage.removeAttribute("src");
      activeIndex = -1;
    };

    const navigate = (direction) => {
      if (!contactGalleryCards.length || activeIndex < 0) return;
      const nextIndex = (activeIndex + direction + contactGalleryCards.length) % contactGalleryCards.length;
      updateContactImage(nextIndex);
    };

    contactGalleryCards.forEach((card, index) => {
      card.setAttribute("role", "button");
      card.tabIndex = 0;
      card.dataset.galleryIndex = String(index);
      const image = card.querySelector("img");
      image?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openContactLightbox(index);
      });
    });

    galleryGrid?.addEventListener("click", (event) => {
      const card = event.target.closest(".contact-gallery-card");
      if (!card || !galleryGrid.contains(card)) return;
      const index = Number(card.dataset.galleryIndex);
      if (Number.isNaN(index)) return;
      openContactLightbox(index);
    });

    galleryGrid?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest(".contact-gallery-card");
      if (!card || !galleryGrid.contains(card)) return;
      event.preventDefault();
      const index = Number(card.dataset.galleryIndex);
      if (Number.isNaN(index)) return;
      openContactLightbox(index);
    });

    contactLightboxClose?.addEventListener("click", closeContactLightbox);
    contactLightboxBackdrop?.addEventListener("click", closeContactLightbox);
    contactLightboxPrev?.addEventListener("click", () => navigate(-1));
    contactLightboxNext?.addEventListener("click", () => navigate(1));

    document.addEventListener("keydown", (event) => {
      if (contactLightbox.hidden || activeIndex < 0) return;
      if (event.key === "Escape") {
        closeContactLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        navigate(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        navigate(1);
      }
    });
  }
}

const photographerRunner = document.querySelector(".photographer-runner");
const photographerFlash = document.querySelector(".photographer-flash");

if (photographerRunner && photographerFlash) {
  const STEP_DISTANCE = 72;
  const WALK_SPEED = 88;
  const SHOOT_PAUSE_MS = 820;
  const END_PAUSE_MS = 680;
  let direction = 1;
  let x = 0;
  let minX = 12;
  let maxX = 0;
  let travelledSinceShot = 0;
  let isShooting = false;
  let isTurning = false;
  let pauseUntil = 0;
  let lastFrame = performance.now();

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

  const renderRunner = (zoom = 1) => {
    const flip = direction === 1 ? 1 : -1;
    photographerRunner.style.transform =
      `translate3d(${x.toFixed(1)}px, 0, 0) scale(${zoom}) scaleX(${flip})`;
  };

  const beginShoot = (now) => {
    isShooting = true;
    pauseUntil = now + SHOOT_PAUSE_MS;
    travelledSinceShot = 0;
    photographerRunner.classList.add("is-shooting");
    renderRunner(1.08);
    window.setTimeout(triggerFlash, 180);
    window.setTimeout(() => photographerRunner.classList.remove("is-shooting"), SHOOT_PAUSE_MS - 140);
  };

  const turnAround = (now) => {
    isTurning = true;
    pauseUntil = now + END_PAUSE_MS;
    direction *= -1;
    photographerRunner.style.transition = "transform 420ms ease";
    renderRunner(1);
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
        renderRunner(1.08);
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

      if ((direction === 1 && x >= maxX) || (direction === -1 && x <= minX)) {
        x = direction === 1 ? maxX : minX;
        renderRunner(1);
        turnAround(now);
        window.requestAnimationFrame(animateRunner);
        return;
      }

      if (travelledSinceShot >= STEP_DISTANCE * 3) {
        beginShoot(now);
        window.requestAnimationFrame(animateRunner);
        return;
      }

      renderRunner(1);
    }

    window.requestAnimationFrame(animateRunner);
  };

  updateBounds();
  x = minX;
  renderRunner(1);
  window.addEventListener("resize", updateBounds);
  window.requestAnimationFrame((now) => {
    lastFrame = now;
    animateRunner(now);
  });
}

const photographerStory = document.querySelector(".photographer-story");
const photographerBubble = document.querySelector(".photographer-bubble");
const photographerBubbleText = document.querySelector(".photographer-bubble-text");
const homeModelTrigger = document.querySelector(".home-model-trigger");

if (photographerStory && photographerFlash && homeModelTrigger) {
  const messages = ["Smile", "Look here", "Perfect shot", "One more!"];
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
    void photographerBubble.offsetWidth;
    photographerBubbleText.textContent = text;
    photographerBubble.classList.add("is-show");
    window.setTimeout(() => {
      triggerFlash();
      photographerStory.classList.add("is-flashing");
      window.setTimeout(() => photographerStory.classList.remove("is-flashing"), 220);
    }, 140);
  };

  const runSequence = () => {
    if (!isActive) return;
    showBubble(messages[activeIndex]);
    activeIndex = (activeIndex + 1) % messages.length;
    loopTimer = window.setTimeout(runSequence, 1800);
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
    { threshold: 0.08 }
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

const homeGalleryCards = Array.from(document.querySelectorAll(".home-gallery-card"));
if (homeGalleryCards.length && !document.body.classList.contains("contact-page")) {
  const homeLightbox = document.querySelector(".lightbox");
  const homeLightboxImage = homeLightbox?.querySelector(".lightbox-image");
  const homeLightboxClose = homeLightbox?.querySelector(".lightbox-close");
  const homeLightboxPrev = homeLightbox?.querySelector(".lightbox-prev");
  const homeLightboxNext = homeLightbox?.querySelector(".lightbox-next");
  const homeLightboxBackdrop = homeLightbox?.querySelector(".lightbox-backdrop");
  let activeHomeIndex = -1;

  if (homeLightbox && homeLightboxImage) {
    const updateHomeImage = (index) => {
      const card = homeGalleryCards[index];
      const img = card?.querySelector("img");
      if (!img) return false;
      homeLightboxImage.src = img.src;
      homeLightboxImage.alt = img.alt || "Expanded gallery image";
      activeHomeIndex = index;
      return true;
    };

    const openHomeLightbox = (index) => {
      if (!updateHomeImage(index)) return;
      homeLightbox.hidden = false;
      homeLightbox.classList.add("is-open");
    };

    const closeHomeLightbox = () => {
      homeLightbox.classList.remove("is-open");
      homeLightbox.hidden = true;
      homeLightboxImage.removeAttribute("src");
      activeHomeIndex = -1;
    };

    const navigateHome = (direction) => {
      if (!homeGalleryCards.length || activeHomeIndex < 0) return;
      const nextIndex = (activeHomeIndex + direction + homeGalleryCards.length) % homeGalleryCards.length;
      updateHomeImage(nextIndex);
    };

    homeGalleryCards.forEach((card, index) => {
      card.setAttribute("role", "button");
      card.tabIndex = 0;
      card.addEventListener("click", () => openHomeLightbox(index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openHomeLightbox(index);
        }
      });
    });

    homeLightboxClose?.addEventListener("click", closeHomeLightbox);
    homeLightboxBackdrop?.addEventListener("click", closeHomeLightbox);
    homeLightboxPrev?.addEventListener("click", () => navigateHome(-1));
    homeLightboxNext?.addEventListener("click", () => navigateHome(1));

    document.addEventListener("keydown", (event) => {
      if (homeLightbox.hidden || activeHomeIndex < 0) return;
      if (event.key === "Escape") {
        closeHomeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        navigateHome(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        navigateHome(1);
      }
    });
  }
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
