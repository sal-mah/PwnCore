// Load saved profile or defaults
const DEFAULT_PROFILE = {
  name: "Lugine Haytham",
  handle: "lugine_sec",
  email: "lugin@pwncore.io",
  bio: "Web penetration testing, OAuth & JWT authentication bypasses, and cloud infrastructure security analysis.",
  pgp: "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmQGNBF/9...pwncore-sec-researcher-2026-key\n-----END PGP PUBLIC KEY BLOCK-----"
};

function getStoredProfile() {
  const stored = localStorage.getItem("pwncore_profile");
  if (!stored) {
    localStorage.setItem("pwncore_profile", JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
}

function loadProfile() {
  const prof = getStoredProfile();

  // Populate Summary
  document.getElementById("displayNameSummary").textContent = prof.name;
  document.getElementById("handleSummary").textContent = `@${prof.handle.replace(/^@/, '')}`;

  // Populate Form Fields
  document.getElementById("profName").value = prof.name;
  document.getElementById("profHandle").value = prof.handle.replace(/^@/, '');
  document.getElementById("profEmail").value = prof.email;
  document.getElementById("profBio").value = prof.bio;
  document.getElementById("profPgp").value = prof.pgp;

  // Sync reports count
  try {
    const reports = JSON.parse(localStorage.getItem("pwncore_reports") || "[]");
    document.getElementById("repCount").textContent = reports.length;
    document.getElementById("repPoints").textContent = (reports.length * 450 + 100).toLocaleString();
  } catch (e) {}
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

// Form Submit
document.getElementById("profileForm").addEventListener("submit", e => {
  e.preventDefault();

  const updated = {
    name: document.getElementById("profName").value.trim(),
    handle: document.getElementById("profHandle").value.trim(),
    email: document.getElementById("profEmail").value.trim(),
    bio: document.getElementById("profBio").value.trim(),
    pgp: document.getElementById("profPgp").value.trim()
  };

  localStorage.setItem("pwncore_profile", JSON.stringify(updated));
  loadProfile();
  showToast("Profile details updated successfully!");
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
    if (e.target.closest("a, button, input, textarea, select, .profile-card, .ach-badge")) {
      cursor.setAttribute("data-hot", "1");
    } else {
      cursor.removeAttribute("data-hot");
    }
  });

  window.addEventListener("mousedown", () => cursor.classList.add("press"));
  window.addEventListener("mouseup", () => cursor.classList.remove("press"));
}

loadProfile();
