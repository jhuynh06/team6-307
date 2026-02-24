import React from "react";
import ReactDOMClient from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyApp from "./MyApp";
import StorePage from "./StorePage";
import "./main.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyApp />} />
                <Route path="/store" element={<StorePage />} />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById("root");
const root = ReactDOMClient.createRoot(container);

root.render(
    <MantineProvider
        defaultColorScheme="light"
        theme={{
            fontFamily: "Lato, sans-serif",
            headings: { fontFamily: "Lato, sans-serif" }
        }}
    >
        <App />
    </MantineProvider>
);
