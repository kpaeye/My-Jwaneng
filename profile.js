import { supabase } from './supabase.js';
import { loadUser } from './auth.js';

/* GET PROFILE */
export async function getProfile() {

    const user = await loadUser();

    const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.user.id)
        .single();

    return data;
}

/* UPDATE PROFILE */
export async function updateProfile(profile) {

    const user = await loadUser();

    const { error } = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("id", user.user.id);

    return error;
}