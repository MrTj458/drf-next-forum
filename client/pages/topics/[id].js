import React from 'react'
import Link from 'next/link'

import client from '../../utils/client'

const Topic = ({ topic }) => {
  if (!topic.id) {
    return (
      <div className="text-center">
        <h1>Unable to find topic</h1>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-center">{topic.title}</h1>
      <div className="card shadow">
        <div className="card-body">
          <p>Posts will go here</p>
          <hr />
          <p>Like this</p>
          <hr />
        </div>
      </div>
    </>
  )
}

Topic.getInitialProps = async ctx => {
  let topic = {}

  try {
    const res = await client.get(`/api/topics/${ctx.ctx.query.id}/`)
    topic = res.data.topic
  } catch (e) {}

  return {
    topic,
  }
}

export default Topic
