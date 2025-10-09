'use server'

import { SignupFormSchema, LoginFormSchema } from '@/utils/validation/auth'
import {login, signup} from '@/lib/auth.js'
import { revalidatePath } from 'next/cache';
import { notFound, redirect } from "next/navigation";


export async function loginUser(prevState, formData) {
   const fields = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const validatedFields = LoginFormSchema.safeParse(fields)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: fields
    }
  }

   const {email, password } = validatedFields.data
    const { data, error } = await login({email, password})
      if (error) {
    return { errors: { auth: [error] } }
  }
    revalidatePath('/')
    redirect('/')

}

export async function signupUser(prevState, formData) {
     const fields = {
          name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const validatedFields = SignupFormSchema.safeParse(fields)
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      values: fields,
    }
  }

   const { name, email, password } = validatedFields.data

     const { data, error } = await signup({ name, email, password })
      if (error) {
    return { errors: { auth: [error] } }
  }
    revalidatePath('/')
    redirect('/')
}