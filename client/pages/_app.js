import React from 'react'
import nextCookie from 'next-cookies'
import { useRouter } from 'next/router'

import client from '../utils/client'
import { setToken, removeToken } from '../utils/auth'

import UserProvider from '../components/auth/UserProvider'
import Nav from '../components/layout/Nav'

const MyApp = ({ Component, pageProps, initialUser }) => {
  const router = useRouter()

  return (
    <UserProvider initialUser={initialUser}>
      <Nav />
      <div className="container">
        {router.query.msg && (
          <div
            style={{ maxWidth: '500px' }}
            className="mx-auto alert alert-info text-center mt-4"
          >
            {router.query.msg}
          </div>
        )}
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
