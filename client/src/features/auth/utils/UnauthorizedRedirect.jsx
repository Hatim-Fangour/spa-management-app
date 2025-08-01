import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { roleRoutes } from "../../../app/config";

export  const UnauthorizedRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
      if (isAuthenticated) {
        // Redirect to role-specific landing page
        const landingPage = roleRoutes[userRole] || roleRoutes.default;
        navigate(landingPage, {
          replace: true,
          state: { from: location }, // Preserve original attempted location
        });
      } else {
        // Not logged in - go to login with redirect back
        navigate("/auth", {
          replace: true,
          state: { from: location },
        });
      }
    }, [isAuthenticated, userRole, navigate, location]);

    return <div className="full-page-loader">Redirecting...</div>;
  };