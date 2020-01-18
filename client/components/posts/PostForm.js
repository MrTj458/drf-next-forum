import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

import client from '../../utils/client'

const defaultInitialData = {
  title: '',
  body: '',
}

const PostForm = ({
  topicId,
  update = false,
  done = null,
  initialData = defaultInitialData,
}) => {
  const router = useRouter()
  const titleRef = useRef(null)

  const [title, setTitle] = useState(initialData.title)
  const [body, setBody] = useState(initialData.body)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    title: null,
    body: null,
    unknown: null,
  })

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  const onSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      let res = {}

      if (update) {
        res = await client.put(`/api/posts/${initialData.id}/`, {
          title,
          body,
        })
        done()
      } else {
        res = await client.post(`/api/topics/${topicId}/posts/`, {
          title,
          body,
        })
      }
      router.push('/posts/[id]', `/posts/${res.data.post.id}`)
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
        <h2 className="card-title">
          {update ? 'Update Post' : 'Create A New Post'}
        </h2>
        {errors.unknown && (
          <div className="alert alert-danger text-center">{errors.unknown}</div>
        )}
        <form onSubmit={onSubmit}>
          <fieldset disabled={loading}>
            {/* Title */}
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

            {/* Body */}
            <div className="form-group">
              <label htmlFor="Title">Body*</label>
              <textarea
                className={`form-control ${errors.body && 'is-invalid'}`}
                value={body}
                onChange={e => setBody(e.target.value)}
              />
              {errors.body && (
                <small className="text-danger">{errors.body[0]}</small>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              {loading ? (
                <div className="spinner-border" />
              ) : update ? (
                'Update Post'
              ) : (
                'Create Post'
              )}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default PostForm
