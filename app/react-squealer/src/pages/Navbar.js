import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import "../css/Home.css";
import squeal_logo from "./media/icone/Nav_logo.png";

/*
per aggiungere altro elemento alla navbar
<li className="nav-item">
  <Link className="nav-link" to="#"></Link>
</li>
*/

/*
se non voglio propagare lo stile di NavLink ai figli
usa 'end' all'interno della componente
*/

/*
block: visibile, interattivo, influenza layout
none: opposto
*/

function Navbar() {
  return (
    <>
      {/*SCHERMI LARGE-----------------------------------------------------------------------------*/}
      <nav className="d-none d-md-block navbar-expand-md nav-pc p-3 ">
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <li className="navbar-brand list-unstyled">
                <img
                  src={squeal_logo}
                  alt="logo_squeal"
                  width="60"
                  height="60"
                />
              </li>
            </div>

            <div className="col-10">
              <ul className="navbar-nav d-flex justify-content-evenly list-unstyled">
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive ? { color: "#072f38" } : {};
                    }}
                    className="navbar-brand cool-font-nav text-sm"
                    to={ReactConfig.pathFunction("/post")}
                  >
                    <button
                      type="button"
                      className="btn icon-nav me-1 p-0 mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="none"
                        className="bi bi-box-arrow-up"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z "
                          fill="#e0bb76"
                        />
                        <path
                          fillRule="evenodd"
                          d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"
                          fill="#e0bb76"
                        />
                      </svg>
                    </button>
                    Post
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive ? { color: "#072f38" } : {};
                    }}
                    className="navbar-brand cool-font-nav"
                    to={ReactConfig.pathFunction("/received")}
                  >
                    <button
                      type="button"
                      className="btn icon-nav me-1 p-0 mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        className="bi bi-box-arrow-in-down"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          fill="#e0bb76"
                          d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                        />
                        <path
                          fillRule="evenodd"
                          fill="#e0bb76"
                          d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                        />
                      </svg>
                    </button>
                    Squeals
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive ? { color: "#072f38" } : {};
                    }}
                    className="navbar-brand cool-font-nav"
                    to={ReactConfig.pathFunction("/channels")}
                  >
                    <button
                      type="button"
                      className="btn icon-nav me-1 p-0 mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        alt="Home"
                        className="bi bi-house"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="#e0bb76"
                          d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                        />
                      </svg>
                    </button>
                    Canali
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { color: "#072f38", fill: "#072f38" }
                        : {};
                    }}
                    className="navbar-brand cool-font-nav"
                    to={ReactConfig.pathFunction("/account")}
                  >
                    <button
                      type="button"
                      className="btn icon-nav me-1 p-0 mb-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        alt="Profile"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="#e0bb76"
                          d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                        />
                        <path
                          fillRule="evenodd"
                          fill="#e0bb76"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </button>
                    Account
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/*SCHERMI MEDI-----------------------------------------------------------------------------*/}
      <nav className="d-md-block d-none d-sm-block d-md-none navbar-expand-md nav-pc p-3 fixed">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <ul className="navbar-nav d-flex flex-row justify-content-evenly list-unstyled ">
                <li className="navbar-item list-unstyled">
                  <img
                    src={squeal_logo}
                    alt="logo_squeal"
                    width="110"
                    height="110"
                  />
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                        : {};
                    }}
                    to={ReactConfig.pathFunction("/post")}
                  >
                    <button type="button" className="btn icon-nav">
                      <div className="pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          className="bi bi-box-arrow-up"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            fill="#e0bb76"
                            d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                          />
                          <path
                            fillRule="evenodd"
                            fill="#e0bb76"
                            d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"
                          />
                        </svg>
                      </div>
                    </button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                        : {};
                    }}
                    className="navbar-brand cool-font-nav"
                    to={ReactConfig.pathFunction("/received")}
                  >
                    <button type="button" className="btn icon-nav">
                      <div className="pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          className="bi bi-box-arrow-in-down"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            fill="#e0bb76"
                            d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                          />
                          <path
                            fillRule="evenodd"
                            fill="#e0bb76"
                            d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                          />
                        </svg>
                      </div>
                    </button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                        : {};
                    }}
                    to={ReactConfig.pathFunction("/channels")}
                  >
                    <button type="button" className="btn icon-nav ">
                      <div className="pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          alt="Home"
                          className="bi bi-house"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#e0bb76"
                            d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                        : {};
                    }}
                    className="navbar-brand"
                    to={ReactConfig.pathFunction("/chat")}
                  >
                    <button type="button" className="btn icon-nav ">
                      <div className="pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="28"
                          height="28"
                          alt="Chat"
                          className="bi bi-chat-right-text"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#e0bb76"
                            d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"
                          />
                          <path
                            fill="#e0bb76"
                            d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
                          />
                        </svg>
                      </div>
                    </button>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    style={({ isActive }) => {
                      return isActive
                        ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                        : {};
                    }}
                    to={ReactConfig.pathFunction("/account")}
                  >
                    <button type="button" className="btn icon-nav ">
                      <div className="pb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          alt="Profile"
                          className="bi bi-person-circle"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="#e0bb76"
                            d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                          />
                          <path
                            fillRule="evenodd"
                            fill="#e0bb76"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                          />
                        </svg>
                      </div>
                    </button>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/*SCHERMI SMALL-----------------------------------------------------------------------------*/}
      <nav className="fixed-bottom d-sm-none navbar navbar-expand-sm nav-pc">
        <ul className="navbar-nav d-flex flex-row justify-content-evenly align-items-center">
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                  : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/post")}
            >
              <button className="btn icon-nav">
                <div className="pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className="bi bi-box-arrow-up"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      fill="#e0bb76"
                      d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                    />
                    <path
                      fillRule="evenodd"
                      fill="#e0bb76"
                      d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708l3-3z"
                    />
                  </svg>
                </div>
              </button>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                  : {};
              }}
              className="navbar-brand cool-font-nav"
              to={ReactConfig.pathFunction("/received")}
            >
              <button className="btn icon-nav">
                <div className="pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    className="bi bi-box-arrow-in-down"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      fill="#e0bb76"
                      d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1h-2z"
                    />
                    <path
                      fillRule="evenodd"
                      fill="#e0bb76"
                      d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                    />
                  </svg>
                </div>
              </button>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                  : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/channels")}
            >
              <button type="button" className="btn icon-nav ">
                <div className="pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    alt="Home"
                    className="bi bi-house"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#e0bb76"
                      d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"
                    />
                  </svg>
                </div>
              </button>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                  : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/chat")}
            >
              <button type="button" className="btn icon-nav">
                <div className="pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    alt="Chat"
                    className="bi bi-chat-right-text"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#e0bb76"
                      d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"
                    />
                    <path
                      fill="#e0bb76"
                      d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </div>
              </button>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive
                  ? { backgroundColor: "#072f38", borderRadius: "0.5rem" }
                  : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/account")}
            >
              <button type="button" className="btn icon-nav">
                <div className="pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    alt="Profile"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="#e0bb76"
                      d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                    <path
                      fillRule="evenodd"
                      fill="#e0bb76"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                    />
                  </svg>
                </div>
              </button>
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
