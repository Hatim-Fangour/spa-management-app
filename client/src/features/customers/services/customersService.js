// import { validateCustomer } from "../../../../utils/validators";
import api from "../../../services/api";
import { validateCustomer } from "../../../utils/validators";

class CustomerService {
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

  async addCustomer(customerData) {
    // Client-side validation

    const { isValid, errors } = validateCustomer(customerData);

    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    try {
      const response = await api.post("/customers/customer", customerData);

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      // console.log(error);
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
        message: error.response?.data?.message || "Failed to add customer",
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

  async deleteCustomer(customerID) {
    // Client-side validation

    // const { isValid, errors } = validateNote(noteData);

    // if (!isValid) {
    //   throw {
    //     code: 400,
    //     message: "Validation failed",
    //     details: errors,
    //   };
    // }
    try {
      const response = await api.delete(`/customers/customer/${customerID}`);

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      // console.log(error);
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
        message: error.response?.data?.message || "Failed to delete customer",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

    async updateCustomer(CustomerDataUpdate) {
    // Client-side validation

    try {
      // console.log(CustomerDataUpdate);
      const response = await api.put(
        `/customers/customer/${CustomerDataUpdate.id}`,
        CustomerDataUpdate
      );

      return response.data;
    } catch (error) {
      // Convert to plain object to make it serializable
      // console.log(error);
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
        message: error.response?.data?.message || "Failed to update customer",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getCustomers() {
    try {
      const response = await api.get("/customers");
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const customerService = new CustomerService();
