import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/login";
import Services from "../pages/Services/Services";
import Decorators from "../pages/Decorators/Decorators";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Dashboard/Profile/Profile";
import DashboardLayout from "../layouts/DashboardLayout";
import AddService from "../pages/Dashboard/AddService/AddService";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "decorators", element: <Decorators /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <p>Dashboard Home</p> },
      { path: "profile", element: <Profile /> },
      { path: "add-service", element: <AddService /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);
