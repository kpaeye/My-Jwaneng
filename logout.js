import { supabase } from './supabase.js';

await supabase.auth.signOut();

window.location.href = "login.html";

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await supabase.auth.signOut();

    window.location.href = "login.html";

});