async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  const btn = document.querySelector("button");

  msg.textContent = "";
  btn.disabled = true;
  btn.textContent = "Creating account...";

  if (!window.supabase) {
    msg.textContent = "Supabase not loaded";
    btn.disabled = false;
    btn.textContent = "Create Account";
    return;
  }

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

  window.location.href = "/dashboard";
}


async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msgEl = document.getElementById("msg");

  msgEl.textContent = "";

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  // ❌ AUTH ERROR
  if (error) {
    const errMsg = error.message.toLowerCase();

    if (
      errMsg.includes("user not found") ||
      errMsg.includes("invalid login credentials")
    ) {
      msgEl.textContent = "User not found. Please register.";
      return;
    }

    if (errMsg.includes("password")) {
      msgEl.textContent = "Incorrect password. Please try again.";
      return;
    }

    msgEl.textContent = error.message;
    return;
  }

  // 🔍 AUTH SUCCESS → CHECK PROFILE
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .single();

  // 🚨 PROFILE MISSING
  if (profileError || !profile) {
    await supabase.auth.signOut();
    window.location.href = "/auth/signup.html?reason=profile_missing";
    return;
  }

  // ✅ ALL GOOD
  window.location.href = "/dashboard";
}


