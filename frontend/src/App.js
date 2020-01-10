import React, { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LoginForm from "./LoginForm"
import LoggedIn from "./LoggedIn"
import { useAuthStore } from "./AuthContext"
import "./App.css"
import Routes from "./Routes"

const App = () => {
  const [{ token }, dispatch] = useAuthStore()

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/refresh_token`, {
      method: "POST",
      credentials: "include",
    }).then(async x => {
      const { token } = await x.json()
      console.log(token)
      dispatch({
        type: "UPDATE_TOKEN",
        payload: {
          token,
        },
      })
    })
  }, [])

  return <Routes />
}

export default App
