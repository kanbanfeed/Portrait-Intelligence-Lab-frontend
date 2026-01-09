import { ENV } from "/js/env.js";

/* ======================
   SIGN UP
====================== */
async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  const btn = document.querySelector("button");

  msg.textContent = "";
  msg.style.color = "";
  btn.disabled = true;
  btn.textContent = "Creating account...";

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

 if (error) {
  msg.style.color = "red";

  // ✅ Custom message for existing users
  if (
    error.message.toLowerCase().includes("already registered") ||
    error.message.toLowerCase().includes("user already exists")
  ) {
    msg.textContent =
      "An account with this email already exists. Log in to continue.";
  } else {
    msg.textContent = error.message;
  }

  btn.disabled = false;
  btn.textContent = "Sign Up";
  return;
}


  /* ✅ SEND WELCOME EMAIL */
  if (data?.user) {
    try {
      await fetch(`${ENV.BACKEND_ORIGIN}/api/auth/signup-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          email: data.user.email
        })
      });
    } catch (e) {
      console.error("Signup email failed", e);
    }
  }

  /* ✅ CLEAR CONFIRMATION MESSAGE */
  msg.style.color = "green";
  msg.innerHTML = `
    ✅ <strong>Thank you for registering successfully!</strong><br/>
    Your account has been created. Redirecting to your dashboard...
  `;

  /* ⏳ Redirect AFTER user sees confirmation */
  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 2500);
}


/* ======================
   LOGIN (Updated)
====================== */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!email || !password) {
    msg.textContent = "Please enter both email and password.";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "Logging in...";
  msg.style.color = "gray";

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      const errorMessage = error.message.toLowerCase();

      // ❌ Email not registered OR invalid credentials
      if (
        errorMessage.includes("invalid login") ||
        errorMessage.includes("user not found")
      ) {
        msg.style.color = "red";
        msg.textContent =
          "Invalid credentials. Please register first if you don’t have an account.";
        return;
      }

      // ❌ Other auth errors
      msg.style.color = "red";
      msg.textContent = "Invalid credentials. Please check your email or password.";
      return;
    }

    // ✅ SUCCESS
    window.location.href = "/dashboard";

  } catch (err) {
    console.error("Login error:", err);
    msg.style.color = "red";
    msg.textContent = "Something went wrong. Please try again.";
  }
}




window.signup = signup;
window.login = login;
