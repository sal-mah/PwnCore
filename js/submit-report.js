// Handle Severity Picker buttons
const sevPills = document.querySelectorAll(".sev-pill");
const sevInput = document.getElementById("reportSeverity");

sevPills.forEach(pill => {
  pill.addEventListener("click", () => {
    sevPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    sevInput.value = pill.dataset.sev;
  });
});

// Form Submission
const form = document.getElementById("reportForm");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("reportTitle").value.trim();
  const target = document.getElementById("reportTarget").value.trim();
  const category = document.getElementById("reportCategory").value;
  const severity = sevInput.value;
  const description = document.getElementById("reportDescription").value.trim();
  const impact = document.getElementById("reportImpact").value.trim();

  // Retrieve existing reports
  let reports = [];
  try {
    const stored = localStorage.getItem("pwncore_reports");
    reports = stored ? JSON.parse(stored) : [];
  } catch (err) {
    reports = [];
  }

  // Generate sequential PWN ID
  const newNum = reports.length + 1;
  const newId = `PWN-${String(newNum).padStart(3, "0")}`;

  const today = new Date().toISOString().split("T")[0];

  const newReport = {
    title,
    id: newId,
    target,
    type: category,
    severity,
    description,
    impact,
    status: "Pending Triage",
    date: today
  };

  reports.push(newReport);
  localStorage.setItem("pwncore_reports", JSON.stringify(reports));

  // Show success toast
  toast.hidden = false;
  toastMsg.textContent = `Report ${newId} submitted successfully! Redirecting to My Reports...`;

  // Redirect after 1.2 seconds
  setTimeout(() => {
    window.location.href = "my-reports.html";
  }, 1200);
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
    if (e.target.closest("a, button, input, textarea, select, .sev-pill")) {
      cursor.setAttribute("data-hot", "1");
    } else {
      cursor.removeAttribute("data-hot");
    }
  });

  window.addEventListener("mousedown", () => cursor.classList.add("press"));
  window.addEventListener("mouseup", () => cursor.classList.remove("press"));
}
