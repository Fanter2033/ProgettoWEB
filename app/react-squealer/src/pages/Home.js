import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Home.css";

function Home() {
  return (
    <div className="row" id="elemento-espanso"> 
      <Navbar/>      
      <h1 className="text-large cool-font">WELCOME ON SQUEALER</h1>
      <h2 className="cool-font-small">RIP Twitter</h2>
      <h2 className="cool-font-medium mb-5">Welcome &#129413;</h2>
      <Footer />
    </div>
  );
}

export default Home;
