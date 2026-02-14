import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AuthGuard from "./auth/AuthGuard.jsx";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const DefaultRoute = () => {
  const loginData = JSON.parse(localStorage.getItem("loginData"));
  if (loginData) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <DefaultRoute />,
    },
    {
      path: "/login",
      element: (
        <AuthGuard required={false}>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthGuard required={false}>
          <Register />
        </AuthGuard>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <AuthGuard required={true}>
          <Dashboard />
        </AuthGuard>
      ),
    },
    {
      path: "/create-post",
      element: (
        <AuthGuard required={true}>
          <CreatePost />
        </AuthGuard>
      ),
    },
    {
      path: "/edit-post/:id",
      element: (
        <AuthGuard required={true}>
          <CreatePost />
        </AuthGuard>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={route} />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;