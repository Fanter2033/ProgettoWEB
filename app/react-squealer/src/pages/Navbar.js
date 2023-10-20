import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";
import "../Home.css";

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
<button type="button" class="btn btn-secondary">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
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
          <li class="nav-item">
            <button type="button" className="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-link-45deg"
                viewBox="0 0 16 16"
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"></path>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"></path>
              </svg>
            </button>

            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/home/channels")}
            >
              Channels
            </NavLink>
          </li>
          <li>
            <button type="button" class="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chat-left-text-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"></path>
              </svg>
            </button>
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/home/post")}
            >
              Post
            </NavLink>
          </li>
          <li class="nav-item">
            <button type="button" class="btn icon-nav me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
              </svg>
            </button>
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand cool-font-small"
              to={ReactConfig.pathFunction("/home/account")}
            >
              Account
            </NavLink>
          </li>
        </ul>
      </nav>

      <nav class="d-sm-none navbar navbar-expand-sm nav-pc fixed-bottom p-3 ">
        {/*Barra di navigazione in basso per schermi sm*/}
        <ul class="navbar-nav d-flex flex-row justify-content-start">
          <li class="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/home/channels")}
            >
              <button type="button" className="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-link-45deg"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"></path>
                  <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"></path>
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
              to={ReactConfig.pathFunction("/home/post")}
            >
              <button type="button" class="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-chat-left-text-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"></path>
                </svg>
              </button>
            </NavLink>
          </li>

          <li class="nav-item">
            <NavLink
              style={({ isActive }) => {
                return isActive ? { color: "#072f38" } : {};
              }}
              className="navbar-brand"
              to={ReactConfig.pathFunction("/home/account")}
            >
              <button type="button" class="btn icon-nav me-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-person-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
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
