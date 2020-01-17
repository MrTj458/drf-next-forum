import React from 'react'

import client from '../../utils/client'
import { userContext } from '../../components/auth/UserProvider'

import CommentForm from '../../components/posts/CommentForm'
import Comment from '../../components/posts/Comment'

const Post = ({ post, initialComments }) => {
  const { user } = React.useContext(userContext)

  const [comments, setComments] = React.useState(initialComments)

  const addComment = newComment => {
    const newComments = [newComment, ...comments]
    setComments(newComments)
  }

  const removeComment = id => {
    const newComments = comments.filter(comment => comment.id !== id)
    setComments(newComments)
  }

  const deletePost = () => {
    try {
      // Delete post
      alert('TODO')
    } catch (e) {}
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
                Delete
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
