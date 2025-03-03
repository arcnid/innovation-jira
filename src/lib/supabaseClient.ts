// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import { create } from "domain";

export const supabaseClient = createClient(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_KEY as string // Use the service key on the server side
);

export function getSupabaseClient() {
	return supabaseClient;
}
