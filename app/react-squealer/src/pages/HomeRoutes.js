import { Routes, Route } from "react-router-dom";
//import { useLocation } from "react-router-dom";

import Channels from "./Channels";
import Navbar from "./Navbar";
import Account from "./Account";
import Post from "./Post";
import Chat from "./Chat";
import InfoChannel from "./InfoChannel";
import InfoUser from "./InfoUser";

function HomeRoutes() {
  //const location = useLocation();
  //const { username } = location.state;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/infoc" element={<InfoChannel />} />
        <Route path="/infou" element={<InfoUser />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
