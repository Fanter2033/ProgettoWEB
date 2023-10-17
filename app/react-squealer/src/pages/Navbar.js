import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

/*
pe aggiungere altro elemento alla navbar
<li className="nav-item">
  <Link className="nav-link" to="#"></Link>
</li>
*/

//se non voglio propagare lo stile di NavLink ai figli
//usa 'end' all'interno della componente

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
        <NavLink
          style={({ isActive }) => {
            return isActive ? { color: "red" } : {};
          }}
          className="navbar-brand"
          to={ReactConfig.pathFunction('/home/account')}
        >
          Account
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ">
              <NavLink
                style={({ isActive }) => {
                  return isActive ? { color: "red" } : {};
                }}
                className="navbar-brand"
                to={ReactConfig.pathFunction('/home/channels')}
              >
                Channels
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                style={({ isActive }) => {
                  return isActive ? { color: "red" } : {};
                }}
                className="navbar-brand"
                to={ReactConfig.pathFunction('/home/about')}
              >
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
