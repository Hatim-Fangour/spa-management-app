// import api from "../../../Services";
// import { validateAppointment } from "../../../utils/validators";
import api from "../../../services/api";
import { validateAppointment } from "../../../utils/validators";
// import { validateCustomer } from "../../../../utils/validators";

const calculateDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  // Clean formatting without extra spaces
  return `${diffHours}h ${diffMinutes}min`;
};

const getTitleByService = (appointment, concerned) => {
  let eventTitle = "";
  console.log(concerned);
  console.log(appointment);
  if (appointment.type === "Service") {
    eventTitle = `${concerned.fullName} - ${appointment?.reason?.name} / ${appointment?.room}`;
  }
  if (appointment.type === "Time Off") {
    eventTitle = `${`${concerned.details.firstName} ${concerned.details.lastName}`} - ${
      appointment?.reason?.name
    }`;
  }
  if (appointment.type === "Reminder") {
    eventTitle = "Reminder";
  }
  return eventTitle;
};

const parseDateTime = (dateStr, timeStr, allDay) => {
  const [day, month, year] = dateStr.split("/").map(Number); // Split and convert to numbers

  if (allDay) return new Date(year, month - 1, day);
  // JavaScript months are 0-indexed (0 = January, 1 = February, etc.)
  else {
    const [hours, minutes] = timeStr.split(":").map(Number); // Split and convert to numbers
    return new Date(year, month - 1, day, hours, minutes);
  }
};

const add15Minutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + 15);
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};
// Processing your appointment data
const processAppointment = (newAppointmentData, user) => {
  const { concerned, interval, note, ...restData } = newAppointmentData;

  const startDate = parseDateTime(
    interval.start.date,
    interval.start.time,
    interval.allDay
  );

  const endDate =
    newAppointmentData.type === "Service" ||
    newAppointmentData.type === "Time Off"
      ? parseDateTime(interval.end.date, interval.end.time, interval.allDay)
      : parseDateTime(
          interval.start.date,
          add15Minutes(interval.start.time),
          interval.allDay
        );

  const duration = calculateDuration(startDate, endDate);

  const newAddedAppointment = {
    ...restData,

    concerned: {
      // Service-specific fields
      ...(restData.type === "Service" && {
        id: concerned.id,
        address: concerned.address,
        email: concerned.email,
        fullName: concerned.fullName,
        phone: concerned.phone,
        services: concerned.services,
      }),
      ...(restData.type === "Time Off" && {
        id: concerned.id,
        fullName: `${concerned.details.firstName} ${concerned.details.lastName}`,
        phone: concerned.details.phone,
      }),
      ...(restData.type === "Reminder" && {
        id: user.uid,
        fullName: user.displayName,
      }),
    },
    interval: interval,
    duration: duration,
    title: getTitleByService(newAppointmentData, concerned),
    // title: `${concerned.fullName} - ${newAppointmentData?.reason?.name} / ${newAppointmentData?.room}`,
    start: new Date(startDate),
    end: new Date(endDate),
    allDay: interval.allDay,
    // desc: desc || "No description provided",
  };

  return newAddedAppointment;
};
class CalendarService {
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

  async addAppointment(appointmentData) {
    // Client-side validation
    // console.log(appointmentData)
    // const { isValid, errors } = validateAppointment(appointmentData);

    // // console.log(errors)
    // if (!isValid) {
    //   throw {
    //     code: 400,
    //     message: "Validation failed",
    //     details: errors,
    //   };
    // }
    try {
      // const processedAppointment = processAppointment(appointmentData, user);
      console.log(appointmentData);
      const response = await api.post(
        "/appointments/appointment",
        appointmentData
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
    }
  }

  async deleteAppointment(appointmentID) {
    // Client-side validation

    try {
      const response = await api.delete(
        `/appointments/appointment/${appointmentID}`
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
        message:
          error.response?.data?.message || "Failed to delete appointment",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async updateAppointment(appointmentDataUpdate) {
    // Client-side validation

    try {
      console.log(appointmentDataUpdate);
      const response = await api.put(
        `/appointments/appointment/${appointmentDataUpdate.id}`,
        appointmentDataUpdate
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
        message:
          error.response?.data?.message || "Failed to update appointment",
        // message: formatError(error),
        details: error.response?.data?.errors || {},
      };
    }
  }

  async getAppointments() {
    try {
      const response = await api.get("/Appointments");
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // async getCustomers(filters = {}) {
  //   try {
  //     const response = await api.get("/customers", { params: filters });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export const calendarService = new CalendarService();
