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

  msg.textContent = "Checking account..."; 
  msg.style.color = "gray";

  try {
    /* 1️⃣ STEP ONE: CHECK DATABASE FOR EMAIL */
    const checkRes = await fetch(`https://portrait-intelligence-lab-backend.onrender.com/api/auth/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const checkData = await checkRes.json();

    // If the backend explicitly says the email does not exist
    if (checkData.exists === false) {
      msg.style.color = "red";
      msg.textContent = "This email is not registered with us. Please create an account.";
      return; // 🛑 STOP HERE. Do not call Supabase.
    }

    /* 2️⃣ STEP TWO: EMAIL EXISTS, NOW CHECK PASSWORD */
    msg.textContent = "Verifying password...";
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      msg.style.color = "red";
      
      msg.textContent = "Invalid email or password. Please check your credentials and try again."; 
      return;
    }

    /* 3️⃣ SUCCESS */
    window.location.href = "/dashboard";

  } catch (err) {
    console.error("Login process error:", err);
    msg.style.color = "red";
    msg.textContent = "Server error. Please try again later.";
  }
}



window.signup = signup;
window.login = login;
