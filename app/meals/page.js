import { Suspense } from 'react'
import Link from 'next/link'
import classes from './page.module.css'
import MealsGrid from '@/components/meals/meals-grid'
import { getMeals } from '@/lib/meals'
import { createClient } from '@/utils/supabase/server'

export const metadata = {
  title: 'All Meals',
  description: 'Browse the delicious meals shared by our vibrant community.',
}

async function Meals() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const meals = await getMeals()
  return <MealsGrid meals={meals} currentUserEmail={user?.email} />
}

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>Delicious meals</h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share your favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<p className={classes.loading}>Fetching Meals...</p>}>
          <Meals />
        </Suspense>
      </main>
    </>
  )
}