// Seed Keys
const DEFAULT_KEYS = [
  {
    id: "key_01",
    name: "CLI Automation Agent",
    token: "pwn_live_8f93e2b10a9c4728d6174bb0e1837a2f",
    scope: "Full Access (Read/Write)",
    created: "2026-10-10"
  },
  {
    id: "key_02",
    name: "Burp Suite Extension",
    token: "pwn_live_41a8c920bf8314e6da2018471c08239f",
    scope: "Submit Reports Only",
    created: "2026-10-12"
  }
];

function getStoredKeys() {
  const stored = localStorage.getItem("pwncore_api_keys");
  if (!stored) {
    localStorage.setItem("pwncore_api_keys", JSON.stringify(DEFAULT_KEYS));
    return DEFAULT_KEYS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_KEYS;
  }
}

function saveKeys(keys) {
  localStorage.setItem("pwncore_api_keys", JSON.stringify(keys));
}

function maskToken(token) {
  if (token.length <= 16) return token;
  return token.substring(0, 12) + "•".repeat(16) + token.substring(token.length - 4);
}

function renderKeys() {
  const keys = getStoredKeys();
  const listEl = document.getElementById("keysList");

  if (keys.length === 0) {
    listEl.innerHTML = `
      <div style="text-align: center; padding: 32px; color: var(--muted); font: 14px var(--sans);">
        No active API keys found. Click "+ Generate New Key" above to create one.
      </div>
    `;
    return;
  }

  listEl.innerHTML = keys.map(k => `
    <article class="key-card" data-id="${k.id}">
      <div class="key-info">
        <div class="key-name-row">
          <h3>${k.name}</h3>
          <span class="key-scope-badge">${k.scope}</span>
        </div>
        <div class="key-token-row">
          <span class="token-string" title="Click Copy to grab full key">${maskToken(k.token)}</span>
          <span class="key-meta">Created on ${k.created}</span>
        </div>
      </div>
      <div class="key-actions">
        <button class="copy-btn" data-token="${k.token}">Copy Token</button>
        <button class="revoke-btn" data-id="${k.id}">Revoke</button>
      </div>
    </article>
  `).join("");

  // Attach Copy
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const token = btn.dataset.token;
      navigator.clipboard.writeText(token).then(() => {
        showToast("API Token copied to clipboard!");
      }).catch(() => {
        showToast("Token copied!");
      });
    });
  });

  // Attach Revoke
  document.querySelectorAll(".revoke-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Are you sure you want to revoke this API token? Any integrations using it will immediately stop working.")) {
        const remaining = keys.filter(k => k.id !== id);
        saveKeys(remaining);
        renderKeys();
        showToast("API token revoked.");
      }
    });
  });
}

// Toast
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
let toastTimeout;

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 2500);
}

// Modal handling
const modal = document.getElementById("keyModal");
const openModalBtn = document.getElementById("openKeyModalBtn");
const closeModalBtn = document.getElementById("closeKeyModalBtn");
const cancelModalBtn = document.getElementById("cancelKeyModalBtn");
const keyForm = document.getElementById("keyForm");

function openModal() {
  document.getElementById("keyName").value = "";
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// Create Key
keyForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("keyName").value.trim();
  const scope = document.getElementById("keyScope").value;

  // Generate random 32 char hex
  const chars = "0123456789abcdef";
  let randomHex = "";
  for (let i = 0; i < 32; i++) {
    randomHex += chars[Math.floor(Math.random() * chars.length)];
  }
  const token = `pwn_live_${randomHex}`;
  const today = new Date().toISOString().split("T")[0];

  const keys = getStoredKeys();
  const newKey = {
    id: `key_${Date.now()}`,
    name,
    token,
    scope,
    created: today
  };

  keys.unshift(newKey);
  saveKeys(keys);
  closeModal();
  renderKeys();
  showToast(`Token "${name}" generated!`);
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
    if (e.target.closest("a, button, input, textarea, select, .key-card, .copy-btn, .revoke-btn, .modal-close")) {
      cursor.setAttribute("data-hot", "1");
    } else {
      cursor.removeAttribute("data-hot");
    }
  });

  window.addEventListener("mousedown", () => cursor.classList.add("press"));
  window.addEventListener("mouseup", () => cursor.classList.remove("press"));
}

renderKeys();
