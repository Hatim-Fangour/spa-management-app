import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";

import { Views } from "react-big-calendar";
import moment from "moment/moment";
import { db } from "../../../services/firebase-client";
import { addAppointment } from "../thunks/calendarThunks";


// Initial state
const initialState = {
  isloading: false,
  error: null,
  appointments: [],
  todayAppointments: [],

  currentView: Views.MONTH,
  selectedEvent: null,
  selectedAppointment: null,
  events: [],

  cache: {
    status: "fresh", // 'fresh', 'stale', 'expired'
    version: 1,
  },
};

// Reducer function
const isToday = (dateString) => {
  const today = new Date(); // Get today's date
  const [day, month, year] = dateString.split("/"); // Split the date string into day, month, year

  // Create a Date object for the event date
  const eventDate = new Date(`${year}-${month}-${day}`);

  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
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

// Requires installing moment.js (not recommended for new projects)
const add15Minutes = (timeStr) => {
  return moment(timeStr, "HH:mm").add(15, "minutes").format("HH:mm");
};

export const updateAppointmentsWithDependencies = createAsyncThunk(
  "appointments/updateWithDeps",
  async (appointments, { getState }) => {
    const state = getState();
    return {
      appointments,
      customers: state.customers.customers,
      employees: state.employees.employees,
    };
  }
);

// Real-time listener setup
export const setupAppointmentsListeners = () => (dispatch, getState) => {
  dispatch(setLoading(true));
  const unsubscribeAppointments = onSnapshot(
    collection(db, "appointments"),
    (snapshot) => {
      const appointments = snapshot.docs.map((doc) => ({
        // id: doc.id,
        ...doc.data(),
      }));

      // dispatch(setAppointments(appointments));
      dispatch(updateAppointmentsWithDependencies(appointments));
      // Get current state after appointments are set
      const state = getState();
      const customers = state.customers.customers;
      const employees = state.employees.employees;

      console.log(customers, employees);
      // Transform and set events

      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );

  // Return combined cleanup function
  return () => unsubscribeAppointments();
};

// Reducer function
const appointmentSlice = createSlice({
  name: "appointments", // Name of the slice
  initialState, // Initial state

  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    setEvents: (state, action) => {
      state.events = action.payload;
      console.log(action.payload);
    },

    appointmentAddedOptimistically: (state, action) => {
      state.appointments.unshift(action.payload); // Add at beginning
    },

    appointmentUpdatedWithId: (state, action) => {
      const index = state.appointments.findIndex(
        (cst) => cst.id === action.payload.tempId
      );
      if (index !== -1) {
        state.appointments[index] = {
          ...state.appointments[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    appointmentRemoveOptimistic: (state, action) => {
      state.appointments = state.appointments.filter(
        (apt) => apt.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // ! add expense cases
      .addCase(addAppointment.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.isloading = false;
        console.log(action.payload);
        state.error = action.payload;
      })

      .addCase(
        updateAppointmentsWithDependencies.fulfilled,
        (state, action) => {
          const { appointments, customers, employees } = action.payload;

          state.appointments = appointments;
          console.log(appointments);
          console.log(customers);
          state.events = appointments.map((appointment) => {
            console.log(appointment);
            let concernedOne = null;
            if (appointment.type === "Service") {
              concernedOne = customers.find(
                (customer) => customer?.id === appointment?.concerned.id
              );
            } else if (appointment.type === "Time Off") {
              concernedOne = employees.find(
                (employee) => employee?.id === appointment?.concerned.id
              );
            }
            console.log(concernedOne);
            return {
              ...appointment,
              // concerned: concernedOne ? concernedOne : "Reminder",
              // type: appointment?.type || appointment.type,
              // note: appointment?.note || appointment.note,
              // title: getTitleByService(appointment, concernedOne),
              //   appointment.type === "Service" ||
              //   appointment.type === "Time Off"
              //     ? `${concernedOne ? concernedOne.fullName : "Unknown"} - ${
              //         appointment?.reason?.name
              //       } ${appointment?.room ? `/ ${appointment?.room}` : ""}`
              //     : "Reminder",

              start: parseDateTime(
                appointment.interval.start.date,
                appointment.interval.start.time,
                appointment.interval.allDay
              ),
              end:
                appointment.type === "Service" ||
                appointment.type === "Time Off"
                  ? parseDateTime(
                      appointment.interval.end.date,
                      appointment.interval.end.time,
                      appointment.interval.allDay
                    )
                  : parseDateTime(
                      appointment.interval.start.date,
                      add15Minutes(appointment.interval.start.time),
                      appointment.interval.allDay
                    ),
              // allDay: appointment.interval.allDay,
            };
          });
        }
      );
  },
});

// Create the Redux store
export const {
  setLoading,
  setError,
  setAppointments,
  setEvents,

  appointmentAddedOptimistically,
  appointmentUpdatedWithId,
  removeOptimisticAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
