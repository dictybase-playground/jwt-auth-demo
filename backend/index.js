const express = require("express")
const { ApolloServer, gql } = require("apollo-server-express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")
const jwt = require("jsonwebtoken")
const uuidv4 = require("uuid/v4")

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }
  type AuthUser {
    id: ID!
    username: String!
    token: String!
  }
  type Query {
    user: User
  }
  type Mutation {
    login: AuthUser
  }
`

const resolvers = {
  Query: {
    user: () => ({
      id: 1,
      username: "art",
    }),
  },
  Mutation: {
    login: () => {
      // would add user verification here
      const token = jwt.sign({ username: req.body.username }, "topSecret", {
        expiresIn: "15m",
      })
      res.cookie("refreshToken", refreshToken, {
        maxAge: 60 * 24 * 30 * 60 * 1000, // convert 30 days from minute to milliseconds
        httpOnly: true,
        secure: false,
      })

      return {
        id: 1,
        username: "art",
        token,
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
})

const app = express()
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(morgan("tiny"))

const refreshTokens = []

// app.post("/login", (req, res) => {
//   if (req.body.username !== "art" && req.body.username !== "vandelay") {
//     return res.send({
//       token: "",
//     })
//   }
//   const token = jwt.sign({ username: req.body.username }, "topSecret", {
//     expiresIn: "15m",
//   })
//   const refreshToken = uuidv4()
//   refreshTokens.push(refreshToken)
//   res.cookie("refreshToken", refreshToken, {
//     maxAge: 60 * 24 * 30 * 60 * 1000, // convert 30 days from minute to milliseconds
//     httpOnly: true,
//     secure: false,
//   })
//   return res.send({
//     token,
//     user: {
//       firstName: "Art",
//       lastName: "Vandelay",
//     },
//   })
// })

app.post("/refresh_token", (req, res) => {
  const refToken = req.cookies.refreshToken
  if (!refToken) {
    return res.send({
      token: "",
    })
  }
  const refreshTokenVerified = refreshTokens.includes(refToken)
  if (!refreshTokenVerified) {
    return res.send({
      token: "",
    })
  }
  const token = jwt.sign({ username: req.body.username }, "topSecret", {
    expiresIn: "15m",
  })
  const refreshToken = uuidv4()
  refreshTokens.push(refreshToken)
  res.cookie("refreshToken", refreshToken, {
    maxAge: 60 * 24 * 30 * 60 * 1000, // convert 30 days from minute to milliseconds
    httpOnly: true,
    secure: false,
  })
  return res.send({
    token,
  })
})

app.post("/logout", (req, res) => {
  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  return res.send("OK")
})

server.applyMiddleware({ app })

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server listening on port ${port}!`))
