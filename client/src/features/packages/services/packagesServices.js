import api from "../../../services/api";
import {
  validateCustomer,
  validateService,
} from "../../../utils/validators";

class ServicesService {
  // Login with email and password

  async addService(serviceData) {
    // Client-side validation

    const { isValid, errors } = validateService(serviceData);

    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    try {
      const response = await api.post("/services/service", serviceData);

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
        message: error.response?.data?.message || "Failed to add service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async deleteService(serviceID) {
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
      const response = await api.delete(`/services/service/${serviceID}`);

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
        message: error.response?.data?.message || "Failed to delete service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updateService(serviceDataUpdate) {
    // Client-side validation

    try {
      console.log(serviceDataUpdate);
      const response = await api.put(
        `/services/service/${serviceDataUpdate.id}`,
        serviceDataUpdate
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
        message: error.response?.data?.message || "Failed to update service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async addSubService(subServiceData) {
    // Client-side validation

    // const { isValid, errors } = validateSubService(subServiceData);
    const isValid = true;
    const errors = "error";
    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
      };
    }
    try {
      console.log(subServiceData);
      const response = await api.post("/services/subservice", subServiceData);

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
        message: error.response?.data?.message || "Failed to add sub-service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async deleteSubService(subServiceData) {
    // Client-side validation

    try {
      console.log(subServiceData);
      const response = await api.delete(
        `/services/subservice/?serviceID=${subServiceData.serviceID}&id=${subServiceData.id}`,
        subServiceData
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
        message:
          error.response?.data?.message || "Failed to delete sub-service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updateSubService(subServiceDataUpdate) {
    // Client-side validation

    try {
      console.log(subServiceDataUpdate);
      const response = await api.put(
        `/services/subservice/${subServiceDataUpdate.id}`,
        subServiceDataUpdate
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
        message:
          error.response?.data?.message || "Failed to update sub-service",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async addPackage(packageData) {
    // Client-side validation

    //   const { isValid, errors } = validatePackage(packageData);

    //   if (!isValid) {
    //     throw {
    //       code: 400,
    //       message: "Validation failed",
    //       details: errors,
    //     };
    //   }
    try {
      const response = await api.post("/services/package", packageData);

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
        message: error.response?.data?.message || "Failed to add package",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async deletePackage(packageData) {
    //   Client-side validation

    // const { isValid, errors } = validateNote(noteData);

    // if (!isValid) {
    //   throw {
    //     code: 400,
    //     message: "Validation failed",
    //     details: errors,
    //   };
    // }
    try {
        console.log(packageData)
      const response = await api.delete(
        `/services/package/?serviceID=${packageData.serviceID}&subserviceID=${packageData.subServiceID}&id=${packageData.id}`
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
        message: error.response?.data?.message || "Failed to delete package",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updatePackage(packageDataUpdate) {
    // Client-side validation

    try {
      console.log(packageDataUpdate);
      const response = await api.put(
        `/services/package/?serviceiD=${packageDataUpdate.serviceID}&subserviceiD=${packageDataUpdate.subServiceID}&id=${packageDataUpdate.id}`,
        packageDataUpdate
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
        message:
          error.response?.data?.message || "Failed to update package",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getServices() {
    try {
      const response = await api.get("/services");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const servicesService = new ServicesService();
