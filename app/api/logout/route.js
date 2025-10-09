import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'

export async function POST(req) {
    const supabase = await createClient()

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Logged out successfully' });
}