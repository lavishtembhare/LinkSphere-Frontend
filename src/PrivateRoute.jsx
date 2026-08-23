import React from 'react'
import { Navigate } from 'react-router-dom'
import { useStoreContext } from './contextApi/ContextApi'

const PrivateRoute = ({ children, publicPage = false }) => {
  const { token } = useStoreContext()

  if (publicPage) {
    return token ? <Navigate to="/dashboard" replace /> : children
  }

  return !token ? <Navigate to="/login" replace /> : children
}

export default PrivateRoute