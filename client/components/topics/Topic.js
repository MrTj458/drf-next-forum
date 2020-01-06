import React from 'react'
import Link from 'next/link'

const Topic = ({ topic }) => {
  return (
    <>
      <h3>
        <Link href="/topics/[id]" as={`/topics/${topic.id}`}>
          <a>{topic.title}</a>
        </Link>
      </h3>
      <small className="text-muted">
        Created by: {topic.author.username} on{' '}
        {new Date(topic.created_at).toLocaleDateString()}
      </small>
    </>
  )
}

export default Topic
