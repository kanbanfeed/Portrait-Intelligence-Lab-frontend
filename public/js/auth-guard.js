import { supabase } from "/js/supabase.js";

async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  // Allow dashboard without login
  if (!session && window.location.pathname === "/dashboard") {
    return;
  }

  // Protect other pages
  if (!session) {
    window.location.href = "/auth/login.html";
  }
}
const { data: { user } } = await supabase.auth.getUser();

// 1️⃣ Not logged in → login page
if (!user) {
  window.location.href = "/auth/login.html";
  return;
}

// 2️⃣ Check profile existence
const { data: profile, error } = await supabase
  .from("profiles")
  .select("id")
  .eq("id", user.id)
  .single();

// 🚨 PROFILE MISSING → FORCE REGISTER
if (error || !profile) {
  // 🔒 Important: logout to avoid broken state
  await supabase.auth.signOut();

  window.location.href = "/auth/register.html?reason=profile_missing";
  return;
}

// ✅ SAFE TO CONTINUE


requireAuth();
