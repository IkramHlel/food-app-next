'use client'

import { useActionState } from 'react'
import { editMeal } from '@/app/actions/meals'
import ImagePicker from '@/components/meals/image-picker'
import MealsFormSubmit from '@/components/meals/meals-form-submit'
import classes from '@/app/meals/share/page.module.css'

export default function EditMealForm({ meal }) {
  const [state, formAction] = useActionState(editMeal, {
    message: null,
    values: {
      title: meal.title,
      summary: meal.summary,
      instructions: meal.instructions,
      currentImage: meal.image,
    },
  })

  const imagePreview = `https://rvvsyblinqvbgoshqhdi.supabase.co/storage/v1/object/public/meals/${state?.values?.currentImage || meal.image}`

  return (
    <>
      <header className={classes.header}>
        <h1>
          Edit your <span className={classes.highlight}>meal</span>
        </h1>
        <p>Update your recipe details and save the changes.</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <input type="hidden" name="mealSlug" value={meal.slug} />
          <input
            type="hidden"
            name="currentImage"
            value={state?.values?.currentImage || meal.image}
          />

          <div>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" defaultValue={state?.values?.title || meal.title} />
            {state?.errors?.title && <p className={classes.error}>{state.errors.title}</p>}
          </div>

          <div>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" defaultValue={state?.values?.summary || meal.summary} />
            {state?.errors?.summary && <p className={classes.error}>{state.errors.summary}</p>}
          </div>

          <div>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              defaultValue={state?.values?.instructions || meal.instructions}
            ></textarea>
            {state?.errors?.instructions && <p className={classes.error}>{state.errors.instructions}</p>}
          </div>

          <ImagePicker label="Update image (optional)" name="image" initialImage={imagePreview} />
          {state?.errors?.image && <p className={classes.error}>{state.errors.image}</p>}
          {state?.errors?.auth && <p className={classes.error}>{state.errors.auth[0]}</p>}

          <p className={classes.actions}>
            <MealsFormSubmit idleLabel="Save Changes" pendingLabel="Saving..." />
          </p>
        </form>
      </main>
    </>
  )
}