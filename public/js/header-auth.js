document.addEventListener("headerLoaded", async () => {
  const header = document.getElementById("header-placeholder");

  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");
  const userEmailItem = document.getElementById("user-email-item");
  const userEmail = document.getElementById("user-email");

  if (!window.supabase) {
    console.error("Supabase not loaded");
    header.style.visibility = "visible";
    return;
  }

  const updateUI = (session) => {
    if (session?.user) {
      loginItem.style.display = "none";
      logoutItem.style.display = "block";
      userEmailItem.style.display = "block";
      userEmail.textContent = session.user.email;
    } else {
      loginItem.style.display = "block";
      logoutItem.style.display = "none";
      userEmailItem.style.display = "none";
    }

    // ✅ SHOW HEADER ONLY AFTER AUTH CHECK
    header.style.visibility = "visible";
  };

  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  supabase.auth.onAuthStateChange((_event, newSession) => {
    updateUI(newSession);
  });
});
