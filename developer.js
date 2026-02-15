// Developer page — schema registry + interactions

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ============================================
// SCHEMA REGISTRY
// ============================================

const SCHEMA_SERVICE_URL =
  "https://y0q3m6vk75.execute-api.us-west-2.amazonaws.com";
const SCHEMA_API_ENDPOINTS = {
  available: `${SCHEMA_SERVICE_URL}/api/schemas/available`,
  health: `${SCHEMA_SERVICE_URL}/health`,
};

let allSchemas = [];
let currentFilter = "all";
let currentSchema = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function initSchemaRegistry() {
  const schemasGrid = document.getElementById("schemasGrid");
  if (!schemasGrid) return;

  const elements = {
    loadingContainer: document.getElementById("loadingContainer"),
    errorContainer: document.getElementById("errorContainer"),
    emptyContainer: document.getElementById("emptyContainer"),
    schemasGrid,
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
    retryBtn: document.getElementById("retryBtn"),
  };

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) =>
          b.classList.toggle("active", b.dataset.filter === currentFilter),
        );
      renderSchemas(elements);
    });
  });

  // Modal close
  if (elements.modalClose) {
    elements.modalClose.addEventListener("click", () => closeModal(elements));
  }
  if (elements.modalCloseBtn) {
    elements.modalCloseBtn.addEventListener("click", () =>
      closeModal(elements),
    );
  }
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.modalOverlay) closeModal(elements);
    });
  }
  if (elements.copyJsonBtn) {
    elements.copyJsonBtn.addEventListener("click", () => {
      if (currentSchema) {
        navigator.clipboard.writeText(JSON.stringify(currentSchema, null, 2));
        elements.copyJsonBtn.textContent = "[Copied!]";
        setTimeout(() => {
          elements.copyJsonBtn.textContent = "[Copy JSON]";
        }, 1500);
      }
    });
  }
  if (elements.retryBtn) {
    elements.retryBtn.addEventListener("click", () => loadSchemas(elements));
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal(elements);
  });

  loadSchemas(elements);
}

async function loadSchemas(elements) {
  elements.loadingContainer.style.display = "block";
  elements.errorContainer.style.display = "none";
  elements.emptyContainer.style.display = "none";
  elements.schemasGrid.innerHTML = "";

  // Health check
  try {
    const healthResponse = await fetch(SCHEMA_API_ENDPOINTS.health);
    if (healthResponse.ok) {
      elements.serviceStatus.textContent = "✓ online";
      elements.serviceStatus.style.color = "#b8bb26";
    } else {
      elements.serviceStatus.textContent = "⚠ degraded";
      elements.serviceStatus.style.color = "#fabd2f";
    }
  } catch (e) {
    elements.serviceStatus.textContent = "✗ offline";
    elements.serviceStatus.style.color = "#fb4934";
  }

  // Fetch schemas
  try {
    const response = await fetch(SCHEMA_API_ENDPOINTS.available);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    allSchemas = data.schemas || [];
    updateStats(elements);
    renderSchemas(elements);
  } catch (error) {
    console.error("Failed to load schemas:", error);
    elements.loadingContainer.style.display = "none";
    elements.errorContainer.style.display = "block";
  }
}

function updateStats(elements) {
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

function renderSchemas(elements) {
  elements.loadingContainer.style.display = "none";
  elements.errorContainer.style.display = "none";
  elements.emptyContainer.style.display = "none";

  const filtered = allSchemas.filter((s) => {
    if (currentFilter === "all") return true;
    return (s.schema_type || "Single") === currentFilter;
  });

  if (filtered.length === 0) {
    elements.emptyContainer.style.display = "block";
    return;
  }

  elements.schemasGrid.innerHTML = filtered
    .map((schema) => {
      const name = schema.name || "Unnamed";
      const type = schema.schema_type || "Single";
      const fields = schema.fields || [];
      const transforms = schema.transform_fields
        ? Object.keys(schema.transform_fields)
        : [];
      const allFields = [...fields, ...transforms];
      const displayFields = allFields.slice(0, 4);
      const moreCount = allFields.length - displayFields.length;
      const hash = (schema.topology_hash || "N/A").substring(0, 12);

      return `<div class="card schema-card" data-schema-name="${escapeHtml(name)}" style="cursor:pointer">
        <p><span class="label label-green">${escapeHtml(name)}</span> <span class="dim">${type}</span></p>
        <p class="dim">${allFields.length} field${allFields.length !== 1 ? "s" : ""} · hash: ${hash}…</p>
        ${displayFields.length > 0 ? `<p>${displayFields.map((f) => `<span class="label label-blue" style="font-size:0.8em">${escapeHtml(f)}</span>`).join(" ")}${moreCount > 0 ? ` <span class="dim">+${moreCount}</span>` : ""}</p>` : ""}
      </div>`;
    })
    .join("");

  elements.schemasGrid.querySelectorAll(".schema-card").forEach((card) => {
    card.addEventListener("click", () => {
      const schema = allSchemas.find((s) => s.name === card.dataset.schemaName);
      if (schema) openModal(elements, schema);
    });
  });
}

function openModal(elements, schema) {
  currentSchema = schema;
  elements.modalSchemaName.textContent = schema.name || "Unnamed";
  elements.modalSchemaType.textContent = schema.schema_type || "Single";

  const fields = schema.fields || [];
  const transforms = schema.transform_fields
    ? Object.entries(schema.transform_fields)
    : [];
  const hash = schema.topology_hash || "N/A";

  let html = `<p class="dim">Topology hash: ${escapeHtml(hash)}</p>`;

  if (fields.length > 0) {
    html += `<p><span class="bold">Fields</span></p><pre>`;
    fields.forEach((f) => {
      html += `  · ${escapeHtml(f)}\n`;
    });
    html += `</pre>`;
  }

  if (transforms.length > 0) {
    html += `<p><span class="bold">Transform Fields</span></p><pre>`;
    transforms.forEach(([name, config]) => {
      html += `  · ${escapeHtml(name)}`;
      if (config && config.source) html += ` ← ${escapeHtml(config.source)}`;
      html += `\n`;
    });
    html += `</pre>`;
  }

  if (schema.key) {
    html += `<p><span class="bold">Key:</span> ${escapeHtml(schema.key)}</p>`;
  }

  elements.modalBody.innerHTML = html;
  elements.modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(elements) {
  elements.modalOverlay.classList.remove("open");
  document.body.style.overflow = "";
  currentSchema = null;
}

// Init on load
document.addEventListener("DOMContentLoaded", initSchemaRegistry);
