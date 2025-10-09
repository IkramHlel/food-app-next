'use server'

import { redirect } from "next/navigation";
import { saveMeal } from "@/lib/meals"
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'
import { MealSchema } from '@/utils/validation/meal'

export async function shareMeal(prevState, formData) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) throw new Error('User not logged in');
    const user = data?.user

    const meal = {
        title: formData.get('title'),
        summary:formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get("image"),
        creator: user.user_metadata?.name || 'Anonymous',
        creator_email:  user.email,
    };
    const validatedFields = MealSchema.safeParse({title:meal.title,summary:meal.summary,instructions:meal.instructions, image:meal.image})
      if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: {title:meal.title,summary:meal.summary,instructions:meal.instructions, image:meal.image}
    }
  }
    await saveMeal(meal);
    revalidatePath('/meals')
    redirect('/meals')
}