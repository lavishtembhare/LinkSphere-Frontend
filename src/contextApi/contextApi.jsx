import React, { createContext, useContext, useState, useEffect } from 'react'

const ContextApi = createContext()

export const ContextProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem('token') || null)
  const [refreshToken, setRefreshTokenState] = useState(() => localStorage.getItem('refreshToken') || null)

  const setAuthTokens = ({ token: newAccessToken, refreshToken: newRefreshToken }) => {
    if (newAccessToken) {
      localStorage.setItem('token', newAccessToken)
      setTokenState(newAccessToken)
    } else {
      localStorage.removeItem('token')
      setTokenState(null)
    }

    if (newRefreshToken !== undefined) {
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
        setRefreshTokenState(newRefreshToken)
      } else {
        localStorage.removeItem('refreshToken')
        setRefreshTokenState(null)
      }
    }
  }

  const setToken = (newToken) => {
    setAuthTokens({ token: newToken })
  }

  const clearAuth = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setTokenState(null)
    setRefreshTokenState(null)
  }

  const sendData = {
    token,
    refreshToken,
    setToken,
    setAuthTokens,
    clearAuth,
  }

  return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
}

export const useStoreContext = () => {
  const context = useContext(ContextApi)
  if (!context) {
    throw new Error('useStoreContext must be used within a ContextProvider')
  }
  return context
}

export default ContextApi