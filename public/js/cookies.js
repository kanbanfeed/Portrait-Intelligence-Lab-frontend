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
(function waitForCookieBanner() {
  const banner = document.getElementById("cookie-banner");

  if (!banner) {
    return setTimeout(waitForCookieBanner, 50);
  }

  const consent = getConsent();

  if (!consent || typeof consent !== "object") {
    banner.classList.remove("hidden"); // FIRST VISIT
  } else {
    banner.classList.add("hidden"); // ALREADY CONSENTED

    // ✅ RESTORE ANALYTICS STATE
    if (consent.analytics && window.GAConsent) {
      window.GAConsent.enableAnalytics();
    }
  }
})();



  
  document.addEventListener("click", (e) => {

    // ACCEPT ALL
   if (e.target.closest("#accept-all")) {
  setConsent({ essential: true, analytics: true, marketing: false });

  if (window.GAConsent) {
    window.GAConsent.enableAnalytics();
  }

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
  const analytics =
    document.getElementById("analytics-cookies")?.checked || false;

  setConsent({ essential: true, analytics, marketing: false });

  if (window.GAConsent) {
    analytics
      ? window.GAConsent.enableAnalytics()
      : window.GAConsent.disableAnalytics();
  }

  hideAll();
  return;
}


  });

})();
