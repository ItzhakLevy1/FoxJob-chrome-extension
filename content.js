/* Add an informative message to indicate that the extension for this site is on */
(function () {
  // Create a new message element
  const messageDiv = document.createElement("div");
  messageDiv.className = "my-extension-banner";

  const textSpan = document.createElement("span");
  const messageHTML = `
    <div>
    <br>
      🟢 תוסף סימון המשרות של ScaleFox פעיל.
      <br>
      <hr>
      <br>
      משרות שהוגשו מסומנות בירוק.
      <br>
      <hr>
      <br>
      משרות סטודנט ומשרות של 3+ שנות ניסיון מוסתרות אוטומטית.
      <br>
    </div>
  `;

  textSpan.innerHTML = messageHTML;

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  closeBtn.className = "my-extension-close";
  closeBtn.addEventListener("click", () => {
    messageDiv.remove();
  });

  messageDiv.appendChild(textSpan);
  messageDiv.appendChild(closeBtn);
  document.body.appendChild(messageDiv);
})();

(function () {
  // 1. Helper to extract Job ID from URL or href string
  const extractJobId = (url) => {
    if (!url) return null;
    const match = url.match(/\/jobs\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  // 2. Main Logic: Filter and Mark Jobs
  const filterAndMarkJobs = () => {
    // Scan directly by the job card container to ensure we don't miss anything
    const jobCards = document.querySelectorAll(".group.relative");
    if (jobCards.length === 0) return;

    // Get applied jobs from localStorage
    const appliedJobIds = JSON.parse(
      localStorage.getItem("scalefox_applied_jobs") || "[]",
    );

    // Regex to match experience numbers (e.g., "6+ yrs", "3 yrs", "2y+", "10+ years")
    const expRegex = /(\d+)\s*(?:\+)?\s*(?:yr[s]?|y\+)/i;

    jobCards.forEach((jobCard) => {
      const cardText = jobCard.innerText || "";
      let shouldHide = false;

      // Condition A: Check for "Student" or "Intern" keyword
      if (
        cardText.toLowerCase().includes("student") ||
        cardText.toLowerCase().includes("intern")
      ) {
        shouldHide = true;
      }

      // Condition B: Check experience requirement (only if not already marked to hide)
      if (!shouldHide) {
        const match = cardText.match(expRegex);
        if (match) {
          const yearsOfExperience = parseInt(match[1], 10);
          if (yearsOfExperience >= 3) {
            shouldHide = true;
          }
        }
      }

      // Apply filtering or marking based on status
      if (shouldHide) {
        jobCard.style.display = "none";
      } else {
        jobCard.style.display = ""; // Safely reset to default layout if visible

        // Find the job ID link inside this card if it exists
        const link = jobCard.querySelector('a[href*="/jobs/"]');
        const jobId = link ? extractJobId(link.getAttribute("href")) : null;

        // Apply green class if already applied
        if (jobId && appliedJobIds.includes(jobId)) {
          jobCard.classList.add("applied-job");
        } else {
          jobCard.classList.remove("applied-job");
        }
      }
    });
  };

  // 3. Global Click Listener
  document.addEventListener("click", (event) => {
    const target = event.target;
    const isApplyButton = target.tagName === "BUTTON" || target.tagName === "A";

    if (
      isApplyButton &&
      target.textContent.trim().toLowerCase().includes("apply")
    ) {
      const jobId = extractJobId(window.location.href);
      if (jobId) {
        let ids = JSON.parse(
          localStorage.getItem("scalefox_applied_jobs") || "[]",
        );
        if (!ids.includes(jobId)) {
          ids.push(jobId);
          localStorage.setItem("scalefox_applied_jobs", JSON.stringify(ids));
          console.log(`[ScaleFox] Job ID ${jobId} saved via Apply button.`);
          filterAndMarkJobs(); // Refresh visual state
        }
      }
    }
  });

  // 4. Optimized Observer (Throttled for dynamic loading)
  let timeout = null;
  const observer = new MutationObserver(() => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(filterAndMarkJobs, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial Run
  filterAndMarkJobs();
})();
