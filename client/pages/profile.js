import React from 'react'

import { requireLogin } from '../utils/auth'
import { userContext } from '../components/auth/UserProvider'

const Profile = () => {
  const { user } = React.useContext(userContext)

  return (
    <>
      <div className="card mt-4 shadow">
        <div className="card-body">
          <h2 className="card-title text-center">{user.username}</h2>
          <hr />
          <p className="card-text">{user.email}</p>
        </div>
      </div>
    </>
  )
}

Profile.getInitialProps = async (ctx, initialUser) => {
  requireLogin(ctx, initialUser)
  return {}
}

export default Profile
