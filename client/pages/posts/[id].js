import React, { useState } from 'react'
import { useRouter } from 'next/router'

import client from '../../utils/client'
import { userContext } from '../../components/auth/UserProvider'

import CommentForm from '../../components/posts/CommentForm'
import Comment from '../../components/posts/Comment'

const Post = ({ post, initialComments }) => {
  const router = useRouter()
  const { user } = React.useContext(userContext)
  const [loading, setLoading] = useState(false)

  const [comments, setComments] = React.useState(initialComments)

  const addComment = newComment => {
    const newComments = [newComment, ...comments]
    setComments(newComments)
  }

  const removeComment = id => {
    const newComments = comments.filter(comment => comment.id !== id)
    setComments(newComments)
  }

  const deletePost = async () => {
    setLoading(true)
    try {
      await client.delete(`/api/posts/${post.id}/`)
      router.push('/topics/[id]', `/topics/${post.topic_id}`)
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="card shadow mt-4">
        <div className="card-body">
          <h2 className="card-title text-center">{post.title}</h2>
          <div className="text-center">
            Posted by {post.author.username} on{' '}
            {new Date(post.created_at).toLocaleString()}
          </div>
          {user.id === post.author.id && (
            <div className="mt-2 d-flex justify-content-center">
              <button className="btn btn-outline-secondary mr-2">Edit</button>
              <button className="btn btn-outline-danger" onClick={deletePost}>
                {loading ? <div className="spinner-border" /> : 'Delete'}
              </button>
            </div>
          )}
          <hr />
          <p className="card-text">{post.body}</p>
        </div>
      </div>

      {user.id && <CommentForm postId={post.id} addComment={addComment} />}

      <div className="card shadow my-4">
        <div className="card-body">
          <h3 className="card-title">Comments</h3>
          <hr />
          {comments.map(comment => (
            <div key={comment.id}>
              <Comment comment={comment} removeComment={removeComment} />
              <hr />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

Post.getInitialProps = async ctx => {
  const id = ctx.ctx.query.id

  try {
    const postPromise = client.get(`/api/posts/${id}/`)
    const commentPromise = client.get(`/api/posts/${id}/comments/`)

    const post = await postPromise
    const comments = await commentPromise

    return {
      post: post.data.post,
      initialComments: comments.data.comments,
    }
  } catch (e) {
    return {
      post: {},
      initialComments: [],
    }
  }
}

export default Post
