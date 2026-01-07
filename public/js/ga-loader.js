(function () {
  const GA_ID = "G-XXXXXXXXXX";
  let loaded = false;

  function loadGA() {
    if (loaded) return;
    loaded = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag("js", new Date());

    gtag("config", GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: false // 🔒 IMPORTANT
    });
  }

  function enableAnalytics() {
    loadGA();
    window.gtag("consent", "update", {
      analytics_storage: "granted"
    });
    window.gtag("event", "page_view"); // fire AFTER consent
  }

  function disableAnalytics() {
    if (!window.gtag) return;
    window.gtag("consent", "update", {
      analytics_storage: "denied"
    });
  }

  window.GAConsent = {
    enableAnalytics,
    disableAnalytics
  };
})();
