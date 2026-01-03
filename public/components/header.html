document.addEventListener("headerLoaded", async () => {
  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  if (!loginItem || !logoutItem || !logoutBtn) {
    console.error("Header auth elements missing");
    return;
  }

  function updateUI(session) {
    if (session?.user) {
      // ✅ LOGGED IN
      userEmail.textContent = session.user.email;
      userEmailItem.style.display = "block";

      loginItem.style.display = "none";
      logoutItem.style.display = "block";
    } else {
      // ❌ LOGGED OUT
      userEmailItem.style.display = "none";

      loginItem.style.display = "block";
      logoutItem.style.display = "none";
    }
  }

  // ✅ Initial state
  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  // ✅ React to auth changes
  supabase.auth.onAuthStateChange((_event, newSession) => {
    updateUI(newSession);
  });

  // ✅ LOGOUT HANDLER (THIS WAS THE BROKEN PART)
  logoutBtn.addEventListener("click", async () => {
    try {
      await supabase.auth.signOut();

      // Clear magic cookie (important)
      document.cookie = "auth_token=; Max-Age=0; path=/";

      // Force UI reset
      updateUI(null);

      // Redirect
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Please refresh.");
    }
  });
});
