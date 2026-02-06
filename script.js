// FoldDB Marketing Website - Interactive Features

document.addEventListener("DOMContentLoaded", () => {
  // Tab switching for code examples
  initTabs();

  // Tab switching for CLI section
  initCliTabs();

  // Copy code functionality
  initCopyButtons();

  // Install banner copy button
  initInstallCopy();

  // Smooth scroll for navigation
  initSmoothScroll();

  // Mobile navigation toggle
  initMobileNav();

  // Intersection observer for animations
  initScrollAnimations();

  // Platform detection for download cards
  initPlatformDetection();

  // Schema Registry
  initSchemaRegistry();
});

// ============================================
// SCHEMA REGISTRY
// ============================================

// Dev API Gateway URL for local development
// TODO: For production deploy, update to https://axo709qs11.execute-api.us-east-1.amazonaws.com
const SCHEMA_SERVICE_URL =
  "https://y0q3m6vk75.execute-api.us-west-2.amazonaws.com";
const SCHEMA_API_ENDPOINTS = {
  available: `${SCHEMA_SERVICE_URL}/api/schemas/available`,
  health: `${SCHEMA_SERVICE_URL}/health`,
};

let allSchemas = [];
let currentFilter = "all";
let currentSchema = null;

function initSchemaRegistry() {
  // Check if schema section exists
  const schemasSection = document.getElementById("schemas");
  if (!schemasSection) return;

  const schemaElements = {
    loadingContainer: document.getElementById("loadingContainer"),
    errorContainer: document.getElementById("errorContainer"),
    emptyContainer: document.getElementById("emptyContainer"),
    schemasGrid: document.getElementById("schemasGrid"),
    schemaSearch: document.getElementById("schemaSearch"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    retryBtn: document.getElementById("retryBtn"),
    errorMessage: document.getElementById("errorMessage"),
    schemaCount: document.getElementById("schemaCount"),
    totalFields: document.getElementById("totalFields"),
    serviceStatus: document.getElementById("serviceStatus"),
    modalOverlay: document.getElementById("modalOverlay"),
    modalSchemaName: document.getElementById("modalSchemaName"),
    modalSchemaType: document.getElementById("modalSchemaType"),
    modalBody: document.getElementById("modalBody"),
    modalClose: document.getElementById("modalClose"),
    modalCloseBtn: document.getElementById("modalCloseBtn"),
    copyJsonBtn: document.getElementById("copyJsonBtn"),
  };

  // Setup event listeners
  if (schemaElements.schemaSearch) {
    schemaElements.schemaSearch.addEventListener(
      "input",
      debounce(() => renderSchemas(schemaElements), 300),
    );
  }

  schemaElements.filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      schemaElements.filterButtons.forEach((b) =>
        b.classList.toggle("active", b.dataset.filter === currentFilter),
      );
      renderSchemas(schemaElements);
    });
  });

  if (schemaElements.retryBtn) {
    schemaElements.retryBtn.addEventListener("click", () =>
      loadSchemas(schemaElements),
    );
  }

  if (schemaElements.modalClose) {
    schemaElements.modalClose.addEventListener("click", () =>
      closeModal(schemaElements),
    );
  }
  if (schemaElements.modalCloseBtn) {
    schemaElements.modalCloseBtn.addEventListener("click", () =>
      closeModal(schemaElements),
    );
  }
  if (schemaElements.modalOverlay) {
    schemaElements.modalOverlay.addEventListener("click", (e) => {
      if (e.target === schemaElements.modalOverlay) closeModal(schemaElements);
    });
  }
  if (schemaElements.copyJsonBtn) {
    schemaElements.copyJsonBtn.addEventListener("click", copySchemaJson);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(schemaElements);
  });

  // Load schemas
  loadSchemas(schemaElements);
}

async function loadSchemas(elements) {
  showLoading(elements);

  // Check health
  try {
    const healthResponse = await fetch(SCHEMA_API_ENDPOINTS.health);
    if (healthResponse.ok) {
      elements.serviceStatus.textContent = "✓ Online";
      elements.serviceStatus.style.color = "#27ca40";
    } else {
      elements.serviceStatus.textContent = "⚠ Degraded";
      elements.serviceStatus.style.color = "#ffbd2e";
    }
  } catch (e) {
    elements.serviceStatus.textContent = "✗ Offline";
    elements.serviceStatus.style.color = "#ff5f56";
  }

  // Fetch schemas
  try {
    const response = await fetch(SCHEMA_API_ENDPOINTS.available);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    allSchemas = data.schemas || [];
    updateSchemaStats(elements);
    renderSchemas(elements);
  } catch (error) {
    console.error("Failed to load schemas:", error);
    showError(elements, error.message);
  }
}

function updateSchemaStats(elements) {
  elements.schemaCount.textContent = allSchemas.length;
  const totalFields = allSchemas.reduce((sum, schema) => {
    const fieldCount = schema.fields?.length || 0;
    const transformCount = schema.transform_fields
      ? Object.keys(schema.transform_fields).length
      : 0;
    return sum + fieldCount + transformCount;
  }, 0);
  elements.totalFields.textContent = totalFields;
}

function showLoading(elements) {
  elements.loadingContainer.style.display = "flex";
  elements.errorContainer.style.display = "none";
  elements.emptyContainer.style.display = "none";
  elements.schemasGrid.innerHTML = "";
}

function showError(elements, message) {
  elements.loadingContainer.style.display = "none";
  elements.errorContainer.style.display = "flex";
  elements.emptyContainer.style.display = "none";
  elements.errorMessage.textContent = message;
}

function showEmpty(elements) {
  elements.loadingContainer.style.display = "none";
  elements.errorContainer.style.display = "none";
  elements.emptyContainer.style.display = "flex";
}

function hideAllStates(elements) {
  elements.loadingContainer.style.display = "none";
  elements.errorContainer.style.display = "none";
  elements.emptyContainer.style.display = "none";
}

function getFilteredSchemas(elements) {
  const searchTerm = elements.schemaSearch?.value.toLowerCase().trim() || "";
  return allSchemas.filter((schema) => {
    if (currentFilter !== "all") {
      const schemaType = schema.schema_type || "Single";
      if (schemaType !== currentFilter) return false;
    }
    if (searchTerm) {
      const name = (schema.name || "").toLowerCase();
      const fields = (schema.fields || []).join(" ").toLowerCase();
      const transformFields = schema.transform_fields
        ? Object.keys(schema.transform_fields).join(" ").toLowerCase()
        : "";
      const searchable = `${name} ${fields} ${transformFields}`;
      if (!searchable.includes(searchTerm)) return false;
    }
    return true;
  });
}

function renderSchemas(elements) {
  hideAllStates(elements);
  const filteredSchemas = getFilteredSchemas(elements);
  if (filteredSchemas.length === 0) {
    showEmpty(elements);
    return;
  }
  elements.schemasGrid.innerHTML = filteredSchemas
    .map((schema) => createSchemaCard(schema))
    .join("");
  elements.schemasGrid.querySelectorAll(".schema-card").forEach((card) => {
    card.addEventListener("click", () => {
      const schemaName = card.dataset.schemaName;
      const schema = allSchemas.find((s) => s.name === schemaName);
      if (schema) openModal(elements, schema);
    });
  });
}

function createSchemaCard(schema) {
  const name = schema.name || "Unnamed Schema";
  const schemaType = schema.schema_type || "Single";
  const fields = schema.fields || [];
  const transformFields = schema.transform_fields
    ? Object.keys(schema.transform_fields)
    : [];
  const allFields = [...fields, ...transformFields];
  const topologyHash = schema.topology_hash || "N/A";
  const displayFields = allFields.slice(0, 4);
  const moreCount = allFields.length - displayFields.length;

  return `
    <div class="schema-card" data-schema-name="${escapeHtml(name)}">
      <div class="schema-card-header">
        <h3 class="schema-card-title">${escapeHtml(truncateName(name, 40))}</h3>
        <span class="type-badge ${schemaType}">${schemaType}</span>
      </div>
      <div class="schema-card-meta">
        <span class="meta-item">
          <span class="meta-icon">📋</span>
          ${allFields.length} field${allFields.length !== 1 ? "s" : ""}
        </span>
        ${schema.key ? `<span class="meta-item"><span class="meta-icon">🔑</span>Keyed</span>` : ""}
      </div>
      ${
        allFields.length > 0
          ? `
        <div class="schema-card-fields">
          ${displayFields.map((f) => `<span class="field-tag">${escapeHtml(f)}</span>`).join("")}
          ${moreCount > 0 ? `<span class="field-tag more">+${moreCount} more</span>` : ""}
        </div>
      `
          : ""
      }
      <div class="schema-card-hash">
        <span class="hash-label">hash:</span>
        <span class="hash-value">${escapeHtml(topologyHash.substring(0, 16))}...</span>
      </div>
    </div>
  `;
}

function openModal(elements, schema) {
  currentSchema = schema;
  const name = schema.name || "Unnamed Schema";
  const schemaType = schema.schema_type || "Single";

  elements.modalSchemaName.textContent = name;
  elements.modalSchemaType.textContent = schemaType;
  elements.modalSchemaType.className = `type-badge ${schemaType}`;
  elements.modalBody.innerHTML = createModalContent(schema);
  elements.modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(elements) {
  elements.modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  currentSchema = null;
}

function createModalContent(schema) {
  const sections = [];

  // Basic Info
  sections.push(`
    <div class="detail-section">
      <h4 class="detail-section-title">Basic Information</h4>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="detail-info-label">Name</div>
          <div class="detail-info-value">${escapeHtml(schema.name || "N/A")}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-label">Type</div>
          <div class="detail-info-value">${escapeHtml(schema.schema_type || "Single")}</div>
        </div>
        <div class="detail-info-item">
          <div class="detail-info-label">Topology Hash</div>
          <div class="detail-info-value">${escapeHtml(schema.topology_hash || "N/A")}</div>
        </div>
      </div>
    </div>
  `);

  // Fields
  const fields = schema.fields || [];
  const transformFields = schema.transform_fields || {};
  if (fields.length > 0 || Object.keys(transformFields).length > 0) {
    sections.push(`
      <div class="detail-section">
        <h4 class="detail-section-title">Fields (${fields.length + Object.keys(transformFields).length})</h4>
        <div class="fields-list">
          ${fields
            .map(
              (fieldName) => `
            <div class="field-item">
              <div class="field-item-header">
                <span class="field-item-name">${escapeHtml(fieldName)}</span>
                <span class="field-item-type">data field</span>
              </div>
            </div>
          `,
            )
            .join("")}
          ${Object.entries(transformFields)
            .map(
              ([fieldName, expression]) => `
            <div class="field-item">
              <div class="field-item-header">
                <span class="field-item-name">${escapeHtml(fieldName)}</span>
                <span class="field-item-type">transform</span>
              </div>
              <div class="field-item-topology">${escapeHtml(expression)}</div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  // Raw JSON
  sections.push(`
    <div class="detail-section">
      <h4 class="detail-section-title">Raw JSON</h4>
      <div class="json-view">
        <pre>${escapeHtml(JSON.stringify(schema, null, 2))}</pre>
      </div>
    </div>
  `);

  return sections.join("");
}

async function copySchemaJson() {
  if (!currentSchema) return;
  try {
    await navigator.clipboard.writeText(JSON.stringify(currentSchema, null, 2));
    showToast("Copied to clipboard!", "success");
  } catch (error) {
    console.error("Failed to copy:", error);
    showToast("Failed to copy", "error");
  }
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function truncateName(name, maxLength) {
  if (!name || name.length <= maxLength) return name;
  return name.substring(0, maxLength) + "...";
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Install Banner Copy
function initInstallCopy() {
  const btn = document.getElementById("installCopyBtn");
  const code = document.getElementById("installCommand");
  if (!btn || !code) return;

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
      btn.style.color = "var(--accent)";
      btn.style.borderColor = "var(--accent)";
      setTimeout(() => {
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
        btn.style.color = "";
        btn.style.borderColor = "";
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
}

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

// CLI Tab Switching
function initCliTabs() {
  const cliSection = document.getElementById("cli");
  if (!cliSection) return;

  const tabButtons = cliSection.querySelectorAll("[data-cli-tab]");
  const panels = cliSection.querySelectorAll(".example-panel");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.cliTab;

      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.remove("active");
        if (panel.id === targetTab) {
          panel.classList.add("active");
        }
      });
    });
  });
}

// Platform Detection for Download Cards
function initPlatformDetection() {
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";
  let detected = null;

  if (platform.includes("Mac") || userAgent.includes("Mac")) {
    // Check for Apple Silicon vs Intel
    // navigator.platform returns "MacIntel" for both on some browsers,
    // but we can check for ARM hints or default to Apple Silicon for modern Macs
    if (userAgent.includes("ARM") || (platform === "MacIntel" && navigator.maxTouchPoints > 0)) {
      detected = "macos-aarch64";
    } else {
      detected = "macos-aarch64"; // Default to Apple Silicon for modern macOS
    }
  } else if (platform.includes("Linux") || userAgent.includes("Linux")) {
    detected = "linux-x86_64";
  }

  if (detected) {
    const card = document.querySelector(`.download-card[data-platform="${detected}"]`);
    if (card) {
      card.classList.add("detected");
    }
  }
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

  // Observe download cards
  document.querySelectorAll(".download-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
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
