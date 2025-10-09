import { createClient } from '@/utils/supabase/server'

export async function login({email, password}) {
  const supabase = await createClient()
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password
  })  

  if (error) {
    console.error('Supabase login error:', error);
    return { error: error.message || 'Unable to sign in. Please try again.' };
  }
    return data;
}

export async function signup({ name, email, password}) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: {name}},
    });

  if (error) {
    console.error('Supabase signup error:', error);
    return { error: error.message || 'An error occured while creating your account.' };

  }
  return data;
}