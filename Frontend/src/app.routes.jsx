import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Login from "./feature/auth/pages/Login";
import Register from "./feature/auth/pages/Register";
import Protected from "./feature/auth/components/Protected";
import Dashborad from "./feature/chat/pages/Dashborad";

export const router = createBrowserRouter([
  { path: "/", element: <Protected>
    <Dashborad/>
  </Protected> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);
