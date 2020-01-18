import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import client from '../../utils/client'

const TopicForm = () => {
  const router = useRouter()
  const titleRef = useRef(null)

  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    title: null,
    unknown: null,
  })

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await client.post('/api/topics/', { title })
      router.push('/topics/[id]', `/topics/${res.data.topic.id}`)
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
    <div className="card my-4">
      <div className="card-body">
        <h2 className="card-title">Create a new Topic</h2>
        {errors.unknown && (
          <div className="alert alert-danger text-center">{errors.unknown}</div>
        )}
        <form onSubmit={onSubmit}>
          <fieldset disabled={loading}>
            <div className="form-group">
              <label htmlFor="title">Title*</label>
              <input
                className={`form-control ${errors.title && 'is-invalid'}`}
                ref={titleRef}
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              {errors.title && (
                <small className="text-danger">{errors.title[0]}</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              {loading ? <div className="spinner-border" /> : 'Create Topic'}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default TopicForm
