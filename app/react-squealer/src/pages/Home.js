import "../Home.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Home() {
  return (
    <div>
      <Navbar/>
      <h1 className="text-large cool-font">WELCOME ON SQUEALER</h1>
      <h2>RIP Twitter</h2>
      <Footer />
    </div>
  );
}

export default Home;
