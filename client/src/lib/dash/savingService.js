import api from "../../services/api";
import { validateExpense, validateIncome, validateSaving } from "../../utils/validators";

class SavingService {
  

  async addSaving(savingData) {
    // Client-side validation

    const { isValid, errors } = validateSaving(savingData);
    console.log({ isValid, errors });
    if (!isValid) {
      throw {
        code: 400,
        message: "Validation failed",
        details: errors,
        
      };
    }
    try {
      const response = await api.post("/dash/saving", savingData);

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
        message: error.response?.data?.message || "Failed to add saving",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }



   
    async deleteSaving(savingId) {
          try {
        const response = await api.delete(`/dash/saving/${savingId}`);
  
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
          message: error.response?.data?.message || "Failed to delete saving",
          // message: formatError(error),
          details: error.response?.data?.errors || {},
        };
      }
    }
  
    
    async updateSaving(savingDataUpdate) {
      // Client-side validation
  
      try {
        console.log(savingDataUpdate);
        const response = await api.put(
          `/dash/saving/${savingDataUpdate.id}`,
          savingDataUpdate
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
          message: error.response?.data?.message || "Failed to update saving",
          // message: formatError(error),
          details: error.response?.data?.errors || {},
        };
      }
    }
}

export const savingService = new SavingService();
