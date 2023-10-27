import React from "react";
/* non visibile negli schermi sm e + piccoli*/
function Footer() {
  return (
    <footer className="footer d-none d-md-block d-flex align-items-end">
      <div className="rainbow d-felx text-center">
        <p>&copy; 2023 Squealer. Per me vales.</p>
      </div>
    </footer>
  );
}

export default Footer;
