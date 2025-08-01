import api from "../../services/api";
import { validateExpense } from "../../utils/validators";

class ExpenseService {
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
    // Client-side validation

    const { isValid, errors } = validateExpense(expenseData);

    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    try {
      const response = await api.post("/dash/expense", expenseData);

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      console.log(error);
      if (error.code === 400) {
        // Validation error - include field-specific errors
        throw {
          type: "validation",
          errors: error.details,
        };
      }

      throw {
        type: "server",
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to add expense",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };

      //   throw {
      //     code: error.code,
      //     message: this.formatAuthError(error),
      //     name: error.name,
      //     original: error, // Keep original error for debugging
      //   };
    }
  }

  async deleteExpense(expenseId) {
        try {
      const response = await api.delete(`/dash/expense/${expenseId}`);

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      console.log(error);
      if (error.code === 400) {
        // Validation error - include field-specific errors
        throw {
          type: "validation",
          errors: error.details,
        };
      }

      throw {
        type: "server",
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to delete expense",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  
  async updateExpense(expenseDataUpdate) {
    // Client-side validation

    try {
      console.log(expenseDataUpdate);
      const response = await api.put(
        `/dash/expense/${expenseDataUpdate.id}`,
        expenseDataUpdate
      );

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      console.log(error);
      if (error.code === 400) {
        // Validation error - include field-specific errors
        throw {
          type: "validation",
          errors: error.details,
        };
      }

      throw {
        type: "server",
        code: error.response?.status || 500,
        message: error.response?.data?.message || "Failed to update expense",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getExpenses(filters = {}) {
    try {
      const response = await api.get("/expenses", { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();
