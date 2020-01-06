import React from 'react'

import client from '../utils/client'

import Topic from '../components/topics/Topic'

const Home = ({ topics }) => {
  return (
    <>
      <h1 className="text-center">Topics</h1>

      <div className="card shadow">
        <div className="card-body">
          {topics.map(topic => (
            <div key={topic.id}>
              <Topic topic={topic} />
              <hr />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

Home.getInitialProps = async () => {
  const res = await client.get('/api/topics/')

  return {
    topics: res.data.topics,
  }
}

export default Home
