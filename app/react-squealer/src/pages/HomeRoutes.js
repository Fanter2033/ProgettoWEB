import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";

import Channels from "./Channels";
import Account from "./Account";
import Post from "./Post";
import Chat from "./Chat";

import InfoChannel from "./InfoChannel";
import DetailsChannel from "./DetailsChannel";
import InfoUser from "./InfoUser";

function HomeRoutes() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/post" element={<Post />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/infoc" element={<InfoChannel />} />
        <Route path="/details" element={<DetailsChannel />} />
        <Route path="/infou" element={<InfoUser />} />
      </Routes>
    </>
  );
}

export default HomeRoutes;
