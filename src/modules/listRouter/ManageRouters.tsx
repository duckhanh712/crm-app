import React from 'react'
import { Route, Switch, Redirect } from 'react-router'
import Manage from './../manage/Manage';

export const ManageRouters = () => {
  return (
    <Switch>
      <Route exact path="/manage/list-user" component={Manage} />
      <Redirect to="/404.html" /> 
    </Switch>
  )
}
