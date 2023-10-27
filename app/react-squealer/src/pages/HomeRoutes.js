import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Channels from "./Channels";
import About from "./About";
import Navbar from "./Navbar";
import Post from "./Post";

function HomeRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route element={<Navbar />} />
        <Route path="/account" element={<Account />} />
        <Route path="/channels/" element={<Channels />} />
        <Route path="/post" element={<Post />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
