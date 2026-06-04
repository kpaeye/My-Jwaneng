import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://jxigyoxikaqwwzfnccej.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aWd5b3hpa2Fxd3d6Zm5jY2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTY4NDAsImV4cCI6MjA5NTY3Mjg0MH0.P_bXYxIXYkhwi6cfy4fwbkM_s2b9uV9j22BzftWxaAc";

export const supabase = createClient(supabaseUrl, supabaseKey);