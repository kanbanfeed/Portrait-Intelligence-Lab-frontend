// js/header-auth.js
document.addEventListener("headerLoaded", async () => {
  console.log("Header loaded, checking auth..."); //
  
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  // Your Render Backend URL
  const BACKEND_URL = "https://portrait-intelligence-lab-backend.onrender.com";

  if (!loginBtn || !logoutBtn) {
    console.error("Auth elements missing in header"); //
    return;
  }

  const updateUI = (session) => {
    if (session?.user) {
      // ✅ USER LOGGED IN
      if (userEmail) userEmail.textContent = session.user.email;
      if (userEmailItem) userEmailItem.style.display = "block";

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

  // 1. Initial Session Check
  const { data: { session } } = await supabase.auth.getSession();
  updateUI(session);

  // 2. Auth State Change Listener
  supabase.auth.onAuthStateChange((event, newSession) => {
    console.log(`Auth Event: ${event}`);
    updateUI(newSession);
  });

  // 3. Logout Logic
  logoutBtn.onclick = async () => {
    try {
      await supabase.auth.signOut();
      // Clear cookie for Render backend compatibility
      document.cookie = "auth_token=; Max-Age=0; path=/;"; 
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };
});