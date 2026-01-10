import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Signup from "../pages/Signup/Signup";
import Login from "../pages/Login/login";
import Services from "../pages/Services/Services";
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
import AssignedProjects from "../pages/Dashboard/AssignedProjects/AssignedProjects";
import ApplyDecorator from "../pages/Dashboard/ApplyDecorator/ApplyDecorator";
import ManageDecorators from "../pages/Dashboard/ManageDecorators/ManageDecorators";
import ManageBookings from "../pages/Dashboard/ManageBookings/ManageBookings";
import DecoratorRoute from "./DecoratorRoute";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import ManageCoupons from "../pages/Dashboard/ManageCoupons/ManageCoupons";
import Earnings from "../pages/Dashboard/Earnings/Earnings";
import TodaysSchedule from "../pages/Dashboard/TodaysSchedule/TodaysSchedule";
import Error from "../components/Error";
import LoadingSpinner from "../components/LoadingSpinner";
import DecoratorDetail from "../components/DecoratorDetail";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AdminAnalytics from "../pages/AdminAnalytics/AdminAnalytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    hydrateFallbackElement: <LoadingSpinner />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "service/:id", element: <ServicesDetail /> },
      { path: "payment-success", element: <PaymentSuccess /> }, 
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      {
        path: "decorator/:id",
        element: (
          <PrivateRoute>
            <DecoratorDetail />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    hydrateFallbackElement: <LoadingSpinner />,
    errorElement: <Error />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "apply-decorator", element: <ApplyDecorator /> },

      {
        path: "assigned-projects",
        element: (
          <DecoratorRoute>
            <AssignedProjects />
          </DecoratorRoute>
        ),
      },
      {
        path: "todays-schedule",
        element: (
          <DecoratorRoute>
            <TodaysSchedule />
          </DecoratorRoute>
        ),
      },
      {
        path: "earnings",
        element: (
          <DecoratorRoute>
            <Earnings />
          </DecoratorRoute>
        ),
      },

      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "add-service",
        element: (
          <AdminRoute>
            <AddService />
          </AdminRoute>
        ),
      },
      {
        path: "manage-decorators",
        element: (
          <AdminRoute>
            <ManageDecorators />
          </AdminRoute>
        ),
      },
      {
        path: "manage-services",
        element: (
          <AdminRoute>
            <ManageServices />
          </AdminRoute>
        ),
      },
      {
        path: "manage-bookings",
        element: (
          <AdminRoute>
            <ManageBookings />
          </AdminRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        ),
      },
      {
        path: "manage-coupons",
        element: (
          <AdminRoute>
            <ManageCoupons />
          </AdminRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <Error /> },
]);
