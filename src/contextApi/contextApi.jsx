import { createContext, useContext, useState } from 'react'

const ContextApi = createContext()

export const ContextProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem('token') || null)

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      setTokenState(newToken)
    } else {
      localStorage.removeItem('token')
      setTokenState(null)
    }
  }

  const sendData = {
    token,
    setToken,
  }

  return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>
}

export const useStoreContext = () => {
  const context = useContext(ContextApi)
  return context
}