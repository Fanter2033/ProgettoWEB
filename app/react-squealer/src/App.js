import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginForm from "./pages/LoginForm";
import HomeRoutes from "./pages/HomeRoutes";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="home/*" element={<HomeRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
