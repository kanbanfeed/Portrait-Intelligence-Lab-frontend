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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("msg").textContent = error.message;
    return;
  }

  // 🔍 Immediately check profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .single();

  // 🚨 Auth exists but profile missing
  if (profileError || !profile) {
    await supabase.auth.signOut();
    window.location.href = "/auth/signup.html?reason=profile_missing";
    return;
  }

  // ✅ All good
  window.location.href = "/dashboard";
}

