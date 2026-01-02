import { supabase } from "/js/supabase.js";
import { ENV } from "/js/env.js";

async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  const path = window.location.pathname;

  const publicPages = [
    "/",
    "/auth/login.html",
    "/auth/signup.html",
    "/auth/forgot-password.html",
    "/auth/reset-password.html"
  ];

  if (publicPages.includes(path)) return;

  if (!session) {
    window.location.href = `${ENV.FRONTEND_ORIGIN}/auth/login.html`;
    return;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    await supabase.auth.signOut();
    window.location.href = `${ENV.FRONTEND_ORIGIN}/auth/login.html?reason=profile_missing`;
    return;
  }
}

requireAuth();
