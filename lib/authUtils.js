import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Create a single admin user in Supabase
export async function createAdminUser(email, password) {
  const supabase = createClientComponentClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'admin',
      }
    }
  });
  
  if (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
  
  return data;
}

// Check if user is authenticated
export async function checkUserAuthenticated() {
  const supabase = createClientComponentClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Sign out the current user
export async function signOut() {
  const supabase = createClientComponentClient();
  
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}