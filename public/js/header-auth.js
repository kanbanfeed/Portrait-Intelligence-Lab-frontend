document.addEventListener("headerLoaded", async () => {
  console.log("Header loaded, checking auth status...");
  
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  if (!loginBtn || !logoutBtn) {
    console.error("Auth elements missing in header");
    return;
  }

  const updateUI = (session) => {
    if (session?.user) {
      /* ✅ USER LOGGED IN */
      if (userEmail) userEmail.textContent = session.user.email;
      if (userEmailItem) userEmailItem.style.display = "block";

      loginBtn.parentElement.style.display = "none";
      logoutBtn.style.display = "block";
      logoutBtn.parentElement.style.display = "block";
    } else {
      /* ❌ USER NOT LOGGED IN */
      if (userEmailItem) userEmailItem.style.display = "none";
      loginBtn.parentElement.style.display = "block";
      logoutBtn.parentElement.style.display = "none";
    }
  };

  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  supabase.auth.onAuthStateChange((event, newSession) => {
    updateUI(newSession);
  });

  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    document.cookie = "auth_token=; Max-Age=0; path=/;"; 
    window.location.href = "/";
  };
});