/**
 * Supabase Browser Client
 * For use in client components (React)
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  return client;
}

// Re-export for convenience
export { getSupabaseBrowserClient as createClient };
