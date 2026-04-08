import fs from 'node:fs'

import slugify from 'slugify'
import xss from 'xss'
import Stream from 'node:stream'
import { getSupabaseAdmin } from '@/utils/supabase/admin'


export async function getMeals() {
  const { data, error } = await getSupabaseAdmin().from('meals').select('*');
  if (error) throw error;
  return data;
}

export async function getMealsByCreatorEmail(email) {
  const { data, error } = await getSupabaseAdmin()
    .from('meals')
    .select('*')
    .eq('creator_email', email)
  if (error) throw error;
  return data;
}

export async function getMeal(slug) {
  const { data, error } = await getSupabaseAdmin().from('meals').select('*').eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true })
  meal.instructions = xss(meal.instructions)

  const extension = meal.image.name.split('.').pop()
  const fileName = `${meal.slug}.${extension}`
  const bufferedImage = await meal.image.arrayBuffer()

  const { error: uploadError } = await getSupabaseAdmin()
    .storage.from('meals')
    .upload(fileName, Buffer.from(bufferedImage), {
      contentType: meal.image.type,
      upsert: true,
    })
  if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

  meal.image = fileName

  const { data, error } = await getSupabaseAdmin().from('meals').insert([meal])
  if (error) throw error;
  return data;
}

export async function updateMeal(existingSlug, meal) {
  meal.slug = slugify(meal.title, { lower: true })
  meal.instructions = xss(meal.instructions)

  if (typeof meal.image !== 'string') {
    const extension = meal.image.name.split('.').pop()
    const fileName = `${meal.slug}.${extension}`
    const bufferedImage = await meal.image.arrayBuffer()

    const { error: uploadError } = await getSupabaseAdmin()
      .storage.from('meals')
      .upload(fileName, Buffer.from(bufferedImage), {
        contentType: meal.image.type,
        upsert: true,
      })

    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
    meal.image = fileName
  }

  const { data, error } = await getSupabaseAdmin()
    .from('meals')
    .update(meal)
    .eq('slug', existingSlug)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMealBySlug(slug) {
  const meal = await getMeal(slug)

  const { error } = await getSupabaseAdmin()
    .from('meals')
    .delete()
    .eq('slug', slug)

  if (error) throw error

  if (meal?.image) {
    const { error: storageError } = await getSupabaseAdmin()
      .storage
      .from('meals')
      .remove([meal.image])

    if (storageError) {
      throw new Error(`Image deletion failed: ${storageError.message}`)
    }
  }
}
