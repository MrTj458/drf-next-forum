import Router from 'next/router'
import Cookies from 'js-cookie'

import client from './client'

export const setToken = token => {
  Cookies.set('token', token, { expires: 7 })
  client.defaults.headers.common['Authorization'] = `Token ${token}`
}

export const removeToken = () => {
  Cookies.remove('token')
  delete client.defaults.headers.common['Authorization']
}

/**
 * Require user to be logged in to visit page.
 */
export const requireLogin = (ctx, initialUser) => {
  const req = ctx.ctx.req
  const res = ctx.ctx.res
  const msg = 'You must sign in before visiting this page.'

  if (!initialUser.id) {
    if (req) {
      res.writeHead(302, {
        Location: `/login?next=${req.url}&msg=${msg}`,
      })
      res.end()
    } else {
      Router.push({
        pathname: '/login',
        query: {
          next: ctx.ctx.pathname,
          msg,
        },
      })
    }
  }
}

/**
 * User must be signed out to view page.
 */
export const anonOnly = (ctx, initialUser) => {
  const req = ctx.ctx.req
  const res = ctx.ctx.res

  if (initialUser.id) {
    if (req) {
      res.writeHead(302, {
        Location: '/',
      })
      res.end()
    } else {
      Router.push('/')
    }
  }
}
