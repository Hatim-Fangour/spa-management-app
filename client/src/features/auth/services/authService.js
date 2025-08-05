// import  { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./types"
import { auth, signInWithGoogle } from "../../../services/firebase-client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import api from "../../../services/api";

class AuthService {
  formatAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/user-not-found":
        return "Account not found";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/too-many-requests":
        return "Account temporarily locked. Try again later";
      default:
        return "Login failed. Please try again.";
    }
  };

  // Login with email and password
  async login(credentials) {
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

    
    
      // Get Firebase ID token
      const token = await userCredential?.user?.getIdToken();

      // Verify with backend
      const response = await api.post("/auth/login", { token });


      return {
        user: response.data,
        token,
      };
    } catch (error) {
      // Convert to plain object to make it serializable
      throw {
        code: error.code,
        message: this.formatAuthError(error),
        name: error.name,
        original: error, // Keep original error for debugging
      };
    }
  }

  // Google Sign-In
  async googleLogin() {
    try {
      // 1. Sign in with Google via Firebase
      const googleUser = await signInWithGoogle();
    
      // 2. Get Firebase ID token
      const token = await googleUser.getIdToken();
      // 3. Verify with backend and get custom claims
      const response = await api.post("/auth/google", { token });
    
      return {
        user: response.data,
        token,
      };
      // return {
      //   customClaims: response.data.customClaims || {},
      //   user: response.data.userRecord,
      //   token,
      // };
    } catch (error) {
     
      throw {
        code: error.code || "auth/google-signin-failed",
        message: this.formatAuthError(error) || "Google sign-in failed",
        original: error,
      };
    }
  }

  // Register new user
  async register(credentials) {
    try {
    

      // Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

    

      // 2. Update profile (displayName and photoURL)
      await updateProfile(userCredential.user, {
        displayName: credentials.fullName,
        photoURL: credentials?.photoURL || null, // Set to null if not provided
        phoneNumber: credentials?.phoneNumber || null, // Set to null if not provided
      });


      // Get Firebase ID token
      const token = await userCredential.user.getIdToken();

    ;
      // Register with backend
      const response = await api.post("/auth/register", {
        token,
        userData: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          email: credentials.email,
          role: credentials.role || 111, // Default role
        },
      });

      return {
        user: response.data.user,
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Verify token with backend
  async verifyToken(token) {
    try {
      const response = await api.post("/auth/verify-token", { token });
      return response.data.user;
    } catch (error) {
      console.error("Token verification error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      // Additional backend logout if needed
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Format auth errors for consistent error messages
  // formatAuthError(error) {
  //   const errorCode = error.code;

  //   switch (errorCode) {
  //     case "auth/user-not-found":
  //     case "auth/wrong-password":
  //       return "Invalid email or password";
  //     case "auth/email-already-in-use":
  //       return "Email is already in use";
  //     case "auth/weak-password":
  //       return "Password is too weak";
  //     case "auth/invalid-email":
  //       return "Invalid email address";
  //     case "auth/network-request-failed":
  //       return "Network error. Please check your connection";
  //     default:
  //       return error.message || "Authentication failed";
  //   }
  // }
}

export const authService = new AuthService();
