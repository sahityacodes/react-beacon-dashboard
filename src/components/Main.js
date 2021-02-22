import React, { Component } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Switch, Route, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard'
import BeaconList from './BeaconList'

class Main extends Component {
  render() {
    return (
      <div className="main-panel">
        <Navbar />
        <Switch>
          <Route path="/livedata" component={BeaconList} />
          <Route path="/dashboard" component={Dashboard} />
          <Redirect from='*' to='/livedata' />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default Main