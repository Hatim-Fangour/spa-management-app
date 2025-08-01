
import { logout } from "../slices/authSlice";
import { persistor } from "../../../app/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";




export const hasRequiredRole = (userRole, requiredRoles) => {
  // console.log(userRole, requiredRoles);
  return requiredRoles.includes(userRole);
};

export const hasRequiredAccess = (userAccessRights, requiredAccess) => {
  return userAccessRights.some(right => requiredAccess.includes(right));
};

// Pass dispatch/navigate as arguments
// export const handleLogOut = async (dispatch, navigate) => {
//   try {
//     dispatch(logout());
//     persistor.purge();
//     navigate("/auth", { replace: true });
//     window.history.replaceState(null, "", "/auth");
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

// Usage in components:
// handleLogOut(dispatch, navigate);

export const useAuthUtils = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      dispatch(logout());
      persistor.purge();
      navigate("/auth", { replace: true, state: { reset: true } } );
      window.history.replaceState({}, "", "/auth");
      // 5. Force hard navigation to reset all router state
      // window.location.href = '/auth'; // This is the nuclear option
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { handleLogOut };
};


export const initRegisterData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    isGoogleLogin: false, // Add this
  }

  export const ROLE_CODES = {
  // SUPER_ADMIN: 926, // Full system access
  ADMIN: 705, // Organization-level admin
  MANAGER: 531, // Department manager
  NURSE: 324, // Medical staff
  RECEPTIONIST: 187, // Front desk
  USER: 111, // Front desk
};