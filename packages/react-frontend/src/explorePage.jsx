import React from "react";
import "./page.css";

const CarouselSection = ({ title, centerLabel }) => {
  return (
    <section className="section explore-section">
      <h3>{title}</h3>
      <div className="carousel-wrapper">
        {/* Left Arrow */}
        <div className="carousel-arrow">◀</div>
        
        {/* Grid for 3 items*/}
        <div className="carousel-grid">
          {/* Item 1 */}
          <div className="carousel-item">
            <div className="gray-box"></div>
          </div>

          {/* Item 2  */}
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
      <main className="content">
        <CarouselSection title="Most Popular" centerLabel="Food Name 1" />
        <CarouselSection title="Highly Rated" centerLabel="Food Name 2" />
        <CarouselSection title="Randomize" centerLabel="Food Name 3" />
      </main>
    </div>
  );
};

export default Explore;