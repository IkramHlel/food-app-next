import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getMeal } from '@/lib/meals'
import EditMealForm from '@/components/meals/edit-meal-form'

export default async function EditMeal({ params }) {
    const { mealSlug } = await params
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth')
    }

    const meal = await getMeal(mealSlug)

    if (!meal || meal.creator_email !== user.email) {
        redirect('/my-meals')
    }

    return <EditMealForm meal={meal} />
}