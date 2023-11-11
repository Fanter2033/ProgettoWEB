import React from "react";
import { Routes, Route } from "react-router-dom";
import ReactConfig from "./config/ReactConfig";

import { UserProvider } from "./config/UserContext";

import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import Home from "./pages/Home";
import About from "./pages/About";
import HomeRoutes from "./pages/HomeRoutes";
import NotFound from "./pages/NotFound";
//Routes without <Navbar/>
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path={ReactConfig.pathFunction("/")} element={<LoginForm />} />

          <Route
            path={ReactConfig.pathFunction("/registration")}
            element={<Register />}
          />

          <Route
            path={ReactConfig.pathFunction("/channels")}
            element={<Channels />}
          />

          <Route path={ReactConfig.pathFunction("/home")} element={<Home />} />
          <Route
            path={ReactConfig.pathFunction("/about")}
            element={<About />}
          />
          <Route
            path={ReactConfig.pathFunction("/*")}
            element={<HomeRoutes />}
          />
          <Route path={ReactConfig.pathFunction("*")} element={<NotFound />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
