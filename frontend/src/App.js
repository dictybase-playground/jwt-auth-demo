import React, { useEffect } from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
// import jwtDecode from "jwt-decode"
import { useAuthStore } from "./AuthContext"
import "./App.css"
import Routes from "./Routes"

const clientCreator = token => {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(
      createHttpLink({
        uri: `${process.env.REACT_APP_API_SERVER}/graphql`,
        credentials: "include",
      }),
    ),
    cache: new InMemoryCache({}),
  })
}

// const verifyToken = token => {
//   const decodedToken = jwtDecode(token)
//   const currentTime = Date.now().valueOf() / 1000
//   return currentTime < decodedToken.exp ? true : false
// }

const App = () => {
  const [{ token }, dispatch] = useAuthStore()

  useEffect(() => {
    const fetchRefreshToken = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_SERVER}/refresh_token`,
          {
            method: "POST",
            credentials: "include",
          },
        )
        const json = await res.json()
        dispatch({
          type: "UPDATE_TOKEN",
          payload: {
            token: json.token,
          },
        })
      } catch (error) {
        console.error(error)
      }
    }

    token === ""
      ? fetchRefreshToken()
      : setInterval(() => {
          fetchRefreshToken()
        }, 5000)
  }, [dispatch, token])

  return (
    <ApolloProvider client={clientCreator(token)}>
      <Routes />
    </ApolloProvider>
  )
}

export default App
