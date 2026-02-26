import React from "react";
import "./page.css";

const Homepage = () => {
  return (
    <div className="container">
      <main className="content">
        {/* What's Nearby */}
        <section className="section">
          <h3>What's Nearby</h3>
          <div className="nearby-grid">
            <div className="gray-box aspect-ratio"></div>
            <div className="gray-box aspect-ratio"></div>
            <div className="gray-box aspect-ratio"></div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="section">
          <h3>Recent Activity</h3>
          <div className="tabs">
            <span className="active-tab">You</span>
            <span>Friends</span>
            <span>Following</span>
          </div>

          {/* Statistics Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Places rated</span>
            </div>
            <div className="stat-item border-sides">
              <span className="stat-number">2</span>
              <span className="stat-label">Places saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Places tried</span>
            </div>
          </div>

          {/* Activity Feed Item */}
          <div className="activity-item">
            <div className="user-info">
              <div className="pic-placeholder">pic</div>
              <div className="post-meta">
                <div className="meta-top">
                  <span className="username">You</span>
                  <span className="timestamp">date/time</span>
                </div>
                <p className="comment">This place was okay. Food was okay.</p>
              </div>
              <div className="stars">
                ★★★★★ <span className="action-icons">📝 🗑️</span>
              </div>
            </div>
            <div className="post-images">
              <div className="gray-box small-box"></div>
              <div className="gray-box small-box"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;