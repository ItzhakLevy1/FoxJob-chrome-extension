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
      <hr>
      המשרות שהגשת אליהן מועמדות (בלחיצה על Apply) יסומנו בירוק.
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
    // Find all job cards based on the <a> tag structure provided
    const jobLinks = document.querySelectorAll('a[href^="/jobs/"]');
    if (jobLinks.length === 0) return;

    // Get applied jobs from localStorage
    const appliedJobIds = JSON.parse(localStorage.getItem("scalefox_applied_jobs") || "[]");

    jobLinks.forEach((link) => {
      const jobId = extractJobId(link.getAttribute("href"));
      const jobCard = link.closest(".group.relative"); // The main container div

      if (jobCard) {
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
    // Strategy A (Preferred): Target the "Apply" button inside the job page
    // We check if the clicked element (or its text) contains "Apply"
    const target = event.target;
    const isApplyButton = target.tagName === "BUTTON" || target.tagName === "A";
    
    if (isApplyButton && target.textContent.trim().toLowerCase().includes("apply")) {
      const jobId = extractJobId(window.location.href);
      if (jobId) {
        let ids = JSON.parse(localStorage.getItem("scalefox_applied_jobs") || "[]");
        if (!ids.includes(jobId)) {
          ids.push(jobId);
          localStorage.setItem("scalefox_applied_jobs", JSON.stringify(ids));
          console.log(`[ScaleFox] Job ID ${jobId} saved via Apply button.`);
          filterAndMarkJobs(); // Refresh visual state
        }
      }
      return;
    }

    // Strategy B (Fallback): If you clicked a job card on the main screen, 
    // and you want a fallback option, we can track that too.
    // (Uncomment the lines below if you want to mark on main card click as well)
    /*
    const jobLink = target.closest('a[href^="/jobs/"]');
    if (jobLink) {
      const jobId = extractJobId(jobLink.getAttribute("href"));
      // alternative handling...
    }
    */
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