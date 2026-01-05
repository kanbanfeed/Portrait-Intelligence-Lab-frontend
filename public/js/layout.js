document.addEventListener("DOMContentLoaded", async () => {

  /* =====================
     LOAD HEADER
  ====================== */
  try {
    const headerHTML = await fetch("/components/header.html").then(r => r.text());
    const header = document.getElementById("header-placeholder");
    if (header) {
      header.innerHTML = headerHTML;
      document.dispatchEvent(new Event("headerLoaded"));
    }
  } catch (e) {
    console.error("Header load failed", e);
  }

  /* =====================
     LOAD FOOTER
  ====================== */
  try {
    const footerHTML = await fetch("/components/footer.html").then(r => r.text());
    const footer = document.getElementById("footer-placeholder");
    if (footer) footer.innerHTML = footerHTML;
  } catch (e) {
    console.error("Footer load failed", e);
  }

  /* ============================
     COOKIE BANNER + PREFERENCES
  ============================ */
  try {
    const [bannerHTML, modalHTML] = await Promise.all([
      fetch("/components/cookie-banner.html").then(r => r.text()),
      fetch("/components/cookie-preferences.html").then(r => r.text())
    ]);

    document.body.insertAdjacentHTML("beforeend", bannerHTML);
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const script = document.createElement("script");
    script.src = "/js/cookies.js";
    script.defer = true;
    document.body.appendChild(script);

  } catch (e) {
    console.error("Cookie components failed", e);
  }

});
