// components/RoleRedirect.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getRoleRedirect } from '../utils/roleRedirects';
import { useSelector } from 'react-redux';
import { getRoleRedirect } from '../../../utils/roleRedirects';
import { hasRequiredRole } from './authUtils';






  export const RoleRoute = ({ children, allowedRoles = null }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, claims } = useSelector((state) => state.auth);

    useEffect(() => {
      // if (!isVerified) return;

      // if (!isRehydrated) return; // wait for persisted auth state

      if (!isAuthenticated) {
        navigate("/auth", { state: { from: location }, replace: true });
        return;
      }

      if (allowedRoles && !hasRequiredRole(claims, allowedRoles)) {
        navigate("/unauthorized", { replace: true });
      }
    }, [isAuthenticated, claims, navigate, location, allowedRoles]);

    return children;
  };