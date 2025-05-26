import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://cqwwgiyxeyyozzrbrdui.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxd3dnaXl4ZXl5b3p6cmJyZHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTgxNzksImV4cCI6MjA2MTYzNDE3OX0.iweuWDbWvkTaDatZSJuOxu6KavQ53LgLHfgNuGR_9LU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

// async function checkSupabase() {
//   const { data, error } = await supabase.from("cabins").select("*");

//   if (error) {
//     console.error("Supabase error:", error);
//   } else {
//     console.log("Supabase data:", data);
//   }
// }

// checkSupabase();
