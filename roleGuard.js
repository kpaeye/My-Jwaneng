import { loadUser, getRole } from './auth.js';

/* PROTECT PAGE BY ROLE */
export async function requireRole(requiredRole) {

    const session = await loadUser();

    if (!session?.user) {
        window.location.href = "login.html";
        return;
    }

    const role = getRole();

    if (role !== requiredRole && role !== "admin") {
        alert("Access denied: insufficient permissions");
        window.location.href = "welcomepage.html";
    }
}

/* OPTIONAL MULTI-ROLE CHECK */
export async function requireAnyRole(roles = []) {

    await loadUser();

    const role = getRole();

    if (!roles.includes(role) && role !== "admin") {
        alert("Access denied");
        window.location.href = "welcomepage.html";
    }
}