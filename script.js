// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Active navigation highlighting
  const sections = document.querySelectorAll("section[id]");
  const navLinksAll = document.querySelectorAll(".nav-link");

  function highlightNavigation() {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinksAll.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", highlightNavigation);

  // Theme detection and auto switching
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML =
      theme === "dark"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
  }

  function applyTheme(theme, save = true) {
    document.body.dataset.theme = theme;
    updateThemeIcon(theme);
    if (save) {
      localStorage.setItem("theme", theme);
    }
  }

  function getSystemTheme() {
    return prefersDarkScheme.matches ? "dark" : "light";
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme, false);
  } else {
    applyTheme(getSystemTheme(), false);
  }

  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light", false);
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.dataset.theme || getSystemTheme();
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  // Fade in animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const fadeElements = document.querySelectorAll(
    ".service-card, .value-card, .process-step, .feature-item",
  );
  fadeElements.forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  function initHeroSlider() {
    const slider = document.querySelector(".hero-slider");
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-slider-dot"));
    if (!slides.length || !dots.length) return;

    let current = 0;
    let intervalId = null;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      current = index;
    }

    function startLoop() {
      if (intervalId) return;
      intervalId = setInterval(() => {
        showSlide((current + 1) % slides.length);
      }, 4500);
    }

    function stopLoop() {
      clearInterval(intervalId);
      intervalId = null;
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
      });
    });

    slider.addEventListener("mouseenter", stopLoop);
    slider.addEventListener("mouseleave", startLoop);

    showSlide(0);
    startLoop();
  }

  initHeroSlider();

  function animateStatNumber(el, duration = 1600) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target) || el.classList.contains("counted")) return;
    const suffix = el.dataset.suffix || "";
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      el.textContent = `${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
        el.classList.add("counted");
      }
    }

    requestAnimationFrame(tick);
  }

  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    const statNumbers = statsSection.querySelectorAll(".stat-number");
    statNumbers.forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || "";
      if (!isNaN(target)) {
        el.textContent = `0${suffix}`;
      }
    });

    const statsObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statNumbers.forEach((el) => animateStatNumber(el));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    statsObserver.observe(statsSection);
  }

  // Contact form handling
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Show success message (you can replace this with actual form submission)
      showNotification(
        "Thank you for your message! We'll get back to you soon.",
        "success",
      );

      // Reset form
      this.reset();
    });
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#10b981" : "#3b82f6"};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;

    // Add animation keyframes
    if (!document.querySelector("#notification-styles")) {
      const style = document.createElement("style");
      style.id = "notification-styles";
      style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .notification-close:hover {
                    opacity: 0.8;
                }
            `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      notification.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Dropdown menu functionality for desktop
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach((toggle) => {
    const dropdown = toggle.parentElement;
    const menu = dropdown.querySelector(".dropdown-menu");

    // For mobile, toggle on click
    if (window.innerWidth <= 768) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        menu.style.position = "static";
        menu.style.opacity = menu.style.opacity === "1" ? "0" : "1";
        menu.style.visibility =
          menu.style.visibility === "visible" ? "hidden" : "visible";
      });
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });

  // Back to top button
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.className = "back-to-top";
  backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ea580c;
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s;
        z-index: 1000;
    `;

  document.body.appendChild(backToTopBtn);

  // Show/hide back to top button
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  // Back to top functionality
  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add hover effect to back to top button
  backToTopBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-2px)";
    this.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
  });

  backToTopBtn.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  });
});

// Utility function to format phone numbers
function formatPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phoneNumber;
}

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#ef4444";
      isValid = false;
    } else {
      field.style.borderColor = "#d1d5db";
    }

    // Email validation
    if (field.type === "email" && field.value && !validateEmail(field.value)) {
      field.style.borderColor = "#ef4444";
      isValid = false;
    }
  });

  return isValid;
}
