import React from 'react'

import client from '../../utils/client'
import { userContext } from '../auth/UserProvider'

const Comment = ({ comment, removeComment }) => {
  const { user } = React.useContext(userContext)

  const [loading, setLoading] = React.useState(false)

  const deleteComment = async () => {
    setLoading(true)

    try {
      await client.delete(`/api/comments/${comment.id}/`)
      removeComment(comment.id)
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <>
      <small>
        {comment.author.username} |{' '}
        {new Date(comment.created_at).toLocaleString()}
        {user.id === comment.author.id && (
          <button
            className="btn btn-sm btn-outline-danger ml-2"
            onClick={deleteComment}
          >
            {loading ? <div className="spinner-border" /> : 'Delete'}
          </button>
        )}
      </small>
      <p>{comment.body}</p>
    </>
  )
}

export default Comment
