import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function login({email, password}) {
    const supabase = await createSupabaseServerClient();
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password
  })  
  if (error) {
    // Log technique pour le debug
    console.error('Supabase login error:', error);
    // Message utilisateur
    return { error: error.message || 'Unable to sign in. Please try again.' };
  }
    return data;
}

export async function signup({ name, email, password}) {
      const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // sauvegarde du nom dans "user_metadata"
        },
      },
    });

  if (error) {
    console.error('Supabase signup error:', error);
    return { error: error.message || 'An error occured while creating your account.' };

  }
  return data;
}