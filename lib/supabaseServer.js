import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookiesList = await cookies();
  const headersList = headers();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookiesList.get(name)?.value;
        },
        set(name, value, options) {
          cookiesList.set({ name, value, ...options });
        },
        remove(name, options) {
          cookiesList.set({ name, value: '', ...options });
        },
      },
      headers: {
        get(name) {
          return headersList.get(name);
        },
      },
    }
  );
}
