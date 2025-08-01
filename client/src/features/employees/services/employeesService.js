import api from "../../../services/api";
// import { validateCustomer } from "../../../../utils/validators";

class EmployeeService {
  

  async addEmployee(employeeData) {
    // Client-side validation

    // const { isValid, errors } = validateEmployee(employeeData);

    // if (!isValid) {
    //   throw {
    //     code: 400,
    //     message: "Validation failed",
    //     details: errors,
    //   };
    // }



    try {
      const response = await api.post("/employees/employee", employeeData);

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
        message: error.response?.data?.message || "Failed to add employee",
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

  async deleteEmployee(employeeID) {
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
      const response = await api.delete(`/employees/employee/${employeeID}`);

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
        message: error.response?.data?.message || "Failed to delete employee",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

    async updateEmployee(employeeDataUpdate) {
    // Client-side validation

    try {
      // console.log(employeeDataUpdate);
      const response = await api.put(
        `/employees/employee/${employeeDataUpdate.id}`,
        employeeDataUpdate
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
        message: error.response?.data?.message || "Failed to update employee",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getEmployees() {
    try {
      const response = await api.get("/employees");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const employeeService = new EmployeeService();
