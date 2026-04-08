'use server'

import { redirect } from "next/navigation";
import { deleteMealBySlug, getMeal, saveMeal, updateMeal } from "@/lib/meals"
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

export async function editMeal(prevState, formData) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) throw new Error('User not logged in')

  const user = data.user
  const mealSlug = formData.get('mealSlug')
  const existingMeal = await getMeal(mealSlug)

  if (!existingMeal || existingMeal.creator_email !== user.email) {
    return { errors: { auth: ['You are not allowed to edit this meal.'] } }
  }

  const uploadedImage = formData.get('image')
  const nextImage = uploadedImage && uploadedImage.size > 0
    ? uploadedImage
    : formData.get('currentImage')

  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: nextImage,
    creator: existingMeal.creator,
    creator_email: existingMeal.creator_email,
  }

  const validatedFields = MealSchema.safeParse({
    title: meal.title,
    summary: meal.summary,
    instructions: meal.instructions,
    image: meal.image,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        currentImage: existingMeal.image,
      },
    }
  }

  const updatedMeal = await updateMeal(mealSlug, meal)
  revalidatePath('/meals')
  revalidatePath('/my-meals')
  revalidatePath(`/meals/${mealSlug}`)
  revalidatePath(`/meals/${updatedMeal.slug}`)
  redirect('/my-meals')
}

export async function deleteMeal(prevState, formData) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return { error: 'User not logged in.' }
  }

  const mealSlug = formData.get('mealSlug')
  const existingMeal = await getMeal(mealSlug)

  if (!existingMeal || existingMeal.creator_email !== data.user.email) {
    return { error: 'You are not allowed to delete this meal.' }
  }

  await deleteMealBySlug(mealSlug)

  revalidatePath('/meals')
  revalidatePath('/my-meals')
  revalidatePath(`/meals/${mealSlug}`)
  redirect('/my-meals')
}