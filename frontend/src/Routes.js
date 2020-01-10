import React, { useEffect } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import LoginForm from "./LoginForm"
import LoggedIn from "./LoggedIn"
import "./App.css"

const Routes = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/loggedin">
            <LoggedIn />
          </Route>
          <Route path="/">
            <LoginForm />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default Routes
