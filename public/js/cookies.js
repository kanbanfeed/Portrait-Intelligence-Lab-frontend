(function () {

  /* =========================
     HELPERS
  ========================== */
  function setConsent(data) {
    localStorage.setItem("cookie_consent", JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    }));
  }

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem("cookie_consent"));
    } catch {
      return null;
    }
  }

  function hideAll() {
    document.getElementById("cookie-banner")?.classList.add("hidden");
    document.getElementById("cookie-modal")?.classList.add("hidden");
  }

  /* =========================
     INITIAL STATE
  ========================== */
  document.addEventListener("DOMContentLoaded", () => {
    const consent = getConsent();
    if (!consent) {
      document.getElementById("cookie-banner")?.classList.remove("hidden");
    }
  });

  /* =========================
     🔥 EVENT DELEGATION (KEY FIX)
  ========================== */
  document.addEventListener("click", (e) => {

    // ACCEPT ALL
    if (e.target.closest("#accept-all")) {
      setConsent({ essential: true, analytics: true, marketing: false });
      hideAll();
      return;
    }

    // REJECT NON-ESSENTIAL
    if (e.target.closest("#reject-all")) {
      setConsent({ essential: true, analytics: false, marketing: false });
      hideAll();
      return;
    }

    // OPEN MODAL
    if (e.target.closest("#manage-cookies")) {
      document.getElementById("cookie-modal")?.classList.remove("hidden");
      return;
    }

    // CLOSE MODAL
    if (e.target.closest("#close-cookie-modal")) {
      document.getElementById("cookie-modal")?.classList.add("hidden");
      return;
    }

    // SAVE PREFERENCES
    if (e.target.closest("#save-cookie-preferences")) {
      const analytics = document.getElementById("analytics-cookies")?.checked || false;
      setConsent({ essential: true, analytics, marketing: false });
      hideAll();
      return;
    }

  });

})();
