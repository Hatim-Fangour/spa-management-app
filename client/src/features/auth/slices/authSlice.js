// client/src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { authService } from "../services/authService";
import { customerService } from "../../customers/services/customersService";
import { calendarService } from "../../calendar/services/calendarService";
import { employeeService } from "../../employees/services/employeesService";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";
import api from "../../../services/api";
import {
  googleSignIn,
  loginUser,
  registerUser,
  verifyToken,
} from "../thunks/authThunks";
// import { persistor } from "../../app/store";
// import { useAuthUtils } from "./authUtils";
// import { persistor } from "../../app/store";
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
const initialState = {
  user: {
    uid: null,
    email: null,
    displayName: null,
    firstName: null, // Ensure these are in initial state
    lastName: null,
  },
  isloading: false,
  error: null,
  claims: null,
  token: null,

  isVerified: false,
  isAuthenticated: false,
};

// Real-time listener setup
export const setupUsersListeners = (userId) => async (dispatch, getState) => {
  // const { handleLogOut } = useAuthUtils();
  // dispatch(setLoading(true));

  const unsubscribeUser = onSnapshot(
    doc(db, "users", userId), // Reference to the specific user document
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        // if(userData.)
        const currentClaims = getState().auth.claims;
        // console.warn(getState().auth);

        if (userData?.role !== currentClaims) {
          dispatch(setClaims(userData?.role));
        }

        // dispatch(setLoading(false));
      } else {
      }
    },
    (error) => {
      // dispatch(setError(error.message));
      // dispatch(setLoading(false));
    }
  );

  // Return the unsubscribe function explicitly
  return unsubscribeUser;
};

// ```
// Create a slice of the state
//  This slice will handle the authentication state
//  It will contain the initial state, reducers, and extra reducers
//  The initial state will contain the user, isloading, and error states
//  The reducers will handle the logout action
//  The extra reducers will handle the login action
//  The login action will be handled by the async thunk created above
//  The extra reducers will handle the pending, fulfilled, and rejected states of the login action
//  The pending state will set the isloading state to true and the error state to null
//  The fulfilled state will set the isloading state to false and the user state to the payload of the action
//  The rejected state will set the isloading state to false and the error state to the payload of the action
//  The logout action will set the user state to null
//  The logout action will be handled by the reducer created above
//  The logout action will be dispatched when the user logs out
//  The logout action will be dispatched when the user clicks the logout button
//  The logout action will be dispatched when the user is logged out
// ```

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isloading = false;
      state.error = null;
      state.claims = null;
      state.token = null;
      state.isVerified = false;
      state.isAuthenticated = false;
    },

    setClaims: (state, action) => {
      state.claims = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ! Login User cases
      .addCase(loginUser.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        const { auth } = action.payload;

        // const { customClaims, token,...restUser } = action.payload;

        state.claims = auth.user.role;
        state.token = auth.token;
        state.isloading = false;
        state.error = null;

        // Ensure consistent user object structure
        state.user = {
          uid: auth.user.uid,
          email: auth.user.email,
          displayName:
            auth.user.displayName ||
            `${auth.user.firstName} ${auth.user.lastName}`,
          firstName: auth.user.firstName,
          lastName: auth.user.lastName,
          createdAt: auth.user.createdAt,
        };
        // state.isAuthenticated = auth.user.role !== 111 ? true : false; // Set isAuthenticated to true
        state.isAuthenticated = auth.user.role !== 111 ? true : false; // Set isAuthenticated to true
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isloading = false;
        state.isAuthenticated = false; // Set isAuthenticated to false
        state.error = action.payload;
      })

      // ! register User cases
      .addCase(registerUser.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      // ! verifyToken cases
      .addCase(verifyToken.pending, (state) => {
        state.isloading = false;
        state.error = null;
        state.isVerified = false; // Set isVerified to false
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
        state.isVerified = true; // Set isVerified to true
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
        state.isVerified = false; // Set isVerified to false
      })
      // Google Sign-In cases
      .addCase(googleSignIn.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        const { customClaims, token, user } = action.payload;
        const { auth } = action.payload;

        // const { customClaims, token,...restUser } = action.payload;

        state.claims = auth.user.role;
        state.token = auth.token;
        state.isloading = false;
        state.error = null;

        // Ensure consistent user object structure
        state.user = {
          uid: auth.user.uid,
          email: auth.user.email,
          displayName:
            auth.user.displayName ||
            `${auth.user.firstName} ${auth.user.lastName}`,
          firstName: auth.user.firstName,
          lastName: auth.user.lastName,
          photoURL: auth.user?.photoURL,
        };
        state.isAuthenticated = auth.user.role !== 111 ? true : false;

        // state.claims = customClaims;
        // state.token = token;
        // state.user = user;
        // state.isloading = false;
        // state.isAuthenticated = true;
        // state.isVerified = true;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setClaims } = authSlice.actions;
export default authSlice.reducer;
