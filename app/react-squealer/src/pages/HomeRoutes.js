import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

import Channels from "./Channels";
import Navbar from "./Navbar";
import Account from "./Account";
import Post from "./Post";
import Chat from "./Chat";

function HomeRoutes() {
  const location = useLocation();
  const { username } = location.state;

  return (
    <>
      <Navbar username={username} />
      <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
