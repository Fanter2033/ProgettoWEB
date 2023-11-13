import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Account from "./Account";
import Channels from "./Channels";
import Navbar from "./Navbar";
import Post from "./Post";

function HomeRoutes() {
  const location = useLocation();
const {username} = location.state;

  return (
    <>
    <Navbar username={username}/>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
