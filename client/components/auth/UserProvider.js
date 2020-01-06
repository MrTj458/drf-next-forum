import React from 'react'

export const userContext = React.createContext(null)

const UserProvider = ({ children, initialUser }) => {
  const [user, setUser] = React.useState(initialUser)

  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  )
}

export default UserProvider
