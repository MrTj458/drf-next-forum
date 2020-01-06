import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { removeToken } from '../../utils/auth'

import { userContext } from '../auth/UserProvider'

const Nav = () => {
  const router = useRouter()
  const { user, setUser } = React.useContext(userContext)

  const logout = () => {
    removeToken()
    setUser({})
    router.push('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Forum</a>
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        {/* Left side nav */}
        <div className="navbar-nav mr-auto">
          <a className="nav-item nav-link" href="#">
            Stuff
          </a>
        </div>

        {/* Right side nav */}
        <div className="navbar-nav">
          {!user.id && (
            <>
              {/* Signed out links */}
              <Link href="/login">
                <a className="nav-item nav-link">Sign In</a>
              </Link>
              <Link href="/register">
                <a className="nav-item nav-link">Register</a>
              </Link>
            </>
          )}
          {user.id && (
            <>
              {/* Signed in links */}
              <Link href="/profile">
                <a className="nav-item nav-link">{user.username}</a>
              </Link>
              <button onClick={logout} className="btn btn-link nav-link">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
