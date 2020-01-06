import React from 'react'

import { anonOnly } from '../utils/auth'
import AuthForm from '../components/auth/AuthForm'

const Register = () => {
  return <AuthForm register={true} />
}

Register.getInitialProps = (ctx, initialUser) => {
  anonOnly(ctx, initialUser)
  return {}
}

export default Register
