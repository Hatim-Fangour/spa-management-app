import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getRoleRedirect } from "../../../utils/roleRedirects";
import { loadAllData } from "../../../app/dataThunks";
import { useEffect } from "react";
import { setupUsersListeners } from "../slices/authSlice";
import { ROLE_CODES, useAuthUtils } from "./authUtils";

export const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const { handleLogOut } = useAuthUtils();

  const { user, claims, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log(user)
  console.log(claims)

  useEffect(() => {
    let unsubscribe;

    const setupListener = async () => {
      if (user?.uid) {
        try {
          // Dispatch and await the thunk's return value
          unsubscribe = await dispatch(setupUsersListeners(user.uid));
        } catch (error) {}
      }
    };

    setupListener();

    // Cleanup: Call unsubscribe if it exists
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [dispatch, user?.uid]);

  if (isAuthenticated && claims === 111) {
    handleLogOut();
  }

  const isAuthRoute = ["/auth"].includes(location.pathname);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && claims !== ROLE_CODES.USER) {
      dispatch(loadAllData());
    }
  }, [isAuthenticated, claims, dispatch]);

  // Redirect logic only after rehydration
  if (!isAuthenticated && !["/auth", "/newuser"].includes(location.pathname)) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (isAuthenticated && ["/auth", "/"].includes(location.pathname)) {
    const redirectPath =
      claims === ROLE_CODES.USER ? "/newuser" : getRoleRedirect(claims);
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and on auth route, determine where to redirect
  // If a user exists (user) and the current route is an "/auth" route, redirects to /
  // This prevents authenticated users from accessing the login page
  if (
    (isAuthenticated && isAuthRoute && claims !== ROLE_CODES.USER) ||
    (isAuthenticated && location.pathname === "/")
  ) {
  }

  return children;
};
