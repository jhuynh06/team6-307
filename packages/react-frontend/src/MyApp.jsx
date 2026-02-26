import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import theme from "./theme";
import Homepage from "./homepage";
import Explore from "./explorePage";
import StorePage from "./StorePage";
import Header from "./Header";

export default function MyApp() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/stores" element={<StorePage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}