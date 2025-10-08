'use client'
import Link from 'next/link'
import { loginUser } from '@/app/actions/auth'
import classes from './page.module.css'
import { useActionState } from 'react'


export default function Login () {
    const [state, formAction, pending] = useActionState(loginUser, undefined)
    return(
              <>
      <header className={classes.header}>
        <h1>
          Welcome
        </h1>
        <p>Login to your Account</p>
      </header>
          <main className={classes.main}>

    <form className={classes.form} action={formAction}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email"  defaultValue={state?.values?.email || ''}/>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" defaultValue={state?.values?.password || ''}/>
      </div>
          {state?.errors?.auth && (
            <p className={classes.error}>{state.errors.auth[0]}</p>
          )}
      <p className={classes.actions}>
           <button type="submit" disabled={pending}>
            {pending ? 'Logging In...' : 'Login'}
           </button>
      </p>
      <div className={classes.signup}>
        <p>Don't have account?</p>
        <Link className={classes.link} href={'/auth/signup'}>Sign up</Link>
      </div>
      
    </form>
    </main>
    </>
    )
}