async function waitForHeaderAndSupabase() {
  return new Promise((resolve) => {
    const check = () => {
      if (
        window.supabase &&
        document.getElementById("login-item") &&
        document.getElementById("logout-item")
      ) {
        resolve();
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

async function initHeaderAuth() {
  await waitForHeaderAndSupabase();

  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");
  const logoutBtn = document.getElementById("logout-btn");
  const userEmail = document.getElementById("user-email");
  const userEmailItem = document.getElementById("user-email-item");

  function showLoggedOut() {
    userEmailItem.style.display = "none";
    loginItem.style.display = "block";
    logoutItem.style.display = "none";
  }

  function showLoggedIn(email = "Member") {
    if (userEmail) userEmail.textContent = email;
    userEmailItem.style.display = "block";
    loginItem.style.display = "none";
    logoutItem.style.display = "block";
  }

  showLoggedOut();

  // 🔐 Immediate session check (Stripe redirect fix)
  const { data } = await supabase.auth.getSession();
  if (data?.session?.user) {
    showLoggedIn(data.session.user.email);
  }

  // 🔁 Live auth updates
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      showLoggedIn(session.user.email);
    } else {
      showLoggedOut();
    }
  });

  // 🚪 Logout
  logoutBtn.onclick = async () => {
    await supabase.auth.signOut();
    showLoggedOut();
    window.location.href = "/";
  };
}

/* Run everywhere safely */
document.addEventListener("DOMContentLoaded", initHeaderAuth);
