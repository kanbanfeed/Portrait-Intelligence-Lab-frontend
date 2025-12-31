// This script manages the login/logout state in the header
document.addEventListener("headerLoaded", async () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  if (!loginBtn || !logoutBtn) {
    console.warn("Auth buttons not found in the DOM.");
    return;
  }

  // Update UI based on the session state
  const updateUI = (session) => {
    if (session?.user) {
      // ✅ USER LOGGED IN
      if (userEmail) userEmail.textContent = session.user.email;
      if (userEmailItem) userEmailItem.style.display = "block"; // Only shows on desktop via CSS

      loginBtn.parentElement.style.display = "none";
      logoutBtn.style.display = "block";
      logoutBtn.parentElement.style.display = "block";
    } else {
      // ❌ USER NOT LOGGED IN
      if (userEmailItem) userEmailItem.style.display = "none";
      loginBtn.parentElement.style.display = "block";
      logoutBtn.parentElement.style.display = "none";
    }
  };

  // 1. Check initial session
  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  // 2. Listen for auth changes (login, logout, token refresh)
  supabase.auth.onAuthStateChange((event, newSession) => {
    console.log(`Auth Event: ${event}`);
    updateUI(newSession);
  });

  // 3. Handle Logout Click
  logoutBtn.onclick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Logout Error:", error.message);
    } else {
        // Clear local cookies if using a custom backend JWT
        document.cookie = "auth_token=; Max-Age=0; path=/;";
        window.location.href = "/"; // Redirect to home
    }
  };
});