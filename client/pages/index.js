import React from 'react'

import client from '../utils/client'
import { userContext } from '../components/auth/UserProvider'

const Home = ({ topics }) => {
  const { user } = React.useContext(userContext)

  return (
    <>
      <h1>Welcome{user.id ? ` back ${user.username}` : ''}</h1>
      {topics.map(topic => (
        <p key={topic.id}>{topic.title}</p>
      ))}
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
