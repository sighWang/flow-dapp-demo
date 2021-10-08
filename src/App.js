// File: ./src/App.js

import React from "react"
import {AuthCluster} from "./auth-cluster"
import {InitCluster} from "./init-cluster"
import {useCurrentUser} from "./hooks/current-user"

export default function App() {
  const cu = useCurrentUser()
  console.log(cu.loggedIn)
  return (
    <div>
      <AuthCluster />
      <InitCluster address={cu.addr} />
    </div>
  )
}