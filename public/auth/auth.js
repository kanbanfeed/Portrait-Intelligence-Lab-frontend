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
  msg.style.color = "red";

  if (!email || !password) {
    msg.textContent = "Please enter both email and password.";
    return;
  }

  // 🔐 Attempt login FIRST
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (!error) {
    window.location.href = "/dashboard";
    return;
  }

  // ❌ Login failed → check if email exists
  try {
    const res = await fetch(
      `${ENV.BACKEND_ORIGIN}/api/auth/check-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const data = await res.json();

    if (!data.exists) {
      msg.textContent =
        "This email is not registered with us. Please register first.";
    } else {
      msg.textContent = "Invalid credentials.";
    }
  } catch {
    msg.textContent = "Something went wrong. Please try again.";
  }
}


window.signup = signup;
window.login = login;
