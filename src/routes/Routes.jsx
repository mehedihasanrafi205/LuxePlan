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
import ServicesDetail from "../pages/Services/ServicesDetail";
import MyBookings from "../pages/Dashboard/MyBookings/MyBookings";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import ManageServices from "../pages/Dashboard/ManageServices/ManageServices";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "/service/:id", element: <ServicesDetail /> },
      { path: "/Payment-success", element: <PaymentSuccess /> },
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
      { path: "my-bookings", element: <MyBookings /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "add-service", element: <AddService /> },
      { path: "manage-services", element: <ManageServices /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);
