import React from 'react'

import client from '../../utils/client'

const CommentForm = ({ postId, addComment }) => {
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState({ body: null, unknown: null })
  const [body, setBody] = React.useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const newComment = await client.post(`/api/posts/${postId}/comments/`, {
        body,
      })
      addComment(newComment.data.comment)
      setBody('')
      setLoading(false)
    } catch (e) {
      if (e.response) {
        setErrors(e.response.data)
      } else {
        setErrors({ ...errors, unknown: 'Something went wrong!' })
      }
      setLoading(false)
    }
  }

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4 className="card-title">Post a comment</h4>
        {errors.unknown && (
          <div className="alert alert-danger">{errors.unknown}</div>
        )}
        <form onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div className="form-group">
              <textarea
                rows={5}
                className={`form-control ${errors.body && 'is-invalid'}`}
                value={body}
                onChange={e => setBody(e.target.value)}
              ></textarea>
              {errors.body && (
                <small className="text-danger">{errors.body[0]}</small>
              )}
            </div>
          </fieldset>
          <button type="submit" className="btn btn-primary">
            {loading ? <div className="spinner-border" /> : 'Comment'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CommentForm
