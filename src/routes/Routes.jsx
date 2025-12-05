import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/Mainlayout";
import Home from "../pages/Home/Home";

import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/signup",
        Component: Signup,
      },
    ],
  },
]);
