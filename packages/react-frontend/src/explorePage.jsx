import React from "react";
import "./page.css";
import { Link } from "react-router-dom";

const CarouselSection = ({ title, centerLabel }) => {
  return (
    <section className="section explore-section">
      <h3>{title}</h3>
      <div className="carousel-wrapper">
        {/* Left Arrow */}
        <div className="carousel-arrow">◀</div>
        
        {/* Grid for the 3 items */}
        <div className="carousel-grid">
          {/* Item 1 */}
          <div className="carousel-item">
            <div className="gray-box"></div>
          </div>

          {/* Item 2 (Center with text) */}
          <div className="carousel-item">
            <div className="gray-box center-content">
              <span>Photo of Food</span>
            </div>
            <span className="food-label">{centerLabel}</span>
          </div>

          {/* Item 3 */}
          <div className="carousel-item">
            <div className="gray-box"></div>
          </div>
        </div>

        {/* Right Arrow */}
        <div className="carousel-arrow">▶</div>
      </div>
    </section>
  );
};

const Explore = () => {
  return (
    <div className="container">
      {/* Header Section */}
      <header className="main-header">
        <div className="logo-section">
          <div className="circle-placeholder"></div>
          <div className="logo-text">
            <h1>POLY RATE</h1>
            <h2>MY FOOD</h2>
          </div>
        </div>
        
        <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/explore" style={{ fontWeight: "bold" }}>Explore</Link>
            <Link to="/stores">Stores</Link>
        </nav>

        <div className="profile-section">
          <div className="circle-placeholder"></div>
          <span>Profile</span>
        </div>
      </header>

      {/* Sub-navigation bar */}
      <div className="sub-nav">
        <span>&lt;</span>
        <span className="photos-label">On-Campus Dining</span>
        <span>&gt;</span>
      </div>

      {/* Main Content Area */}
      <main className="content">
        <CarouselSection title="Most Popular" centerLabel="Food Name 1" />
        <CarouselSection title="Highly Rated" centerLabel="Food Name 2" />
        <CarouselSection title="Randomize" centerLabel="Food Name 3" />
      </main>
    </div>
  );
};

export default Explore;