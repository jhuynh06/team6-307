import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Homepage from "./homepage";
import Explore from "./explorePage";
import StorePage from "./StorePage";
import DiningList from "./DiningList";
import Header from "./Header";
import ProfilePage from "./ProfilePage";
import Login from "./Login";

const API_PREFIX = "http://localhost:8000";
const INVALID_TOKEN = "INVALID_TOKEN";

export default function MyApp() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || INVALID_TOKEN
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    }
    return {
      ...otherHeaders,
      Authorization: `Bearer ${token}`
    };
  }

  function loginUser(creds) {
    return fetch(`${API_PREFIX}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds)
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json().then((payload) => {
            localStorage.setItem("token", payload.token);
            setToken(payload.token);
            setMessage("Login successful.");
            navigate("/");
          });
        } else {
          return res.text().then((text) => {
            setMessage(text || "Login failed: Invalid credentials.");
          });
        }
      })
      .catch((error) => {
        setMessage("Login failed: Could not reach server.");
        console.log(error);
      });
  }

  function signupUser(creds) {
    return fetch(`${API_PREFIX}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds)
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json().then((payload) => {
            localStorage.setItem("token", payload.token);
            setToken(payload.token);
            setMessage("Signup successful.");
            navigate("/");
          });
        } else {
          return res.text().then((text) => {
            setMessage(text || "Signup failed.");
          });
        }
      })
      .catch((error) => {
        setMessage("Signup failed: Could not reach server.");
        console.log(error);
      });
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(INVALID_TOKEN);
    setMessage("Logged out.");
    navigate("/");
  }

  const isLoggedIn = token !== INVALID_TOKEN;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stores" element={<DiningList />} />
        <Route path="/stores/view" element={<StorePage />} />
        <Route path="/profile" element={<ProfilePage token={token} />} />
        <Route
          path="/login"
          element={<Login handleSubmit={loginUser} buttonLabel="Log In" message={message} />}
        />
        <Route
          path="/signup"
          element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" message={message} />}
        />
      </Routes>
    </>
  );
}
