import { Suspense } from 'react'
import Link from 'next/link'
import classes from '../meals/page.module.css'
import MealsGrid from '@/components/meals/meals-grid'
import { getMealsByCreatorEmail } from '@/lib/meals'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'My Meals',
  description: 'Browse and manage the meals you shared.',
}

async function UserMeals() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const meals = await getMealsByCreatorEmail(user.email)

  if (meals.length === 0) {
    return <p className={classes.loading}>You have not shared any meals yet.</p>
  }

  return (
    <MealsGrid
      meals={meals}
      currentUserEmail={user.email}
      showOwnerActions={true}
    />
  )
}

export default function MyMealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Meals shared by <span className={classes.highlight}>you</span>
        </h1>
        <p>Review, edit, or delete the recipes you published.</p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share a new Recipe</Link>
        </p>
      </header>
      <main>
        <Suspense fallback={<p className={classes.loading}>Fetching your meals...</p>}>
          <UserMeals />
        </Suspense>
      </main>
    </>
  )
}