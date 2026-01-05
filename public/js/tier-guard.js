document.addEventListener("DOMContentLoaded", async () => {
  const btn = document.getElementById("purchase-btn");
  if (!btn) return;

  const supabase = window.supabase;

  // ======================
  // HELPERS
  // ======================
  const resetButton = () => {
    btn.disabled = false;
    btn.textContent = "Join This Tier";
  };

  // ======================
  // DETECT TIER FROM URL
  // /tier/19.99 → "19.99"
  // ======================
  const tier = window.location.pathname.split("/").pop();

  // ======================
  // RESET WHEN USER RETURNS
  // (browser back / tab focus)
  // ======================
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      resetButton();
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      resetButton();
    }
  });

  // ======================
  // RESET IF STRIPE cancel_url
  // ======================
  const params = new URLSearchParams(window.location.search);
  if (params.get("cancelled") === "true") {
    resetButton();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // ======================
  // AUTH CHECK
  // ======================
  const { data: { session } } = await supabase.auth.getSession();

  // 🔒 NOT LOGGED IN
  if (!session) {
    btn.textContent = "Login & Join";
    btn.onclick = () => {
      window.location.href = "/auth/login.html";
    };
    return;
  }

  const userId = session.user.id;

  // ======================
  // FETCH USER PROFILE
  // ======================
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    btn.textContent = "Error loading profile";
    btn.disabled = true;
    return;
  }

  const userTiers = Array.isArray(profile.tier)
    ? profile.tier
    : [profile.tier || "free"];

  // ✅ ALREADY PURCHASED
  if (userTiers.includes(tier)) {
    btn.textContent = "Already Purchased";
    btn.disabled = true;
    btn.classList.remove("btn-success");
    btn.classList.add("btn-secondary");
    return;
  }

  // ======================
  // STRIPE CHECKOUT
  // ======================
  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = "Redirecting…";

    // Safety fallback (if user returns silently)
    setTimeout(resetButton, 8000);

    try {
      const res = await fetch(
        "https://portrait-intelligence-lab-backend.onrender.com/api/stripe/create-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tier,
            supabaseUserId: userId
          })
        }
      );

      if (!res.ok) throw new Error("Checkout request failed");

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL");

      window.location.href = data.url;

    } catch (err) {
      console.error("Checkout error:", err);
      resetButton();
      alert("Something went wrong. Please try again.");
    }
  };
});
