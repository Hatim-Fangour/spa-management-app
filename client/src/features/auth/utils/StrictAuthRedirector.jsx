import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleRedirect } from "../../../utils/roleRedirects";
// import { getRoleRedirect } from "../../../utils/roleRedirects";

// This is a sophisticated authentication redirection component that controls access to protected routes in a React application. Here's a detailed breakdown:

// + Core Purpose
// - This component ensures:
// - Authenticated users are immediately redirected away from auth pages (like login/signup)
// - Unauthenticated users can access the protected content (like login forms)
// - Prevents flickering of protected content before auth state is confirmed
export const StrictAuthRedirector = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, claims } = useSelector(
    (state) => state?.auth || {}
  );
  const [shouldRender, setShouldRender] = useState(false);
console.log({ isAuthenticated, claims })
  useEffect(() => {
    if (isAuthenticated) {
      console.log(claims)
      const roleBasedRedirect = getRoleRedirect(claims);
      console.log(roleBasedRedirect)
      // Immediate redirect without showing the protected page
      navigate(roleBasedRedirect, {
        replace: true,
        state: {
          redirectedFromAuth: true,
          attemptedPath: location.pathname,
        },
      });
    } else {
      // Only allow rendering after confirming not authenticated
      setShouldRender(true);
    }
  }, [isAuthenticated, navigate, location, claims]);

  // Only render children when confirmed unauthenticated
  return shouldRender ? children : null;
};
