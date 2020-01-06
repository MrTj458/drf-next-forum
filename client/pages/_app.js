import React from 'react'
import nextCookie from 'next-cookies'

import client from '../utils/client'
import { setToken, removeToken } from '../utils/auth'

import UserProvider from '../components/auth/UserProvider'
import Nav from '../components/layout/Nav'

const MyApp = ({ Component, pageProps, initialUser }) => {
  return (
    <UserProvider initialUser={initialUser}>
      <Nav />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </UserProvider>
  )
}

MyApp.getInitialProps = async appContext => {
  const { token } = nextCookie(appContext.ctx)

  // Get current user
  let initialUser = {}
  if (token) {
    setToken(token)
    try {
      // Try to get user
      const res = await client.get('/api/auth/')
      initialUser = res.data.user
    } catch (err) {
      // Token did not work
      removeToken()
    }
  }

  // Get page props
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext,
      initialUser
    )
  }

  return {
    initialUser,
    pageProps,
  }
}

export default MyApp
