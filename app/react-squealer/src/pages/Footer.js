import React from "react";
import "../css/Home.css"
/* non visibile negli schermi sm e + piccoli*/
function Footer() {
  return (
    <footer className="footer d-none d-md-block fixed-bottom">
      <div className="rainbow d-flex align-items-center justify-content-center">
        <p>&copy; 2023 Squealer. Per me vales.</p>
      </div>
    </footer>
  );
}

export default Footer;
