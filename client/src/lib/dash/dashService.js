// import  { LoginCredentials, RegisterCredentials, AuthResponse, User } from "./types"
import { auth } from "../../services/firebase-client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import api from "../../services/api";

class DashService {
  //   formatAuthError = (error) => {
  //     switch (error.code) {
  //       case "auth/invalid-credential":
  //         return "Invalid email or password";
  //       case "auth/user-not-found":
  //         return "Account not found";
  //       case "auth/wrong-password":
  //         return "Incorrect password";
  //       case "auth/too-many-requests":
  //         return "Account temporarily locked. Try again later";
  //       default:
  //         return "Login failed. Please try again.";
  //     }
  //   };

  // Login with email and password

  async addExpense(expenseData) {
    try {
      const response = await api.post("/expenses", expenseData);

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
console.log(error)
    //     throw {
    //     code: error.response?.status || 500,
    //     message: formatError(error),
    //     details: error.response?.data?.message || 'Failed to add expense'
    //   };

    //   throw {
    //     code: error.code,
    //     message: this.formatAuthError(error),
    //     name: error.name,
    //     original: error, // Keep original error for debugging
    //   };
    }
  }

}

export const dashService = new DashService();
