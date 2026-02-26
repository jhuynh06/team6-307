import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@mantine/core/styles.css'; 
import { MantineProvider } from '@mantine/core';

import Homepage from "./homepage"; 
import Explore from "./explorePage";   
import StorePage from "./StorePage";

export default function MyApp() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/stores" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}