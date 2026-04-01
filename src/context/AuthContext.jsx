import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    const userData = {
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    }
    setToken(authData.token)
    setUser(userData)
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const isUser    = () => user?.role === 'USER'
  const isManager = () => user?.role === 'HOTEL_MANAGER'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isUser, isManager, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
