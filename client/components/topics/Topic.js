import React from 'react'
import Link from 'next/link'

const Topic = ({ topic }) => {
  return (
    <>
      <h3>
        <Link href={`/topics/${topic.id}`}>
          <a>{topic.title}</a>
        </Link>
      </h3>
      <p>Created by: {topic.author.username}</p>
    </>
  )
}

export default Topic
