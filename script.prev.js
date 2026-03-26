document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsContainer = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = 0;
  let autoTimer = null;

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i, true));
      dotsContainer.appendChild(dot);
    });
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    Array.from(dotsContainer.children).forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  const goToSlide = (index, manual = false) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    current = index;
    updateDots();
    if (manual) restartAuto();
  };

  const nextSlide = () => {
    const next = (current + 1) % slides.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (current - 1 + slides.length) % slides.length;
    goToSlide(prev);
  };

  const startAuto = () => {
    if (autoTimer || prefersReducedMotion) return;
    autoTimer = setInterval(nextSlide, 6000);
  };

  const restartAuto = () => {
    if (prefersReducedMotion) return;
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 6000);
  };

  if (slides.length) {
    buildDots();
    goToSlide(0);
    startAuto();
  }

  if (nextBtn) nextBtn.addEventListener("click", () => goToSlide((current + 1) % slides.length, true));
  if (prevBtn) prevBtn.addEventListener("click", () => goToSlide((current - 1 + slides.length) % slides.length, true));

  const navbar = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scrollTop");

  const onScroll = () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 20);
    if (scrollTopBtn) scrollTopBtn.classList.toggle("show", window.scrollY > 500);
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        document.body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      ".section-header, .pkg-card, .act-card, .place-card, .hotel-card, .gal-item, .why-card, .testimonial-card, .faq details, .contact-info, .contact-form, .ferry-card, .ferry-shot, .stat-item"
    )
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${(i % 6) * 0.08}s`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("reveal-visible"));
  }

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  const lbCounter = document.getElementById("lbCounter");
  const galleryImages = Array.from(document.querySelectorAll(".gallery .gal-item img"));

  let lbIndex = 0;
  let touchStartX = 0;

  const openLightbox = (index) => {
    if (!lightbox || !lbImage) return;
    lbIndex = index;
    lbImage.src = galleryImages[lbIndex].src;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${galleryImages.length}`;
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    lightbox.setAttribute("aria-hidden", "true");
  };

  const showNext = () => {
    lbIndex = (lbIndex + 1) % galleryImages.length;
    lbImage.src = galleryImages[lbIndex].src;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${galleryImages.length}`;
  };

  const showPrev = () => {
    lbIndex = (lbIndex - 1 + galleryImages.length) % galleryImages.length;
    lbImage.src = galleryImages[lbIndex].src;
    if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${galleryImages.length}`;
  };

  if (galleryImages.length) {
    galleryImages.forEach((img, i) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(i));
    });
  }

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbNext) lbNext.addEventListener("click", showNext);
  if (lbPrev) lbPrev.addEventListener("click", showPrev);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) showNext();
        else showPrev();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });

  const counters = document.querySelectorAll(".counter");
  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target") || "0", 10);
          const duration = 1200;
          const start = performance.now();

          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value.toString();
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const bookingDate = document.getElementById("bookingDate");
  if (bookingDate) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    bookingDate.min = iso;
  }

  const showToast = (message) => {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  };

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thanks! Our travel expert will call you shortly.");
      bookingForm.reset();
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Enquiry received! We will reach out within 30 minutes.");
      contactForm.reset();
    });
  }
});
