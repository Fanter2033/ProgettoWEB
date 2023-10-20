import React from "react";
import {Routes, Route} from "react-router-dom";
import ReactConfig from "./config/ReactConfig";

import LoginForm from "./pages/LoginForm";
import HomeRoutes from "./pages/HomeRoutes";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path={ReactConfig.pathFunction('/')} element={<LoginForm />} />
        <Route path={ReactConfig.pathFunction('/home')} element={<Home />} />
        <Route path={ReactConfig.pathFunction('/home/*')} element={<HomeRoutes />} />
        <Route path={ReactConfig.pathFunction('*')} element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
