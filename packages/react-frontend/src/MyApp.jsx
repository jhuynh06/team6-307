import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./homepage"; 
import Explore from "./explorePage"; // FIXED: Changed 'Explorepage' to 'Explore'

export default function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}