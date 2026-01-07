(function () {
  const GA_ID = "G-XXXXXXXXXX"; // 🔁 Replace with your GA4 ID

  let loaded = false;

  function loadGA() {
    if (loaded) return;
    loaded = true;

    // Load GA script
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    // Configure GA
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
gtag("consent", "default", {
  analytics_storage: "denied"
});

    gtag("js", new Date());

    gtag("config", GA_ID, {
      anonymize_ip: true,          // ✅ IP anonymisation
      send_page_view: true,
      allow_google_signals: false, // ✅ No cross-product sharing
      allow_ad_personalization_signals: false
    });
  }

  function enableAnalytics() {
    if (!window.gtag) return;
    gtag("consent", "update", {
      analytics_storage: "granted"
    });
    loadGA();
  }

  function disableAnalytics() {
    if (!window.gtag) return;
    gtag("consent", "update", {
      analytics_storage: "denied"
    });
  }

  // Expose globally
  window.GAConsent = {
    enableAnalytics,
    disableAnalytics
  };
})();
