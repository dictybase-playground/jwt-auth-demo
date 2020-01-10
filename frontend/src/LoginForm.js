import React from "react"
import { Link, useHistory } from "react-router-dom"
import { useMutation } from "@apollo/react-hooks"
import gql from "graphql-tag"
import { useAuthStore } from "./AuthContext"
import "./App.css"

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
      }
      token
    }
  }
`

const LoginForm = () => {
  const [userData, setUserData] = React.useState({ username: "", password: "" })
  const history = useHistory()
  const [{ isAuthenticated, token, user }, dispatch] = useAuthStore()
  const [login] = useMutation(LOGIN)

  const handleSubmit = async event => {
    event.preventDefault()
    try {
      const { username, password } = userData
      const url = `${process.env.REACT_APP_API_SERVER}/login`
      const res = await login({
        variables: {
          username: userData.username,
          password: userData.password,
        },
      })
      if (res && res.data) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { token: res.data.login.token, user: res.data.login.user },
        })
        history.push("/loggedin")
      }
    } catch (error) {
      console.error("error with network ", error)
    }
  }

  if (isAuthenticated) {
    return (
      <header className="App-header">
        <div>You are already logged in!</div>
        <div>
          <Link to="/loggedin" style={{ color: "#fff", marginTop: "20px" }}>
            View protected page
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="App-header">
      <h4>Login Form</h4>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={userData.username}
          onChange={event =>
            setUserData({ ...userData, username: event.target.value })
          }
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          type="text"
          id="password"
          name="password"
          value={userData.password}
          onChange={event =>
            setUserData({ ...userData, password: event.target.value })
          }
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <br />
      <div style={{ fontSize: "0.8rem" }}>
        Hint: username is <em>art</em>, pass is <em>vandelay</em>
      </div>
      <div>
        <Link to="/loggedin" style={{ color: "#fff" }}>
          Logged in page
        </Link>
      </div>
    </header>
  )
}

export default LoginForm
