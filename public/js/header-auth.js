document.addEventListener("headerLoaded", async () => {
  const header = document.getElementById("header-placeholder");

  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  if (!header || !loginItem || !logoutItem || !loginBtn || !logoutBtn || !window.supabase) {
    if (header) header.style.visibility = "visible";
    return;
  }

  const updateUI = (session) => {
    if (session?.user) {
      // ✅ LOGGED IN
      loginItem.style.display = "none";
      logoutItem.style.display = "block";

      if (userEmail) userEmail.textContent = session.user.email;
      if (userEmailItem) userEmailItem.style.display = "block";
    } else {
      // ❌ LOGGED OUT
      loginItem.style.display = "block";
      logoutItem.style.display = "none";

      if (userEmailItem) userEmailItem.style.display = "none";
    }

    // ✅ Show header ONLY after auth state is known
    header.style.visibility = "visible";
  };

  // Initial auth check
  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  // Listen for login/logout changes
  supabase.auth.onAuthStateChange((_, newSession) => {
    updateUI(newSession);
  });

  // Logout
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    document.cookie = "auth_token=; Max-Age=0; path=/;";
    window.location.href = "/";
  };
});
