'use client'

import { useFormStatus } from "react-dom"

export default function MealsFormSubmit({ idleLabel = 'Share Meal', pendingLabel = 'Submitting...' }) {
    const {pending} = useFormStatus()
    return(<button disabled={pending}>{pending ? pendingLabel : idleLabel}</button>)
}