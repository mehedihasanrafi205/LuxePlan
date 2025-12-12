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
import AssignedProjects from "../pages/Dashboard/AssignedProjects/AssignedProjects";
import ApplyDecorator from "../pages/Dashboard/ApplyDecorator/ApplyDecorator";
import ManageDecorators from "../pages/Dashboard/ManageDecorators/ManageDecorators";
import ManageBookings from "../pages/Dashboard/ManageBookings/ManageBookings";
import DecoratorRoute from "./DecoratorRoute";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import Earnings from "../pages/Dashboard/Earnings/Earnings";
import TodaysSchedule from "../pages/Dashboard/TodaysSchedule/TodaysSchedule";
import Error from "../components/Error";
import LoadingSpinner from "../components/LoadingSpinner";
import DecoratorDetail from "../components/DecoratorDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    hydrateFallbackElement: <LoadingSpinner />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "/service/:id", element: <ServicesDetail /> },
      { path: "/Payment-success", element: <PaymentSuccess /> },
      { path: "decorators", element: <Decorators /> },
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
    children: [
      {
        index: true,
        element: <p>Dashboard Home</p>,
        errorElement: <Error />,
        hydrateFallbackElement: <LoadingSpinner />,
      },
      { path: "profile", element: <Profile /> },
      { path: "my-bookings", element: <MyBookings /> },
      { path: "payment-history", element: <PaymentHistory /> },
      { path: "apply-decorator", element: <ApplyDecorator /> },

      //* Decorator Route *//

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

      //* Admin Route *//
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
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "*",
    element: <Error />,
  },
]);
