'use client'

import { useActionState, useState } from 'react'
import { deleteMeal } from '@/app/actions/meals'
import classes from './meal-item.module.css'

const initialState = { error: null }

export default function DeleteMealButton({ slug, title }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction, pending] = useActionState(deleteMeal, initialState)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Delete
      </button>

      {isOpen && (
        <div className={classes.modalBackdrop} onClick={() => setIsOpen(false)}>
          <div className={classes.modal} onClick={(event) => event.stopPropagation()}>
            <h3>Delete meal</h3>
            <p>
              Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
            </p>

            <form action={formAction}>
              <input type="hidden" name="mealSlug" value={slug} />
              <div className={classes.modalActions}>
                <button
                  type="button"
                  className={classes.cancelButton}
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={classes.deleteButton} disabled={pending}>
                  {pending ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
              {state?.error && <p className={classes.modalError}>{state.error}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}