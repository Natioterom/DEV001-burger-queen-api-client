import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth () {
  return useContext(AuthContext)
}

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(null)

  const login = (mockUser) => {
    // Puedes pasar el usuario mock directamente
    setUser(mockUser)
  }

  const logOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}
