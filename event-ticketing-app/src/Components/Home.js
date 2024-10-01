import React from "react";
import "./Home.css";
import Navbar from "./Navbar";

const Home = () => {
  const handleMenuToggle = () => {
    const header = document.querySelector("header");
    header.classList.toggle("showMenu");
  };

  return (
    <main>
      {/* Header Start */}
      <header>
        <Navbar />
        <img
          src="images/bars.svg"
          alt="Open Menu"
          id="menu_toggle"
          onClick={handleMenuToggle}
        />
      </header>
      {/* Header End */}

      {/* Hero Start */}
      <section className="hero">
        <div className="row container">
          <div className="column">
            <h2>
              Welcome To Event Ticketing
              <br />
            </h2>
          </div>
        </div>
        <img src="images/bg-bottom-hero.png" alt="" className="curveImg" />
      </section>
      {/* Hero End */}
    </main>
  );
};

export default Home;
