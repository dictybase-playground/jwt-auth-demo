import React from "react"
import { Link, useHistory } from "react-router-dom"
// import jwtDecode from "jwt-decode"
import { useAuthStore } from "./AuthContext"
import "./App.css"

// const verifyToken = token => {
//   const decodedToken = jwtDecode(token)
//   const currentTime = Date.now().valueOf() / 1000
//   return currentTime < decodedToken.exp ? true : false
// }

const LoggedIn = () => {
  const [{ isAuthenticated }, dispatch] = useAuthStore()
  const history = useHistory()

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_SERVER}/logout`, {
        method: "POST",
        credentials: "include",
      })
      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error(error)
    }
    history.push("/")
  }

  if (!isAuthenticated) {
    return (
      <header className="App-header">
        <div>Must be logged in to view this page</div>
        <Link to="/" style={{ color: "#fff", marginTop: "10px" }}>
          Back
        </Link>
      </header>
    )
  }

  return (
    <header className="App-header">
      <p> successfully logged in!</p>
      <button onClick={handleLogout}>Logout</button>
    </header>
  )
}

export default LoggedIn
