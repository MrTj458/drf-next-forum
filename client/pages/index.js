import React, { useState, useContext } from 'react'

import client from '../utils/client'
import { userContext } from '../components/auth/UserProvider'

import Topic from '../components/topics/Topic'
import TopicForm from '../components/topics/TopicForm'

const Home = ({ topics }) => {
  const { user } = useContext(userContext)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <h1 className="text-center">Topics</h1>
      <div className="d-flex justify-content-center mb-2">
        {user.id && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            Create New Topic
          </button>
        )}
      </div>
      {showForm && <TopicForm />}
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
    </div>
  )
}

Home.getInitialProps = async () => {
  const res = await client.get('/api/topics/')

  return {
    topics: res.data.topics,
  }
}

export default Home
