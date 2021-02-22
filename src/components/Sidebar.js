import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div className="logo">
            <Link to='/' className="simple-text">
              Beacon Dashboard
            </Link>
          </div>
          
          <ul className="nav">
          <li className="nav-item">
              <NavLink className="nav-link" to='/livedata'>
                <p>Live Data</p>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/dashboard'>
                <p>Dashboard</p>
              </NavLink>
            </li>


          </ul>
        </div>
      </div>
    )
  }
}

export default Sidebar