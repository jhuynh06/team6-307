import React from "react";
import { Routes, Route } from "react-router-dom";

import Homepage from "./homepage";
import Explore from "./explorePage";
import StorePage from "./StorePage";
import Header from "./Header";
import ProfilePage from "./ProfilePage";

export default function MyApp() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stores" element={<StorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </>
  );
}