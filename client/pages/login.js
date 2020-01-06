import React from 'react'

import { anonOnly } from '../utils/auth'
import AuthForm from '../components/auth/AuthForm'

const Login = () => {
  return <AuthForm register={false} />
}

Login.getInitialProps = (ctx, initialUser) => {
  anonOnly(ctx, initialUser)
  return {}
}

export default Login
