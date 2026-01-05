document.addEventListener("headerLoaded", async () => {
  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  if (!loginItem || !logoutItem || !logoutBtn) {
    console.error("❌ Header auth elements missing");
    return;
  }

  function showLoggedOut() {
    userEmailItem.style.display = "none";
    loginItem.style.display = "block";
    logoutItem.style.display = "none";
  }

  function showLoggedIn(email = "") {
    if (userEmail) userEmail.textContent = email;
    userEmailItem.style.display = "block";
    loginItem.style.display = "none";
    logoutItem.style.display = "block";
  }

  /* ===============================
     🔐 AUTH CHECK (SUPABASE + COOKIE)
  ================================ */

  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    showLoggedIn(session.user.email);
  } else {
    // Fallback: check magic cookie
    const hasAuthCookie = document.cookie.includes("auth_token=");
    hasAuthCookie ? showLoggedIn("Member") : showLoggedOut();
  }

  /* ===============================
     🔁 AUTH STATE CHANGES
  ================================ */
  supabase.auth.onAuthStateChange((_event, newSession) => {
    if (newSession?.user) {
      showLoggedIn(newSession.user.email);
    } else {
      showLoggedOut();
    }
  });

  /* ===============================
     🚪 LOGOUT (ALWAYS WORKS)
  ================================ */
  logoutBtn.onclick = async () => {
    try {
      await supabase.auth.signOut();

      // Clear magic cookie
      document.cookie = "auth_token=; Max-Age=0; path=/";

      showLoggedOut();

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
      alert("Logout failed. Please refresh.");
    }
  };
});
