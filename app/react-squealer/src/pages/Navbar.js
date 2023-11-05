import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import "../css/Home.css";
import squeal_logo from "./media/icone/Nav_logo.png";

//TODO:navbar sm felx elementi

/*
per aggiungere altro elemento alla navbar
<li className="nav-item">
  <Link className="nav-link" to="#"></Link>
</li>
*/

//se non voglio propagare lo stile di NavLink ai figli
//usa 'end' all'interno della componente

/*
block: visibile, interattivo, influenza layout
none: opposto
*/

/*
<button type="button" className="btn btn-secondary">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-angle-fill" viewBox="0 0 16 16">
  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"></path>
  </svg>
</button>
*/

function Navbar() {
  return (
    <>
      {/*Barra di navigazione in basso per schermi lg*/}
      <nav className="d-none d-sm-block navbar-expand-md nav-pc p-3">
        <ul className="navbar-nav d-flex justify-content-evenly">
          <li className="navbar-brand">
            <img src={squeal_logo} alt="logo_squeal" width="30" height="30" />
          </li>
          <li>
            <button type="button" className="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                alt="Write Squeal"
                fill="currentColor"
                className="bi bi-plus-square"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </button>
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/post")}
            >
              Post
            </NavLink>
          </li>
          <li className="nav-item">
            <button type="button" className="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                alt="Home"
                fill="currentColor"
                className="bi bi-house"
                viewBox="0 0 16 16"
              >
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
              </svg>
            </button>

            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/channels")}
            >
              Channels
            </NavLink>
          </li>

          <li className="nav-item">
            <button type="button" className="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                alt="Profile"
                fill="currentColor"
                className="bi bi-person-circle"
                viewBox="0 0 16 16"
              >
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                />
              </svg>
            </button>
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/account")}
            >
              Account
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav className="d-sm-none navbar navbar-expand-sm nav-pc fixed-bottom p-3 ">
        {/*Barra di navigazione in basso per schermi sm*/}
        <ul className="navbar-nav d-flex flex-row justify-content-evenly w-100">
          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/post")}
            >
              <button type="button" className="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  alt="Write Squeal"
                  fill="currentColor"
                  className="bi bi-plus-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </button>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/channels")}
            >
              <button type="button" className="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  alt="Home"
                  fill="currentColor"
                  className="bi bi-house"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
              </button>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/account")}
            >
              <button type="button" className="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  alt="Profile"
                  fill="currentColor"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path
                    fillRule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                  />
                </svg>
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/chat")}
            >
              <button type="button" className="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  alt="Chat"
                  fill="currentColor"
                  className="bi bi-chat-right-text"
                  viewBox="0 0 16 16"
                >
                  <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />
                </svg>
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
