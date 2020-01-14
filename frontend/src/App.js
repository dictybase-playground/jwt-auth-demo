import React, { useCallback, useEffect, useRef } from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import jwtDecode from "jwt-decode"
import { useAuthStore } from "./AuthContext"
import Routes from "./Routes"
import "./App.css"

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

const getTokenIntervalDelay = token => {
  if (token === "") {
    return
  }
  const decodedToken = jwtDecode(token)
  const currentTime = new Date(Date.now())
  const jwtTime = new Date(decodedToken.exp * 1000)
  const timeDiffInMins = (jwtTime - currentTime) / 60000
  // all this to say we want the delay to be two minutes before the JWT expires
  return (timeDiffInMins - 2) * 60 * 1000
}

const App = () => {
  const [{ token, isAuthenticated }, dispatch] = useAuthStore()
  const interval = useRef(null)
  const delay = getTokenIntervalDelay(token)

  const fetchRefreshToken = useCallback(async () => {
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
  }, [dispatch])

  useEffect(() => {
    fetchRefreshToken()
  }, [fetchRefreshToken])

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }
    interval.current = setInterval(() => {
      fetchRefreshToken()
    }, delay)
    return () => clearInterval(interval)
  }, [fetchRefreshToken, isAuthenticated, delay])

  return (
    <ApolloProvider client={clientCreator(token)}>
      <Routes />
    </ApolloProvider>
  )
}

export default App
