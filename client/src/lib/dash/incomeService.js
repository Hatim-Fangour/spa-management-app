import api from "../../services/api";
import { validateExpense, validateIncome } from "../../utils/validators";

class IncomeService {
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

  async addIncome(incomeData) {
    // Client-side validation

    const { isValid, errors } = validateIncome(incomeData);
    console.log({ isValid, errors });
    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    try {
      const response = await api.post("/dash/income", incomeData);

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
        message: error.response?.data?.message || "Failed to add income",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }


  
  async deleteIncome(incomeId) {
        try {
      const response = await api.delete(`/dash/income/${incomeId}`);

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
        message: error.response?.data?.message || "Failed to delete income",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  
  async updateIncome(incomeDataUpdate) {
    // Client-side validation

    try {
      console.log(incomeDataUpdate);
      const response = await api.put(
        `/dash/income/${incomeDataUpdate.id}`,
        incomeDataUpdate
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
        message: error.response?.data?.message || "Failed to update income",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }





}

export const incomeService = new IncomeService();
