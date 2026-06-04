import { requireAuth } from './auth.js';

/* BASIC PROTECTION */
export async function protectPage() {
    const user = await requireAuth();

    if (!user) {
        window.location.href = "login.html";
    }
}

/* ROLE-BASED PROTECTION (future-ready) */
export async function protectAdminOnly(userRole = "admin") {

    const user = await requireAuth();

    // placeholder role check (we will connect DB later)
    const role = user.user_metadata?.role || "user";

    if (role !== userRole) {
        alert("Access denied");
        window.location.href = "index.html";
    }
}