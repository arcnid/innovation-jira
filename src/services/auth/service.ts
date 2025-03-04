// services/authService.js
import { createClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

/**
 * Logs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The login data (e.g., user and session information).
 * @throws Will throw an error if the login fails.
 */
export const login = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Logs out the current user.
 * Calls signOut and then clears common Supabase cookie names as a fallback.
 * Finally, it reloads the page to ensure the UI updates to the logged-out state.
 */
export const logout = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  // If using client-side cookie storage, explicitly clear the cookies.
};

/**
 * Checks if a user is currently logged in.
 * @returns {Promise<boolean>} True if the user is logged in, otherwise false.
 */
export const isLoggedIn = async () => {
  const supabase = getSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return false;
  }

  return session !== null;
};

/**
 * Gets the currently logged in user.
 * @returns {Promise<object|null>} The user object or null if there's an error.
 */
export const getLoggedInUser = async () => {
  const supabase = getSupabaseClient();

  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return user;
};

export default { login, isLoggedIn, logout };
