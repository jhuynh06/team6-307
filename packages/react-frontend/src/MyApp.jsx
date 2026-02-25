import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./homepage"; 
import Explore from "./explorePage"; 

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