import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import Homepage from "./homepage";
import Explore from "./explorePage";
import StorePage from "./StorePage";
import DiningList from "./DiningList";
import Header from "./Header";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import ProductPage from "./productPage";
import AdminPanel from "./AdminPanel";
import { API_PREFIX, INVALID_TOKEN } from "./config";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function MyApp() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || INVALID_TOKEN
  );
  const navigate = useNavigate();

  const decoded = token !== INVALID_TOKEN ? decodeToken(token) : null;
  const isAdmin = decoded?.isAdmin || false;

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
            notifications.show({
              title: "Success",
              message: "Login successful.",
              color: "green"
            });
            navigate("/");
          });
        } else {
          return res.text().then((text) => {
            notifications.show({
              title: "Login Failed",
              message: text || "Invalid credentials.",
              color: "red"
            });
          });
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Error",
          message: "Could not reach server.",
          color: "red"
        });
        console.error(error);
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
            notifications.show({
              title: "Success",
              message: "Signup successful.",
              color: "green"
            });
            navigate("/");
          });
        } else {
          return res.text().then((text) => {
            notifications.show({
              title: "Signup Failed",
              message: text || "Signup failed.",
              color: "red"
            });
          });
        }
      })
      .catch((error) => {
        notifications.show({
          title: "Error",
          message: "Could not reach server.",
          color: "red"
        });
        console.error(error);
      });
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(INVALID_TOKEN);
    notifications.show({
      title: "Logged out",
      message: "You have been logged out.",
      color: "blue"
    });
    navigate("/");
  }

  const isLoggedIn = token !== INVALID_TOKEN;

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Homepage token={token} />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/stores" element={<DiningList />} />
        <Route path="/stores/:id" element={<StorePage />} />
        <Route path="/profile" element={<ProfilePage token={token} />} />
        <Route
          path="/login"
          element={<Login handleSubmit={loginUser} buttonLabel="Log In" />}
        />
        <Route
          path="/signup"
          element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />}
        />
        <Route path="/stores/:storeId/product/:id" element={<ProductPage />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPanel token={token} /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}
