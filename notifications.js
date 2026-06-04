import { supabase } from './supabase.js';
import { loadUser } from './auth.js';

/* GET NOTIFICATIONS */
export async function getNotifications() {

    const user = await loadUser();

    const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

    return data;
}

/* CREATE NOTIFICATION */
export async function createNotification(user_id, title, message, type) {

    await supabase
        .from("notifications")
        .insert([{
            user_id,
            title,
            message,
            type
        }]);
}

/* MARK AS READ */
export async function markAsRead(id) {

    await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
}