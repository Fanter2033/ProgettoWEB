import React from "react";
import { Routes, Route } from "react-router-dom";
import ReactConfig from "./config/ReactConfig";

import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import Channels from "./pages/Channels";
import HomeRoutes from "./pages/HomeRoutes";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
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
        <Route path={ReactConfig.pathFunction("/*")} element={<HomeRoutes />} />

        <Route path={ReactConfig.pathFunction("*")} element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
