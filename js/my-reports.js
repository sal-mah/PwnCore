// Seed reports if none exist
const DEFAULT_REPORTS = [
  {
    title: "Example: SQL Injection",
    id: "PWN-001",
    target: "api.target.com/v1/auth",
    type: "SQL Injection",
    severity: "High",
    description: "1. Send POST request to /v1/auth with payload in username field: ' OR 1=1; --\n2. Database returns full admin user records and session token without password verification.",
    impact: "Full database compromise allowing arbitrary data extraction and administrative privilege escalation.",
    status: "Pending Triage",
    date: "2026-10-14"
  },
  {
    title: "Example: Broken Access Control",
    id: "PWN-002",
    target: "admin.target.com/users",
    type: "Broken Access Control",
    severity: "Critical",
    description: "1. Authenticate as low-privileged user.\n2. Change role header to 'role: superadmin' in HTTP request.\n3. Server authorizes sensitive administrative actions without backend authorization check.",
    impact: "Unauthenticated or low-privilege attackers can take over the platform entirely.",
    status: "Under Review",
    date: "2026-10-15"
  },
  {
    title: "Example: Information Disclosure",
    id: "PWN-003",
    target: "target.com/.git/config",
    type: "Information Disclosure",
    severity: "Medium",
    description: "1. Perform GET request on /.git/config\n2. Server reveals internal repository remote origin and developer access credentials.",
    impact: "Exposes internal infrastructure addresses and repository structure.",
    status: "Accepted",
    date: "2026-10-15"
  }
];

function getStoredReports() {
  const stored = localStorage.getItem("pwncore_reports");
  if (!stored) {
    localStorage.setItem("pwncore_reports", JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_REPORTS;
  }
}

let activeFilter = "All";
let searchQuery = "";

function updateCounts(reports) {
  document.getElementById("countAll").textContent = reports.length;
  document.getElementById("countPending").textContent = reports.filter(r => r.status === "Pending Triage").length;
  document.getElementById("countReview").textContent = reports.filter(r => r.status === "Under Review").length;
  document.getElementById("countAccepted").textContent = reports.filter(r => r.status === "Accepted").length;
}

function renderReports() {
  const allReports = getStoredReports();
  updateCounts(allReports);

  const filtered = allReports.filter(report => {
    const matchesFilter = activeFilter === "All" || report.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      report.title.toLowerCase().includes(query) ||
      report.id.toLowerCase().includes(query) ||
      (report.type && report.type.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const listEl = document.getElementById("reportsList");
  const emptyEl = document.getElementById("emptyState");

  if (filtered.length === 0) {
    listEl.innerHTML = "";
    emptyEl.hidden = false;
    return;
  }

  emptyEl.hidden = true;
  listEl.innerHTML = filtered.map(report => `
    <article class="report-row-card" data-id="${report.id}">
      <div class="report-main-info">
        <span class="id-tag">${report.id}</span>
        <h3>${report.title}</h3>
        <div class="meta-row">
          <span>${report.target || 'N/A'}</span>
          <span>·</span>
          <span>${report.type || 'Vulnerability'}</span>
          <span>·</span>
          <span>${report.date || 'Recent'}</span>
        </div>
      </div>

      <div class="report-badge-col">
        <span class="sev-badge ${report.severity || 'Medium'}">${report.severity || 'Medium'}</span>
        <span class="status status-${report.status.toLowerCase().replace(/\s+/g, '-')}">${report.status}</span>
      </div>
    </article>
  `).join("");

  // Attach click listeners to open modal
  document.querySelectorAll(".report-row-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      const rep = allReports.find(r => r.id === id);
      if (rep) openModal(rep);
    });
  });
}

// Modal handling
const modal = document.getElementById("reportModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalOkBtn = document.getElementById("modalOkBtn");

function openModal(report) {
  document.getElementById("modalId").textContent = report.id;
  document.getElementById("modalTitle").textContent = report.title;
  document.getElementById("modalTarget").textContent = report.target || "N/A";
  document.getElementById("modalCategory").textContent = report.type || "General";
  document.getElementById("modalSeverity").textContent = report.severity || "Medium";
  document.getElementById("modalStatus").textContent = report.status;
  document.getElementById("modalDescription").textContent = report.description || "No proof of concept steps provided.";
  document.getElementById("modalImpact").textContent = report.impact || "Standard impact under review.";

  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

closeModalBtn.addEventListener("click", closeModal);
modalOkBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// Search input
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.trim();
  renderReports();
});

// Filter chips
document.querySelectorAll(".filter-chips .chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chips .chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderReports();
  });
});

// PwnCore interactive cursor
const cursor = document.getElementById("pc-cursor");
if (cursor) {
  let moved = false;
  window.addEventListener("mousemove", e => {
    if (!moved) {
      document.documentElement.classList.add("pc-moved");
      moved = true;
    }
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  document.addEventListener("mouseover", e => {
    if (e.target.closest("a, button, input, textarea, select, .report-row-card, .chip, .modal-close")) {
      cursor.setAttribute("data-hot", "1");
    } else {
      cursor.removeAttribute("data-hot");
    }
  });

  window.addEventListener("mousedown", () => cursor.classList.add("press"));
  window.addEventListener("mouseup", () => cursor.classList.remove("press"));
}

renderReports();
