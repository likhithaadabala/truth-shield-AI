
const HISTORY_KEY = "truthShieldScanHistory";

// Scan message
function checkMessage() {
  const message = document.getElementById("message").value.trim();
  const result = document.getElementById("result");

  if (!message) {
    result.textContent = "Please enter a message to scan.";
    result.style.color = "orange";
    result.style.backgroundColor = "#fff7ed";
    result.style.border = "2px solid orange";
    return;
  }
 document.getElementById("riskProgress").hidden = true; 

  const patterns = [
    /urgent/i,
    /password/i,
    /account.*blocked/i,
    /click.*link/i,
    /send.*otp/i,
    /send money/i,
    /claim.*prize/i,
    /registration fee/i
  ];

  let score = 0;

  patterns.forEach(pattern => {
    if (pattern.test(message)) {
      score += 20;
    }
  });

  score = Math.min(score, 100);
  // Update Risk Score Progress Bar
const progress = document.getElementById("riskProgress");
const percentage = document.getElementById("riskPercentage");
const bar = document.getElementById("riskBar");
const track = document.getElementById("riskBarTrack");

progress.hidden = false;
percentage.textContent = score + "%";
bar.style.width = score + "%";
track.setAttribute("aria-valuenow", score);

if (score >= 40) {
  bar.style.background = "#dc2626";
  percentage.style.color = "#dc2626";
} else if (score >= 20) {
  bar.style.background = "#f97316";
  percentage.style.color = "#c2410c";
} else {
  bar.style.background = "#16a34a";
  percentage.style.color = "#15803d";
}

  let level;
  let color;
  let background;

  if (score >= 40) {
    level = "HIGH RISK";
    color = "#dc2626";
    background = "#fee2e2";

    result.textContent =
      "⚠️ HIGH RISK! Risk Score: " + score +
      "% — Verify the sender before sharing personal information.";

  } else if (score >= 20) {
    level = "MEDIUM RISK";
    color = "#c2410c";
    background = "#ffedd5";

    result.textContent =
      "⚠️ MEDIUM RISK! Risk Score: " + score +
      "% — Be careful and verify the message.";

  } else {
    level = "LOW RISK";
    color = "#15803d";
    background = "#dcfce7";

    result.textContent =
      "✅ LOW RISK! Risk Score: " + score +
      "% — No major warning patterns detected. This does not guarantee safety.";
  }

  result.style.color = color;
  result.style.backgroundColor = background;
  result.style.border = "2px solid " + color;

  // Save scan to localStorage
  const history = getHistory();

  history.unshift({
  message: message,
  score: score,
  level: level,
  dateTime: new Date().toLocaleString("en-IN")
});

  // Keep the latest 50 scans
  const updatedHistory = history.slice(0, 50);

  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
    renderHistory();
  } catch (error) {
    console.error("Could not save scan history:", error);
    result.textContent +=
      " (Warning: History could not be saved in this browser.)";
  }
}

// Get saved history
function getHistory() {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    const history = saved ? JSON.parse(saved) : [];

    return Array.isArray(history) ? history : [];
  } catch (error) {
    return [];
  }
}

// Display saved history
function renderHistory() {
  const historyList = document.getElementById("history");

  if (!historyList) return;

  historyList.innerHTML = "";

  const history = getHistory();

  history.forEach(scan => {
    const item = document.createElement("li");

  item.textContent =
  scan.message + " — " +
  scan.level + " — Risk Score: " +
  scan.score + "%" +
  (scan.dateTime ? " — Scanned: " + scan.dateTime : "");

    historyList.appendChild(item);
  });
}

// Clear saved history
function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  } catch (error) {
    alert("History could not be cleared. Please try again.");
  }
}

// Load history when the page opens
document.addEventListener("DOMContentLoaded", renderHistory);


