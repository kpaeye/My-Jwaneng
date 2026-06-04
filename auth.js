import { supabase } from './supabase.js';

export let currentUser = null;
export let currentProfile = null;

/* =====================================
LOAD USER + PROFILE (CORE FUNCTION)
===================================== */
export async function loadUser() {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    currentUser = user;

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    currentProfile = profile;

    return { user, profile };
}

/* =====================================
REQUIRE AUTH (SAFE GUARD)
===================================== */
export async function requireAuth() {

    const result = await loadUser();

    if (!result?.user) {
        window.location.href = "login.html";
        return null;
    }

    return result.user;
}

/* =====================================
GET ROLE
===================================== */
export function getRole() {
    return currentProfile?.role || "user";
}

/* =====================================
ROLE CHECK
===================================== */
export function hasRole(role) {
    return getRole() === role;
}

/* =====================================
REQUIRE ADMIN
===================================== */
export async function requireAdmin() {

    await loadUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    if (getRole() !== "admin") {
        window.location.href = "welcomepage.html";
    }
}

/* =====================================
REQUIRE EMPLOYER OR ADMIN
===================================== */
export async function requireEmployer() {

    await loadUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const role = getRole();

    if (role !== "employer" && role !== "admin") {
        window.location.href = "welcomepage.html";
    }
}

/* =====================================
LOGOUT
===================================== */
export async function logout() {

    await supabase.auth.signOut();

    currentUser = null;
    currentProfile = null;

    window.location.href = "login.html";
}