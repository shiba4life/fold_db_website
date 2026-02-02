// FoldDB Marketing Website - Interactive Features

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching for code examples
  initTabs();

  // Copy code functionality
  initCopyButtons();

  // Smooth scroll for navigation
  initSmoothScroll();

  // Mobile navigation toggle
  initMobileNav();

  // Intersection observer for animations
  initScrollAnimations();
});

// Tab Switching
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".example-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;

      // Update button states
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update panel visibility
      panels.forEach((panel) => {
        panel.classList.remove("active");
        if (panel.id === targetTab) {
          panel.classList.add("active");
        }
      });
    });
  });
}

// Copy Code to Clipboard
function initCopyButtons() {
  const copyButtons = document.querySelectorAll(".code-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const codeBlock = btn.closest(".example-code").querySelector("code");
      const text = codeBlock.textContent;

      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.color = "var(--accent)";
        btn.style.borderColor = "var(--accent)";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = "";
          btn.style.borderColor = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });
  });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Mobile Navigation
function initMobileNav() {
  const toggle = document.getElementById("mobileToggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      toggle.classList.toggle("active");
    });
  }
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    observer.observe(card);
  });

  // Observe quickstart steps
  document.querySelectorAll(".quickstart-step").forEach((step, index) => {
    step.style.opacity = "0";
    step.style.transform = "translateY(20px)";
    step.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(step);
  });

  // Observe architecture layers
  document.querySelectorAll(".arch-layer").forEach((layer, index) => {
    layer.style.opacity = "0";
    layer.style.transform = "translateY(20px)";
    layer.style.transitionDelay = `${index * 0.15}s`;
    observer.observe(layer);
  });
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  @media (max-width: 768px) {
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(10, 10, 15, 0.95);
      backdrop-filter: blur(20px);
      flex-direction: column;
      padding: 1rem 2rem;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      display: none;
    }
    
    .nav-links.active {
      display: flex;
    }
    
    .nav-mobile-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-mobile-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .nav-mobile-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);

// Terminal typing animation (optional enhancement)
function initTerminalAnimation() {
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    // Cursor is already animated via CSS
  }
}

// Console easter egg for developers
console.log(
  "%c⬡ FoldDB",
  "font-size: 24px; font-weight: bold; color: #6366f1;",
);
console.log(
  "%cThe AI-Powered Distributed Data Platform",
  "font-size: 14px; color: #94a3b8;",
);
console.log("%cBuilt with Rust 🦀", "font-size: 12px; color: #22d3ee;");
console.log(
  "%cCheckout: https://github.com/shiba4life/fold_db",
  "font-size: 12px; color: #a855f7;",
);
