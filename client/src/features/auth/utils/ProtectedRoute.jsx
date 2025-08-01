// components/ProtectedRoute.jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from '../firebase-config';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoleRedirect } from "../../../utils/roleRedirects";
import { verifyToken } from "../thunks/authThunks";

export const ProtectedRoute = ({
  children,
  roles = [],
  canEdit = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, error, token, claims, isloading } = useSelector(
    (state) => state.auth
  );
  const [isVerifying, setIsVerifying] = useState(true);
  
  
  useEffect(() => {
    async function verifyUserToken() {
      if (user && token) {
        
        dispatch(verifyToken(token));
      }

      setIsVerifying(false);
    }
    verifyUserToken();
  }, [user, token, dispatch]);



  useEffect(() => {
    if (claims?.role && !roles.includes(claims?.role)) {
      // const redirectPath = getRoleRedirect(claims.role);


      
        return <Navigate to="/unauthorized" replace />;
      

    }
  }, [claims, navigate]);

  if (isloading || isVerifying)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Verifying authentication...</p>
        </div>
      </div>
    );

  if (error || !user) {
    console.error("Auth error:", error);

    return <Navigate to="/auth" replace />;
  }



  // Render children with auth context
  return children;
};
