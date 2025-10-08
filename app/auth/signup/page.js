'use client'
import { signupUser } from '@/app/actions/auth'
import classes from './page.module.css'
import { useActionState } from 'react'

 
export default function SignupForm() {
    const [state, action, pending] = useActionState(signupUser, undefined)
  return (
    <>
      <header className={classes.header}>
        <h1>
          Register
        </h1>
        <p>Create your new account</p>
      </header>
          <main className={classes.main}>

    <form className={classes.form} action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name"  defaultValue={state?.values?.name || ''}/>
      </div>
            {state?.errors?.name && <p className={classes.error}>{state.errors.name}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" defaultValue={state?.values?.email || ''}/>
      </div>
            {state?.errors?.email && <p className={classes.error}>{state.errors.email}</p>}
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" defaultValue={state?.values?.password || ''}/>
      </div>
          {state?.errors?.password && (
        <div>
          <p className={classes.error}>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li className={classes.error} key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <p className={classes.actions}>
           <button  disabled={pending} type="submit"> {pending ? 'Signing Up...' : 'Sign Up'}</button>
      </p>
      
    </form>
    </main>
    </>
  )
}