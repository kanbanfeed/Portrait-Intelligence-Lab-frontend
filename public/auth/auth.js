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

  // ✅ SUCCESS CONFIRMATION (THIS IS REQUIRED & CORRECT)
  msg.style.color = "green";
  msg.textContent = "🎉 Thank you for registering successfully! Redirecting…";

  // ❌ DO NOT CALL BACKEND FROM FRONTEND

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
    return;
  }

  // ✅ Trigger welcome email ONCE
  await fetch(`${ENV.BACKEND_ORIGIN}/api/send-welcome-on-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: data.user.id,
      email: data.user.email
    })
  });

  window.location.href = "/dashboard";
}
window.signup = signup;
window.login = login;
