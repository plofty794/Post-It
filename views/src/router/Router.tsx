import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import UnAuthenticatedLayout from "@/layouts/UnAuthenticatedLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import UserProfile from "@/pages/UserProfile";
import { authStore } from "@/store/authStore";
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

function Router() {
  const token = authStore((state) => state.token);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route element={<UnAuthenticatedLayout />}>
          <Route
            path="/login"
            element={token ? <Navigate to={"/"} /> : <Login />}
          />
          <Route
            path="/sign-up"
            element={token ? <Navigate to={"/"} /> : <SignUp />}
          />
        </Route>

        <Route
          element={token ? <AuthenticatedLayout /> : <Navigate to={"/login"} />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Route>
      </>
    )
  );

  return router;
}

export default Router;
