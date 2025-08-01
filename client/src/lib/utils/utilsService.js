import api from "../../services/api";
import { validateNote } from "../../utils/validators";

class UtilsService {
  async addNote(noteData) {
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
      const response = await api.post("/utils/note", noteData);

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
        message: error.response?.data?.message || "Failed to add note",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async deleteNote(noteID) {
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
      const response = await api.delete(`/utils/note/${noteID}`);

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
        message: error.response?.data?.message || "Failed to delete note",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updateNote(noteDataUpdate) {
    // Client-side validation

    try {
      console.log(noteDataUpdate);
      const response = await api.put(
        `/utils/note/${noteDataUpdate.id}`,
        noteDataUpdate
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
        message: error.response?.data?.message || "Failed to add note",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getNotes(filters = {}) {
    try {
      const response = await api.get("/notes", { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addNeed(needData) {
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
      const response = await api.post("/utils/need", needData);

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
        message: error.response?.data?.message || "Failed to add need",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async deleteNeed(needID) {
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
      const response = await api.delete(`/utils/need/${needID}`);

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
        message: error.response?.data?.message || "Failed to delete need",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updateNeed(needDataUpdate) {
    // Client-side validation

    try {
      console.log(needDataUpdate);
      const response = await api.put(
        `/utils/need/${needDataUpdate.id}`,
        needDataUpdate
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
        message: error.response?.data?.message || "Failed to add need",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }
}

export const utilsService = new UtilsService();
