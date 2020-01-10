import React, { useEffect } from "react"
import { ApolloProvider } from "@apollo/react-hooks"
import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
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
  }, [dispatch])

  return (
    <ApolloProvider client={clientCreator(token)}>
      <Routes />
    </ApolloProvider>
  )
}

export default App
