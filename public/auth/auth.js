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
  const msgEl = document.getElementById("msg");

  msgEl.textContent = "";

  /* 1️⃣ Attempt login */
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  /* 2️⃣ LOGIN SUCCESS */
  if (!error) {
    window.location.href = `${ENV.FRONTEND_ORIGIN}/dashboard`;
    return;
  }

  /* 3️⃣ LOGIN FAILED → CHECK USER EXISTS */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  /* ❌ USER DOES NOT EXIST */
  if (profileError || !profile) {
    msgEl.textContent = "User not found. Please register.";
    return;
  }

  /* ❌ USER EXISTS → WRONG PASSWORD */
  msgEl.textContent = "Incorrect password. Please try again.";
}

/* ======================
   EXPOSE FOR onclick
====================== */
window.login = login;
window.signup = signup;
