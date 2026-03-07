// HOMEPAGE CONTENTS
// Sections:
//   1. Imports
//   2. Mock Data
//   3. Components
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
  Divider,
  Avatar,
  Stack
} from "@mantine/core";
import ProductCard from "./ProductCard";
import "./page.css";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { TextInput, ActionIcon, Loader } from "@mantine/core";

// ---- 2. MOCK DATA ------------------------------------------

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

const Homepage = () => {
  // ---- 3. COMPONENTS ----------------------------------
  const [activeTab, setActiveTab] = useState("You"); //Current tab
  const [feedData, setFeedData] = useState([]); //Following
  const [userData, setUserData] = useState({
    //You tab stats
    stats: { rated: 0, saved: 0, tried: 0 },
    posts: []
  });

  // subsectionL: friend tab
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [myFriends, setMyFriends] = useState([]);

  // ---- 4. DATA ------------------------------------
  useEffect(() => {
    //global feed
    fetch("http://localhost:8000/activity")
      .then((res) => res.json())
      .then((data) => setFeedData(data))
      .catch((error) =>
        console.log("Error fetching activity:", error)
      );

    // user data
    fetch("http://localhost:8000/activity/user/linan")
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) =>
        console.log("Error fetching user data:", error)
      );
  }, []);

  // ---- 5. HANDLERS -----------------------------------------
  //search function friends tab
  const handleSearch = () => {
    if (!searchQuery) return;
    setIsSearching(true);
    fetch(`http://localhost:8000/users/search?q=${searchQuery}`)
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
          {mockNearbyData.map((place) => (
            <ProductCard key={place._id} product={place} />
          ))}
        </div>
      </section>

      {/*Recent activity*/}
      <section
        className="section"
        style={{ marginTop: "60px" }}>
        <Title order={2} mb="md">
          Recent Activity
        </Title>

        <div className="tabs">
          {["You", "Friends", "Following"].map((tab) => (
            <span
              key={tab}
              className={activeTab === tab ? "active-tab" : ""}
              onClick={() => setActiveTab(tab)}
              style={{ cursor: "pointer" }}>
              {tab}
            </span>
          ))}
        </div>

        {/* You tab */}
        {activeTab === "You" && (
          <div>
            {/* subsection: stats bar*/}
            <Paper
              shadow="sm"
              radius="md"
              p="md"
              mb="xl"
              withBorder>
              <Group position="center" spacing="xl" grow>
                <div style={{ textAlign: "center" }}>
                  <Text size="xl" weight={700}>
                    {userData.stats.rated}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Places rated
                  </Text>
                </div>
                <Divider orientation="vertical" />
                <div style={{ textAlign: "center" }}>
                  <Text size="xl" weight={700}>
                    {userData.stats.saved}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Places saved
                  </Text>
                </div>
                <Divider orientation="vertical" />
                <div style={{ textAlign: "center" }}>
                  <Text size="xl" weight={700}>
                    {userData.stats.tried}
                  </Text>
                  <Text size="sm" color="dimmed">
                    Places tried
                  </Text>
                </div>
              </Group>
            </Paper>

            {/*User feed*/}
            <div className="scrollable-feed">
              {userData.posts.map((post) => (
                <Paper
                  key={post._id}
                  shadow="xs"
                  radius="md"
                  p="md"
                  mb="sm"
                  withBorder>
                  <Group position="apart" mb="sm">
                    <Group>
                      <Avatar color="blue" radius="xl">
                        Y
                      </Avatar>
                      <div>
                        <Text weight={500}>
                          {post.restaurantName}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {post.time}
                        </Text>
                      </div>
                    </Group>
                    <Text size="sm">
                      {Array(post.rating).fill("★").join("")}
                    </Text>
                  </Group>
                  <Text size="sm" mb="md">
                    {post.message}
                  </Text>
                  <Group position="right">
                    <span style={{ cursor: "pointer" }}>
                      📝
                    </span>
                    <span style={{ cursor: "pointer" }}>
                      🗑️
                    </span>
                  </Group>
                </Paper>
              ))}
            </div>
          </div>
        )}

        {/*Following Tab*/}
        {activeTab === "Following" && (
          <div className="scrollable-feed">
            {feedData.map((post) => (
              <div className="activity-item" key={post._id}>
                <div className="user-info">
                  <div className="avatar"></div>
                  <div>
                    <div className="username">
                      {post.restaurantName}
                    </div>
                    <div className="time">{post.time}</div>
                  </div>
                </div>
                <div className="post-content">
                  <p>{post.message}</p>
                  {post.hasImages && (
                    <div className="post-image-placeholder"></div>
                  )}
                </div>
              </div>
            ))}
            <div className="end-of-feed-banner">
              (no new posts)
            </div>
          </div>
        )}

        {/*Friend tab*/}
        {activeTab === "Friends" && (
          <Stack spacing="md" mt="md">
            {/* Search input */}
            <TextInput
              placeholder="Search for friends by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch()
              }
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
                    <Group
                      justify="space-between"
                      key={user.username}>
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
                      <ActionIcon
                        variant="light"
                        color="blue"
                        radius="xl">
                        <IconUserPlus size="1.1rem" />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Friend list*/}
            <Title order={4} mt="lg">
              Your Friends
            </Title>
            {myFriends.length === 0 ? (
              <Text c="dimmed" size="sm" italic>
                You haven't added any friends yet.
              </Text>
            ) : (
              <Stack spacing="sm">
                {/* Map friend list please*/}
              </Stack>
            )}
          </Stack>
        )}
      </section>
    </Container>
  );
};

export default Homepage;
