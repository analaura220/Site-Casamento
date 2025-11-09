document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const slides = carousel.querySelector(".slides");
    const items = Array.from(slides.children);
    const prev = carousel.querySelector(".prev");
    const next = carousel.querySelector(".next");
    let autoplayTimer = null;
    let isScrolling = false;

    // Triplicar as imagens para criar efeito de loop infinito suave
    const clonesBefore = items.map((item) => item.cloneNode(true));
    const clonesAfter = items.map((item) => item.cloneNode(true));

    clonesBefore.forEach((clone) =>
      slides.insertBefore(clone, slides.firstChild)
    );
    clonesAfter.forEach((clone) => slides.appendChild(clone));

    // Começar no meio (nas imagens originais)
    setTimeout(() => {
      const itemWidth = items[0].offsetWidth + 12; // width + gap
      slides.scrollLeft = itemWidth * items.length;
    }, 10);

    function scrollToNext() {
      if (isScrolling) return;
      isScrolling = true;

      const itemWidth = items[0].offsetWidth + 12;
      slides.scrollBy({ left: itemWidth, behavior: "smooth" });

      setTimeout(() => {
        checkAndResetPosition();
        isScrolling = false;
      }, 400);
    }

    function scrollToPrev() {
      if (isScrolling) return;
      isScrolling = true;

      const itemWidth = items[0].offsetWidth + 12;
      slides.scrollBy({ left: -itemWidth, behavior: "smooth" });

      setTimeout(() => {
        checkAndResetPosition();
        isScrolling = false;
      }, 400);
    }

    function checkAndResetPosition() {
      const itemWidth = items[0].offsetWidth + 12;
      const maxScroll = itemWidth * items.length * 2;
      const minScroll = itemWidth * items.length;

      // Se passou do final, voltar para o meio
      if (slides.scrollLeft >= maxScroll) {
        slides.scrollLeft = itemWidth * items.length;
      }
      // Se passou do início, voltar para o meio
      else if (slides.scrollLeft <= 0) {
        slides.scrollLeft = itemWidth * items.length;
      }
    }

    if (next)
      next.addEventListener("click", () => {
        stopAutoplay();
        scrollToNext();
      });
    if (prev)
      prev.addEventListener("click", () => {
        stopAutoplay();
        scrollToPrev();
      });

    // keyboard support
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        stopAutoplay();
        scrollToNext();
      }
      if (e.key === "ArrowLeft") {
        stopAutoplay();
        scrollToPrev();
      }
    });

    // click image to pause/play (toggle)
    slides.addEventListener("click", () => {
      if (autoplayTimer) stopAutoplay();
      else startAutoplay();
    });

    function startAutoplay() {
      const delay = parseInt(carousel.dataset.autoplayDelay || 4000, 10);
      if (carousel.dataset.autoplay === "true") {
        autoplayTimer = setInterval(scrollToNext, delay);
      }
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // start autoplay if requested
    startAutoplay();

    // pause on hover
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
  });

  // Countdown timer
  const body = document.querySelector("body");
  const weddingDateStr = body.getAttribute("data-wedding-date");

  if (weddingDateStr) {
    const weddingDate = new Date(weddingDateStr);
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
      const now = new Date();
      const diff = weddingDate - now;

      if (diff <= 0) {
        // Casamento já aconteceu
        if (daysEl) daysEl.textContent = "0";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    // Atualizar imediatamente
    updateCountdown();

    // Atualizar a cada segundo
    setInterval(updateCountdown, 1000);
  }
});
