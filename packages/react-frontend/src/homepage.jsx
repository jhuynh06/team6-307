import React, { useState } from "react";
import { Container, Title } from "@mantine/core";
import ProductCard from "./ProductCard";
import "./page.css";

// temp datga for nearby
const mockNearbyData = [
  {
    _id: "n1",
    name: "Campus Market",
    category: "Stores",
    inStock: true
  },
  {
    _id: "n2",
    name: "Subway",
    category: "Meals",
    inStock: true
  },
  {
    _id: "n3",
    name: "Starbucks",
    category: "Drinks",
    inStock: true
  }
];

//temporary data
const mockData = [
  {
    id: 1,
    restaurantName: "Restaurant name",
    time: "date/time",
    message: "message",
    hasImages: true
  },
  {
    id: 2,
    restaurantName: "Restaurant name",
    time: "date/time",
    message: "message",
    hasImages: true
  },
  {
    id: 3,
    restaurantName: "Restaurant name",
    time: "date/time",
    message: "message",
    hasImages: false
  },
  {
    id: 4,
    restaurantName: "Restaurant name",
    time: "date/time",
    message: "message",
    hasImages: true
  }
];

const API =
  "https://polyratemyfood-ezfxgaf9dcgpdkga.eastus-01.azurewebsites.net";

const Homepage = ({ token }) => {
  const username =
    token && token !== "INVALID_TOKEN"
      ? JSON.parse(atob(token.split(".")[1])).username
      : null;

  // ---- 3. COMPONENTS ----------------------------------
  const [activeTab, setActiveTab] = useState("You"); //Current tab
  const [feedData, setFeedData] = useState([]); //Following
  const [userData, setUserData] = useState({
    //You tab stats
    stats: { rated: 0, saved: 0, tried: 0 },
    posts: []
  });

  // subsection: friend tab
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myFriends] = useState([]);

  // ---- 4. DATA ------------------------------------
  useEffect(() => {
    //global feed
    fetch(`${API}/activity`)
      .then((res) => res.json())
      .then((data) => setFeedData(data))
      .catch((error) =>
        console.log("Error fetching activity:", error)
      );

    // user data
    if (username) {
      fetch(`${API}/activity/user/${username}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((error) =>
          console.log("Error fetching user data:", error)
        );
    }
  }, []);

  // ---- 5. HANDLERS -----------------------------------------
  //search function friends tab
  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    fetch(`${API}/users/search?q=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data);
        setIsSearching(false);
      })
      .catch((err) => {
        console.error(err);
        setIsSearching(false);
      });
  };

  // ---- 6. Visual render -------------------------------------------
  return (
    <Container size="xl" py="xl">
      <section className="section">
        <Title order={2} mb="md">
          What's Nearby
        </Title>
        <div className="nearby-grid">
          {mockNearbyData.map((place) => (
            <ProductCard key={place._id} product={place} />
          ))}
        </div>
      </section>

      <section
        className="section"
        style={{ marginTop: "60px" }}>
        <Title order={2} mb="md">
          Recent Activity
        </Title>

        {/*tabs*/}
        <div className="tabs">
          <span
            className={activeTab === "You" ? "active-tab" : ""}
            onClick={() => setActiveTab("You")}
            style={{ cursor: "pointer" }}>
            You
          </span>
          <span
            className={
              activeTab === "Friends" ? "active-tab" : ""
            }
            onClick={() => setActiveTab("Friends")}
            style={{ cursor: "pointer" }}>
            Friends
          </span>
          <span
            className={
              activeTab === "Following" ? "active-tab" : ""
            }
            onClick={() => setActiveTab("Following")}
            style={{ cursor: "pointer" }}>
            Following
          </span>
        </div>

        {/*PLACEHOLDER DATA*/}
        {activeTab === "You" && (
          <div>
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

            <div className="activity-item">
              <div className="user-info">
                <div className="pic-placeholder">pic</div>
                <div className="post-meta">
                  <div className="meta-top">
                    <span className="username">You</span>
                    <span className="timestamp">date/time</span>
                  </div>
                  <p className="comment">
                    This place was okay. Food was okay.
                  </p>
                </div>
                <div className="stars">
                  ★★★★★{" "}
                  <span className="action-icons">📝 🗑️</span>
                </div>
              </div>
              <div className="post-images">
                <div className="gray-box small-box"></div>
                <div className="gray-box small-box"></div>
              </div>
            </div>
          </div>
        )}

        {/* MOCK DATA PLACEHOLDER*/}
        {activeTab === "Following" && (
          <div className="scrollable-feed">
            {/*Speicifcally this map*/}
            {mockData.map((post) => (
              <div className="activity-item" key={post.id}>
                <div className="user-info">
                  <div className="pic-placeholder">pic</div>
                  <div className="post-meta">
                    <div className="meta-top following-header">
                      <span className="following-name">
                        {post.restaurantName}
                      </span>
                      <span className="following-time">
                        {post.time}
                      </span>
                    </div>
                    <p className="comment following-comment">
                      {post.message}
                    </p>
                  </div>
                </div>
                {post.hasImages && (
                  <div className="post-images following-images">
                    <div className="gray-box following-box"></div>
                    <div className="gray-box following-box"></div>
                  </div>
                )}
              </div>
            ))}

            <div className="end-of-feed-banner">
              (no new posts)
            </div>
          </div>
        )}

        {/*PLACEHOLDER FOR FRIENDS CONTENT*/}
        {activeTab === "Friends" && (
          <div style={{ marginTop: "20px", color: "#666" }}>
            Friends activity will appear here.
          </div>
        )}
      </section>
    </Container>
  );
};

export default Homepage;
