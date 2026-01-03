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

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    btn.disabled = false;
    btn.textContent = "Create Account";
    return;
  }

  window.location.href = `${ENV.FRONTEND_ORIGIN}/dashboard`;
}

/* ======================
   LOGIN (FIXED)
====================== */
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.textContent = "Invalid email or password.";
    return;
  }

  window.location.href = "/dashboard";
}


/* ======================
   EXPOSE FOR onclick
====================== */
window.login = login;
window.signup = signup;
