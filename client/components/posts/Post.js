import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import client from '../../utils/client'

const Post = ({ post, replacePost }) => {
  const router = useRouter()

  const like = async () => {
    try {
      const newPost = await client.post(`/api/posts/${post.id}/like/`)
      replacePost(newPost.data.post)
    } catch (e) {
      if (e.response && e.response.status === 401) {
        router.push({
          pathname: '/login',
          query: {
            next: `/topics/[id]`,
            nextAs: `/topics/${post.topic_id}`,
            msg: 'You must sign in to like posts',
          },
        })
      } else {
        router.push(
          {
            pathname: `/topics/[id]`,
            query: {
              msg: 'Something went wrong! Unable to like post.',
            },
          },
          `/topics/${post.topic_id}`
        )
      }
    }
  }

  return (
    <>
      <div className="d-flex align-items-center">
        <button
          onClick={like}
          className={`mr-2 btn ${post.liked_by_user && 'text-primary'}`}
        >
          <i className="fas fa-arrow-up"></i>
          {post.likes}
        </button>
        <h3>
          <Link href="/posts/[id]" as={`/posts/${post.id}`}>
            <a>{post.title}</a>
          </Link>
        </h3>
      </div>
      <small className="text-muted">
        Created by: {post.author.username} |{' '}
        {new Date(post.created_at).toLocaleString()}
      </small>
    </>
  )
}

export default Post
