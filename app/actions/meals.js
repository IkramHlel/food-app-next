'use server'

import { redirect } from "next/navigation";
import { saveMeal } from "@/lib/meals"
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabaseServer'



function isInvalidText(text){
    return !text || text.trim() === ""
}

export async function shareMeal(prevState, formData) {
      const supabase = await createSupabaseServerClient();
        const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (!session || sessionError) throw new Error('User not logged in');

  const user = session.user;

    const meal = {
        title: formData.get('title'),
        summary:formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get("image"),
        creator: user.user_metadata?.name || 'Anonymous',
        creator_email:  user.email,
    };
    if(isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    !meal.image || meal.image.size === 0){
        return {
            message: 'Invalid input.',
        }
    }
    await saveMeal(meal);
    revalidatePath('/meals')
    redirect('/meals')
}