import React, { createContext, useContext, useReducer } from "react"

const AuthContext = createContext()

const initialState = {
  isAuthenticated: false,
  token: "",
  user: {},
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      const token = action.payload.token
      return {
        ...state,
        isAuthenticated: token !== "" ? true : false,
        token,
        user: action.payload.user,
      }
    case "LOGOUT":
      return initialState
    case "UPDATE_TOKEN":
      const newToken = action.payload.token
      return {
        ...state,
        isAuthenticated: newToken !== "" ? true : false,
        token: newToken,
      }
    default:
      return state
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthStore = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider")
  }
  return context
}

export { AuthContext, authReducer, AuthProvider, useAuthStore }
