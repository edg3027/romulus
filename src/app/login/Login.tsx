'use client'

import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import InputGroup from '../../components/common/InputGroup'
import { useLoginMutation, useSession } from '../../services/auth'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

type LoginFormFields = {
  username: string
  password: string
}

const Login: NextPage = () => {
  // navigate away from the page if the user is already logged in
  const session = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session.isLoggedIn) {
      router.push('/genres')
    }
  }, [router, session.isLoggedIn])

  const {
    handleSubmit,
    control,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormFields>()

  const { mutate, isLoading } = useLoginMutation()
  const onSubmit = useCallback(
    (data: LoginFormFields) => mutate(data),
    [mutate],
  )

  useEffect(() => setFocus('username'), [setFocus])

  return (
    <div className='bg-texture dark:bg-texture-dark relative flex h-full w-full items-center justify-center transition'>
      <div className='absolute top-0 z-0 h-8 w-full bg-gradient-to-b from-white to-transparent transition dark:from-black' />
      <form
        className='z-10 rounded-lg border bg-white p-4 shadow transition dark:border-gray-800 dark:bg-gray-900'
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        <div className='space-y-3'>
          <InputGroup id='username' label='Username' error={errors.username}>
            <Controller
              name='username'
              control={control}
              rules={{ required: 'Username is required' }}
              render={({ field }) => <Input {...field} />}
            />
          </InputGroup>

          <InputGroup id='password' label='Password' error={errors.password}>
            <Controller
              name='password'
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => <Input type='password' {...field} />}
            />
          </InputGroup>
        </div>

        <Button className='mt-4 w-full' type='submit' loading={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        <div className='mt-3 text-sm text-gray-700 transition dark:text-gray-400'>
          Need an account?{' '}
          <Link href='/register' className='text-primary-500 hover:underline'>
            Register.
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Login
