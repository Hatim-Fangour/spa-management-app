import CryptoJS from "crypto-js";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import authReducer from "./authSlice";
import authReducer from "../features/auth/slices/authSlice"; // Adjust the import path as needed
import dashReducer from "../features/dashboard/slices/dashSlice"; // Adjust the import path as needed
import utilsReducer from "../features/notes/slices/utilsSlice"; // Adjust the import path as needed
import customersReducer from "../features/customers/slices/customersSlice"; // Adjust the import path as needed
import servicesReducer from "../features/packages/slices/packagesSlice"; // Adjust the import path as needed
import employeesReducer from "../features/employees/slices/employeesSlice";
import calendarReducer from "../features/calendar/slices/calendarSlice";

const getSecretKey = () => {
  return process.env.REACT_APP_STORAGE_SECRET || "default-fallback-key";
};
const getNodeEnv = () => {
  return process.env.REACT_APP_NODE_ENV || "default-fallback-key";
};

const encryptData = (data) => {
  if (!data) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), getSecretKey()).toString();
};

const decryptData = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, getSecretKey());
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed for ciphertext:", ciphertext);
    return null;
  }
};

// const decryptData = (ciphertext) => {
//   const bytes = CryptoJS.AES.decrypt(ciphertext, getSecretKey());
//   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// };

const authPersistenceWhitelist = {
  // token: true,
  isAuthenticated: true,
  fullName: true,
  // Don't store entire user object
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [
    {
      in: (authState) => {
        if (!authState) return encryptData(null);

        // For USER role (111), don't persist
        if (authState?.claims === 111) {
          return encryptData({
            isAuthenticated: false,
            claims: 111,
            user: null,
          });
        }

        // Create minimal auth authState
        const minimalAuth = authState?.claims
          ? {
              isAuthenticated: authState.isAuthenticated,
              claims: authState.claims,
              isVerified: authState.isVerified,
              user: authState.user
                ? {
                    uid: authState.user.uid,
                    email: authState.user.email,
                    displayName:
                      authState.user.displayName ||
                      `${authState.user.firstName} ${authState.user.lastName}`,
                    firstName: authState.user.firstName, // Add this
                    lastName: authState.user.lastName, // Add this
                  }
                : null,
            }
          : null;

        
  
        return encryptData(minimalAuth);
      },
      out: (encryptedState) => {
        if (!encryptedState)
          return {
            user: null,
            isloading: false,
            error: null,
            claims: null,
            token: null,
            isVerified: false,
            isAuthenticated: false,
          };

        try {
          const decrypted = decryptData(encryptedState);
          //  if (!authState || authState._persist) return authState;
          return {
            ...decrypted,
            isloading: false,
            error: null,
          };
        } catch (error) {
          console.error("Decryption failed:", error);
          return {
            user: null,
            isloading: false,
            error: null,
            claims: null,
            token: null,
            isVerified: false,
            isAuthenticated: false,
          };
        }
      },
    },
  ],
};

// +
const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashReducer,
  utils: utilsReducer,
  customers: customersReducer,
  services: servicesReducer,
  employees: employeesReducer,
  calendar: calendarReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  devTools: getNodeEnv() !== "production", // Only enable in dev
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

