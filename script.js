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

  // Mobile submenu toggle
  document.querySelectorAll(".sub-toggle").forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = toggle.closest(".has-sub");
      if (!parent) return;
      
      // Close other open submenus
      document.querySelectorAll(".has-sub.open").forEach(item => {
        if (item !== parent) {
          item.classList.remove("open");
          const otherToggle = item.querySelector(".sub-toggle");
          if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
        }
      });
      
      const isOpen = parent.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
  
  // Mobile: Also allow clicking on the parent link to toggle
  if (window.innerWidth <= 1200) {
    document.querySelectorAll(".has-sub > a").forEach((link) => {
      link.addEventListener("click", (e) => {
        const parent = link.closest(".has-sub");
        if (!parent) return;
        
        // If submenu exists, prevent default and toggle
        const subMenu = parent.querySelector(".sub-menu");
        if (subMenu) {
          e.preventDefault();
          const toggle = parent.querySelector(".sub-toggle");
          if (toggle) toggle.click();
        }
      });
    });
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      ".section-header, .planner-card, .pkg-card, .act-card, .place-card, .hotel-card, .island-card, .gal-item, .why-card, .testimonial-card, .faq details, .contact-info, .contact-form, .ferry-card, .ferry-shot, .stat-item, .about-card"
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
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('bookingName').value,
        phone: document.getElementById('bookingPhone').value,
        date: document.getElementById('bookingDate').value,
        adults: document.getElementById('bookingTravellers').value,
        package: document.getElementById('bookingPackage').value
      };
      
      try {
        await fetch(window.location.hostname === 'localhost' ? 'http://localhost:5000/api/bookings' : window.location.origin + '/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        showToast("Thanks! Our travel expert will call you shortly.");
        bookingForm.reset();
      } catch (err) {
        showToast("Booking received! We'll contact you soon.");
        bookingForm.reset();
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        package: contactForm.package.value,
        message: contactForm.message.value
      };
      
      try {
        await fetch(window.location.hostname === 'localhost' ? 'http://localhost:5000/api/contact' : window.location.origin + '/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        showToast("Enquiry received! We will reach out within 30 minutes.");
        contactForm.reset();
      } catch (err) {
        showToast("Message sent! We'll contact you soon.");
        contactForm.reset();
      }
    });
  }

  // ===== Package data + filter logic =====
  let packagesData = [];
  
  // Fetch packages from API
  const fetchPackagesFromAPI = async () => {
    try {
      const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api' 
        : window.location.origin + '/api';
      
      const res = await fetch(`${API_URL}/packages`);
      const apiPackages = await res.json();
      
      // Transform API data to match frontend format
      packagesData = apiPackages.map(pkg => ({
        id: pkg._id,
        category: pkg.category || 'Family',
        duration: pkg.duration,
        price: pkg.price,
        title: pkg.name,
        image: pkg.image,
        route: pkg.route || pkg.description.substring(0, 50),
        details: pkg.features || []
      }));
      
      return packagesData;
    } catch (err) {
      console.error('Error fetching packages:', err);
      // Fallback to static data if API fails
      return getStaticPackages();
    }
  };
  
  // Static fallback data
  const getStaticPackages = () => [
    { id: "honey-34", category: "Honeymoon", duration: "3 Nights 4 Days", price: 15000, title: "Romantic Honeymoon Escape", image: "images/Honeymoon1.jpeg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Complimentary breakfast", "Private transfers", "Candlelight dinner", "Radhanagar Beach visit"] },
    { id: "honey-45", category: "Honeymoon", duration: "4 Nights 5 Days", price: 22000, title: "Premium Honeymoon Package", image: "images/Honeymoon2.jpeg", route: "2N Port Blair · 1N Havelock · 1N Neil Island", details: ["Romantic photoshoot", "Sunset cruise", "Couple spa session", "Island hopping tours"] },
    { id: "honey-56", category: "Honeymoon", duration: "5 Nights 6 Days", price: 32000, title: "Luxury Honeymoon Experience", image: "images/Honeymoon3.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil Island", details: ["Beach cottage stay", "Private yacht tour", "Scuba diving session", "All meals included"] },
    { id: "honey-67", category: "Honeymoon", duration: "6 Nights 7 Days", price: 42000, title: "Ultimate Honeymoon Paradise", image: "images/Honeymoon4.jpeg", route: "2N Port Blair · 2N Havelock · 2N Neil Island", details: ["Luxury resort stay", "Private beach dinner", "Water sports package", "Airport transfers"] },
    { id: "honey-78", category: "Honeymoon", duration: "7 Nights 8 Days", price: 52000, title: "Grand Honeymoon Retreat", image: "images/honeymoon5.jpeg", route: "3N Port Blair · 2N Havelock · 2N Neil Island", details: ["Premium accommodation", "Romantic experiences", "All inclusive meals", "Spa treatments"] },

    { id: "best-34", category: "Best Seller", duration: "3 Nights 4 Days", price: 18000, title: "Andaman Explorer Package", image: "images/family1.jpeg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Cellular Jail visit", "Radhanagar Beach", "Ferry tickets included", "Breakfast included"] },
    { id: "best-45", category: "Best Seller", duration: "4 Nights 5 Days", price: 25000, title: "Island Hopping Adventure", image: "images/family2.jpeg", route: "2N Port Blair · 1N Havelock · 1N Neil", details: ["Scuba diving intro", "Snorkeling at Elephant Beach", "Ross Island tour", "All transfers"] },
    { id: "best-56", category: "Best Seller", duration: "5 Nights 6 Days", price: 35000, title: "Complete Andaman Experience", image: "images/family3.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil", details: ["Water sports package", "Island sightseeing", "Luxury accommodation", "Daily breakfast"] },

    { id: "adv-67", category: "Adventure", duration: "6 Nights 7 Days", price: 45000, title: "Thrill Seeker's Paradise", image: "images/andaman4.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil · 1N Baratang", details: ["Scuba diving certified", "Jungle trekking", "Limestone caves", "Kayaking adventure"] },
    { id: "adv-78", category: "Adventure", duration: "7 Nights 8 Days", price: 52000, title: "Ultimate Adventure Quest", image: "images/andaman5.jpeg", route: "2N Port Blair · 2N Havelock · 2N Neil · 1N Baratang", details: ["Sea walk experience", "Parasailing", "Jet ski rides", "Mangrove safari"] },
    { id: "adv-89", category: "Adventure", duration: "8 Nights 9 Days", price: 62000, title: "Extended Adventure Trail", image: "images/andaman6.jpeg", route: "2N Port Blair · 3N Havelock · 2N Neil · 1N Diglipur", details: ["Advanced scuba diving", "Snorkeling sessions", "Beach camping", "Offbeat island tours"] },
    { id: "adv-910", category: "Adventure", duration: "9 Nights 10 Days", price: 72000, title: "Pro Adventure Expedition", image: "images/andaman7.jpeg", route: "3N Port Blair · 3N Havelock · 2N Neil · 1N Baratang", details: ["Professional dive course", "Cave exploration", "Mangrove kayaking", "Wildlife spotting"] },

    { id: "ltc-34", category: "LTC", duration: "3 Nights 4 Days", price: 16000, title: "LTC Budget Package", image: "images/andaman8.jpeg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Government approved hotels", "All transfers included", "LTC bill support", "Sightseeing tours"] },
    { id: "ltc-45", category: "LTC", duration: "4 Nights 5 Days", price: 23000, title: "LTC Standard Package", image: "images/andaman9.jpeg", route: "2N Port Blair · 1N Havelock · 1N Neil", details: ["All-inclusive meals", "Ferry bookings", "Travel documentation", "Guide services"] },
    { id: "ltc-56", category: "LTC", duration: "5 Nights 6 Days", price: 31000, title: "LTC Premium Package", image: "images/andaman10.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil", details: ["LTC certificate support", "Travel insurance", "Priority bookings", "Complete assistance"] },
    { id: "ltc-67", category: "LTC", duration: "6 Nights 7 Days", price: 38000, title: "LTC Deluxe Package", image: "images/andaman11.jpeg", route: "2N Port Blair · 2N Havelock · 2N Neil", details: ["Premium hotels", "All documentation", "Ferry priority seats", "24/7 support"] },
    { id: "ltc-78", category: "LTC", duration: "7 Nights 8 Days", price: 46000, title: "LTC Elite Package", image: "images/andaman12.jpeg", route: "3N Port Blair · 2N Havelock · 2N Neil", details: ["Extended island coverage", "LTC bill assistance", "Luxury transfers", "Complete tour package"] },

    { id: "group-34", category: "Group", duration: "3 Nights 4 Days", price: 14000, title: "Group Adventure Package", image: "images/andaman13.jpg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Group discounts available", "Shared accommodation", "Group activities", "Team building games"] },
    { id: "group-45", category: "Group", duration: "4 Nights 5 Days", price: 20000, title: "Friends Getaway Package", image: "images/family4.jpeg", route: "2N Port Blair · 1N Havelock · 1N Neil", details: ["Group dining included", "Transport for all", "Tour coordinator", "Special group rates"] },
    { id: "group-56", category: "Group", duration: "5 Nights 6 Days", price: 28000, title: "Corporate Group Tour", image: "images/family5.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil", details: ["Professional tour leader", "Team activities", "Bulk booking discount", "Customizable itinerary"] },
    { id: "group-67", category: "Group", duration: "6 Nights 7 Days", price: 36000, title: "Extended Group Package", image: "images/family6.jpeg", route: "2N Port Blair · 2N Havelock · 2N Neil", details: ["Shared luxury transfers", "Group meals plan", "Adventure activities", "Photography sessions"] },

    { id: "family-34", category: "Family", duration: "3 Nights 4 Days", price: 19000, title: "Family Fun Package", image: "images/family1.jpeg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Kid-friendly activities", "Family meals included", "Safe beach visits", "Educational tours"] },
    { id: "family-45", category: "Family", duration: "4 Nights 5 Days", price: 27000, title: "Family Vacation Special", image: "images/family2.jpeg", route: "2N Port Blair · 1N Havelock · 1N Neil", details: ["Children's play areas", "Beach activities", "Family photoshoot", "All transfers"] },
    { id: "family-56", category: "Family", duration: "5 Nights 6 Days", price: 36000, title: "Complete Family Package", image: "images/family3.jpeg", route: "2N Port Blair · 2N Havelock · 1N Neil", details: ["Family-friendly hotels", "Kids entertainment", "Safe water activities", "Complimentary meals"] },
    { id: "family-67", category: "Family", duration: "6 Nights 7 Days", price: 44000, title: "Premium Family Experience", image: "images/family4.jpeg", route: "2N Port Blair · 2N Havelock · 2N Neil", details: ["Luxury family suites", "All meals included", "Kids club access", "Private tours"] },

    { id: "student-34", category: "Student", duration: "3 Nights 4 Days", price: 12000, title: "Student Budget Tour", image: "images/andaman1.jpg", route: "1N Port Blair · 1N Havelock · 1N Port Blair", details: ["Budget accommodation", "Student discounts", "Group activities", "Basic meals"] },
    { id: "student-45", category: "Student", duration: "4 Nights 5 Days", price: 17000, title: "Student Explorer Package", image: "images/andaman2.jpg", route: "2N Port Blair · 1N Havelock · 1N Neil", details: ["Hostel-style stays", "Budget-friendly meals", "Adventure activities", "Ferry tickets"] },
    { id: "student-56", category: "Student", duration: "5 Nights 6 Days", price: 24000, title: "Student Adventure Special", image: "images/andaman3.jpg", route: "2N Port Blair · 2N Havelock · 1N Neil", details: ["Campus-style lodging", "Budget activities", "Group discounts", "Educational tours"] }
  ];

  const packagesGrid = document.getElementById("packagesGrid");
  const packagesCount = document.getElementById("packagesCount");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const categoryCheckboxes = Array.from(document.querySelectorAll(".category-filter"));
  const durationCheckboxes = Array.from(document.querySelectorAll(".duration-filter"));
  const clearFilters = document.getElementById("clearFilters");

  const formatRupees = (value) => `₹${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  const openBookingModal = (pkg) => {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
      <div class="booking-modal-content">
        <button class="modal-close" onclick="this.closest('.booking-modal').remove()">×</button>
        <h2>Book ${pkg.title}</h2>
        <p class="modal-package-info">${pkg.duration} | ${pkg.route}</p>
        <p class="modal-price">Starting from ${formatRupees(pkg.price)}</p>
        <form class="modal-booking-form" onsubmit="event.preventDefault(); alert('Thank you! Our team will contact you shortly.'); this.closest('.booking-modal').remove();">
          <input type="text" placeholder="Your Name *" required />
          <input type="email" placeholder="Email Address *" required />
          <input type="tel" placeholder="Phone Number *" required />
          <input type="date" placeholder="Travel Date" min="${new Date().toISOString().split('T')[0]}" />
          <input type="number" placeholder="Number of Travelers" min="1" value="2" />
          <textarea placeholder="Special Requirements (Optional)" rows="3"></textarea>
          <button type="submit" class="btn-primary">Submit Booking Request</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
  };

  const renderPackageCards = (list) => {
    if (!packagesGrid || !packagesCount) return;
    packagesGrid.innerHTML = "";

    packagesCount.textContent = `Showing ${list.length} packages`;

    if (!list.length) {
      packagesGrid.innerHTML = `<p class="no-results">No packages match your filters. Try easing the filters.</p>`;
      return;
    }

    list.forEach((pkg) => {
      const card = document.createElement("article");
      card.className = "pkg-card";
      card.innerHTML = `
        <div class="pkg-img">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy" decoding="async" />
          <div class="pkg-badge">${pkg.category}</div>
        </div>
        <div class="pkg-body">
          <h3>${pkg.title}</h3>
          <p>${pkg.route}</p>
          <div class="pkg-meta">
            <span><i class="fas fa-clock"></i> ${pkg.duration}</span>
            <span><i class="fas fa-rupee-sign"></i> ${formatRupees(pkg.price)}</span>
          </div>
          <div class="pkg-list">
            ${pkg.details.map((d) => `<span><i class="fas fa-check"></i> ${d}</span>`).join("")}
          </div>
          <a href="package-detail.html?id=${pkg.id}" class="btn-pkg">View Details</a>
        </div>
      `;

      packagesGrid.appendChild(card);
    });
  };

  const getActiveFilters = () => {
    const categories = categoryCheckboxes.filter((c) => c.checked).map((c) => c.value);
    const durations = durationCheckboxes.filter((d) => d.checked).map((d) => d.value);
    const maxPrice = Number(priceRange?.value || 200000);
    return { categories, durations, maxPrice };
  };

  const applyFilters = () => {
    const { categories, durations, maxPrice } = getActiveFilters();

    const filtered = packagesData.filter((pkg) => {
      const categoryMatch = categories.length ? categories.includes(pkg.category) : true;
      const durationMatch = durations.length ? durations.includes(pkg.duration) : true;
      const priceMatch = pkg.price <= maxPrice;
      return categoryMatch && durationMatch && priceMatch;
    });

    renderPackageCards(filtered);
  };

  if (priceRange && priceValue) {
    priceValue.textContent = formatRupees(Number(priceRange.value));
    priceRange.addEventListener("input", () => {
      priceValue.textContent = formatRupees(Number(priceRange.value));
      applyFilters();
    });
  }

  categoryCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
  durationCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));

  if (clearFilters) {
    clearFilters.addEventListener("click", () => {
      priceRange.value = "200000";
      priceValue.textContent = formatRupees(200000);
      categoryCheckboxes.forEach((cb) => (cb.checked = true));
      durationCheckboxes.forEach((cb) => (cb.checked = true));
      applyFilters();
    });
  }

  const initializePackages = async () => {
    // Fetch packages from API first
    await fetchPackagesFromAPI();
    
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    
    if (selectedCategory) {
      categoryCheckboxes.forEach((cb) => (cb.checked = false));
      const targetCheckbox = categoryCheckboxes.find(cb => cb.value === selectedCategory);
      if (targetCheckbox) {
        targetCheckbox.checked = true;
      }
      sessionStorage.removeItem('selectedCategory');
    }
    
    applyFilters();
  };
  
  initializePackages();

  const plannerCards = document.querySelectorAll('.planner-card');
  
  plannerCards.forEach((card, index) => {
    const button = card.querySelector('.btn-primary');
    const select = card.querySelector('select');
    
    if (button && select) {
      button.addEventListener('click', (e) => {
        // Check if button is an anchor tag with href
        if (button.tagName === 'A' && button.href) {
          return; // Let the anchor tag handle navigation
        }
        
        e.preventDefault();
        const selectedValue = select.value;
        
        switch(index) {
          case 0:
            if (selectedValue && selectedValue !== 'Family Tours') {
              const categoryMap = {
                'Family Tours': 'Family',
                'Honeymoon Tours': 'Honeymoon', 
                'Best Seller Tours': 'Best Seller',
                'Adventure Tours': 'Adventure',
                'Group Tours': 'Group'
              };
              sessionStorage.setItem('selectedCategory', categoryMap[selectedValue] || selectedValue);
            }
            window.location.href = 'package.html#packages';
            break;
            
          case 1:
            window.location.href = 'activities.html';
            break;
            
          case 2:
            window.location.href = 'ferry-booking.html';
            break;
            
          case 3:
            window.location.href = '#hotels';
            break;
        }
      });
    }
  });
});
