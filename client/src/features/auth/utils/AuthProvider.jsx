"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


import { verifyToken } from "../thunks/authThunks";

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const auth = useSelector((state) => state?.auth);
  const { token, user, isAuthenticated } = useSelector(
    (state) => state?.auth || {}
  );

  useEffect(() => {
    // On initial load, verify token if it exists
    if (token && isAuthenticated) {
      dispatch(verifyToken(token));
    }
  }, [dispatch, token, isAuthenticated]);

  return <>{children}</>;
};
