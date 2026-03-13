// HOMEPAGE CONTENTS
// Sections:
//   1. Imports
//   2. Components
//   4. Data Fetching (useEffect)
//   5. Handlers
//   6. Render

// -------1. IMPORTS -------------------------------------
import React, { useState, useEffect } from "react";
import {
  Container,
  Title,
  Paper,
  Group,
  Text,
  Avatar,
  Stack
} from "@mantine/core";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "./page.css";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { TextInput, ActionIcon, Loader } from "@mantine/core";
import { API_PREFIX } from "./config";

const API = API_PREFIX;

const Homepage = ({ token }) => {
  const username =
    token && token !== "INVALID_TOKEN"
      ? JSON.parse(atob(token.split(".")[1])).username
      : null;

  // ---- 3. COMPONENTS ----------------------------------
  const [activeTab, setActiveTab] = useState("You"); //Current tab
  const [nearbyData, setNearbyData] = useState([]); //What's Nearby
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
    //nearby stores
    fetch(`${API}/stores`)
      .then((res) => res.json())
      .then((data) => setNearbyData(data))
      .catch((error) => console.log("Error fetching stores:", error));

    //global feed
    if (token && token !== "INVALID_TOKEN") {
      fetch(`${API}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setFeedData(data))
        .catch((error) => console.log("Error fetching activity:", error));
    }

    // user data
    if (username) {
      fetch(`${API}/activity/user/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((error) => console.log("Error fetching user data:", error));
    }
  }, [username]);

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
      {/* Nearby stuff */}
      <section className="section">
        <Title order={2} mb="md">
          What's Nearby
        </Title>
        <div className="nearby-grid">
          {nearbyData.slice(0, 3).map((place) => (
            <Link
              key={place._id}
              to={`/stores/${place._id}`}
              style={{ textDecoration: "none" }}>
              <ProductCard product={place} />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="section" style={{ marginTop: "60px" }}>
        <Title order={2} mb="md">
          Recent Activity
        </Title>

        {/* tabs */}
        <div className="tabs">
          <span
            className={activeTab === "You" ? "active-tab" : ""}
            onClick={() => setActiveTab("You")}
            style={{ cursor: "pointer" }}>
            You
          </span>
          <span
            className={activeTab === "Friends" ? "active-tab" : ""}
            onClick={() => setActiveTab("Friends")}
            style={{ cursor: "pointer" }}>
            Friends
          </span>
          <span
            className={activeTab === "Following" ? "active-tab" : ""}
            onClick={() => setActiveTab("Following")}
            style={{ cursor: "pointer" }}>
            Following
          </span>
        </div>

        {/* You tab */}
        {activeTab === "You" && (
          <div>
            {/* subsection: stats bar */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-number">{userData.stats.rated}</span>
                <span className="stat-label">Places rated</span>
              </div>
              <div className="stat-item border-sides">
                <span className="stat-number">{userData.stats.saved}</span>
                <span className="stat-label">Places saved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{userData.stats.tried}</span>
                <span className="stat-label">Places tried</span>
              </div>
            </div>

            {/* User feed */}
            <div className="scrollable-feed">
              {userData.posts.map((post) => (
                <div className="activity-item" key={post._id}>
                  <div className="user-info">
                    <div className="pic-placeholder">pic</div>
                    <div className="post-meta">
                      <div className="meta-top">
                        <span className="username">{post.username}</span>
                        <span className="timestamp">{post.time}</span>
                      </div>
                      <p className="comment">{post.message}</p>
                    </div>
                    <div className="stars">
                      {Array(post.rating).fill("★").join("")}
                      <span className="action-icons">📝 🗑️</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Following Tab */}
        {activeTab === "Following" && (
          <div className="scrollable-feed">
            {feedData.map((post) => (
              <div className="activity-item" key={post._id}>
                <div className="user-info">
                  <div className="pic-placeholder">pic</div>
                  <div className="post-meta">
                    <div className="meta-top following-header">
                      <span className="following-name">
                        {post.restaurantName}
                      </span>
                      <span className="following-time">{post.time}</span>
                    </div>
                    <p className="comment following-comment">{post.message}</p>
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
            <div className="end-of-feed-banner">(no new posts)</div>
          </div>
        )}

        {/* Friends tab */}
        {activeTab === "Friends" && (
          <Stack spacing="md" mt="md">
            {/* Search input */}
            <TextInput
              placeholder="Search for friends by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              rightSection={
                isSearching ? (
                  <Loader size="xs" />
                ) : (
                  <ActionIcon
                    onClick={handleSearch}
                    variant="filled"
                    color="blue">
                    <IconSearch size="1.1rem" />
                  </ActionIcon>
                )
              }
            />

            {/* Search results */}
            {searchResults.length > 0 && (
              <Paper withBorder p="md" radius="md">
                <Text size="xs" fw={700} c="dimmed" mb="xs">
                  SEARCH RESULTS
                </Text>
                <Stack spacing="xs">
                  {searchResults.map((user) => (
                    <Group justify="space-between" key={user.username}>
                      <Group>
                        <Avatar radius="xl" color="cyan">
                          {user.username[0].toUpperCase()}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>
                            {user.fullName}
                          </Text>
                          <Text size="xs" c="dimmed">
                            @{user.username} • {user.major}
                          </Text>
                        </div>
                      </Group>
                      <ActionIcon variant="light" color="blue" radius="xl">
                        <IconUserPlus size="1.1rem" />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Friend list */}
            <Title order={4} mt="lg">
              Your Friends
            </Title>
            {myFriends.length === 0 ? (
              <Text c="dimmed" size="sm" italic>
                You haven't added any friends yet.
              </Text>
            ) : (
              <Stack spacing="sm">{/* Map friend list please*/}</Stack>
            )}
          </Stack>
        )}
      </section>
    </Container>
  );
};

export default Homepage;
