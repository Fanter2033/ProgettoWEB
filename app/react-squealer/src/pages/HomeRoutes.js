import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Channels from "./Channels";
import About from "./About";
import Navbar from "./Navbar";


function HomeRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Navbar/>} />    
        <Route path="/account" element={<Account />} />
        <Route path="/channels/" element={<Channels />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
