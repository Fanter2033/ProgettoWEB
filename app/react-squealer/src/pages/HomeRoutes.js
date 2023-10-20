import { Routes, Route } from "react-router-dom";
import Account from "./Account";
import Channels from "./Channels";
import About from "./About";
import Navbar from "./Navbar";
import Post from "./Post";
import Register from "./Register";

function HomeRoutes() {
  const propToChild = null;
  return (
    <>
      <Navbar />
      <Routes>
        <Route element={<Navbar />} />
        <Route path="/registration" element={<Register propToChild={propToChild}/>} />
        <Route path="/account" element={<Account />} />
        <Route path="/channels/" element={<Channels />} />
        <Route path="/post" element={<Post />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
