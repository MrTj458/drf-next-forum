import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import client from '../../utils/client'
import { userContext } from './UserProvider'
import { setToken } from '../../utils/auth'

const AuthForm = ({ register }) => {
  const router = useRouter()
  const { setUser } = React.useContext(userContext)
  const inputRef = React.useRef(null)

  // State
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({
    username: null,
    email: null,
    password: null,
    authentication: null,
    unknown: null,
  })

  React.useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let res = null
      if (register) {
        res = await client.post('/api/users/', {
          username,
          email,
          password,
        })
      } else {
        res = await client.post('/api/auth/', {
          username,
          password,
        })
      }
      setUser(res.data.user)
      setToken(res.data.token)
      if (router.query.next) {
        router.push(`${router.query.next}`)
      } else {
        router.push('/')
      }
    } catch (err) {
      if (err.response) {
        setErrors(err.response.data)
      } else {
        setErrors({ ...errors, unknown: 'Something went wrong!' })
      }
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center w-100">
      <div style={{ maxWidth: '500px' }} className="card shadow mt-4 w-100">
        <div className="card-body">
          <h1 className="card-title text-center">
            {register ? 'Register' : 'Sign In'}
          </h1>
          <hr />
          {(errors.authentication || errors.unknown) && (
            <div className="alert alert-danger text-center">
              {errors.authentication && errors.authentication[0]}
              {errors.unknown}
            </div>
          )}
          <form className="card-text" onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Username*</label>
                <input
                  className={`form-control ${errors.username && 'is-invalid'}`}
                  ref={inputRef}
                  type="text"
                  onChange={e => setUsername(e.target.value)}
                />
                {errors.username && (
                  <small className="text-danger">{errors.username[0]}</small>
                )}
              </div>

              {/* Email */}
              {register && (
                <div className="form-group">
                  <label htmlFor="username">Email*</label>
                  <input
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    type="text"
                    onChange={e => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email[0]}</small>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input
                  className={`form-control ${errors.password && 'is-invalid'}`}
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
                {errors.password && (
                  <small className="text-danger">{errors.password[0]}</small>
                )}
              </div>

              {register ? (
                <Link href="/login">
                  <a className="d-block text-center">
                    <small>Already have an account? Sign in here.</small>
                  </a>
                </Link>
              ) : (
                <Link href="/register">
                  <a className="d-block text-center">
                    <small>Need an account? Register here.</small>
                  </a>
                </Link>
              )}
              <button className="btn btn-primary container-fluid" type="submit">
                {loading ? (
                  <div className="spinner-border" />
                ) : register ? (
                  'Register'
                ) : (
                  'Sign In'
                )}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
