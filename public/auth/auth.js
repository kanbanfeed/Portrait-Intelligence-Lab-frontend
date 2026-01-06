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
  btn.disabled = true;
  btn.textContent = "Creating account...";

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    msg.style.color = "red";
    btn.disabled = false;
    btn.textContent = "Sign Up";
    return;
  }

  /* ✅ SEND REGISTRATION SUCCESS EMAIL (ONLY ON SIGNUP) */
  if (data?.user) {
    try {
      await fetch(`${ENV.BACKEND_ORIGIN}/api/send-welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.user.email
        })
      });
    } catch (e) {
      console.error("Signup email failed", e);
    }
  }

  /* ✅ SUCCESS MESSAGE */
  msg.style.color = "green";
  msg.textContent = "🎉 Registration successful! Redirecting to dashboard…";

  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 2000);
}

/* ======================
   LOGIN
====================== */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.textContent = "Invalid email or password.";
    msg.style.color = "red";
    return;
  }

  // ❌ DO NOT SEND REGISTRATION EMAIL ON LOGIN
  window.location.href = "/dashboard";
}

window.signup = signup;
window.login = login;
