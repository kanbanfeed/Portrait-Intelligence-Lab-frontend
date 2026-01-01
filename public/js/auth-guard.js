import { supabase } from "/js/supabase.js";

async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  const path = window.location.pathname;

  // 🔓 Public pages (NO auth required)
  const publicPages = [
    "/",
    "/auth/login.html",
    "/auth/signup.html",
    "/auth/forgot-password.html"
  ];

  if (publicPages.includes(path)) {
    return;
  }

  // ❌ Not logged in → go to login
  if (!session) {
    window.location.href = "/auth/login.html";
    return;
  }

  // 🔍 Logged in → MUST have profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", session.user.id)
    .single();

  // 🚨 Profile missing → force re-register
  if (error || !profile) {
    await supabase.auth.signOut(); // prevent auth loop
    window.location.href = "/auth/signup.html?reason=profile_missing";
    return;
  }

  // ✅ Auth + profile exists → allow access
}

requireAuth();
