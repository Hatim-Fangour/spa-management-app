import { createAsyncThunk } from "@reduxjs/toolkit";
import { calendarService } from "../services/calendarService";

export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (appointmentData, { dispatch, rejectWithValue, getState  }) => {
    try {
            const { auth } = getState();
      const user = auth.user;

      // console.log(user)
      console.log(appointmentData);
      const response = await calendarService.addAppointment({
        ...appointmentData,
        id: Date.now().toString(),
      });
      console.log(response);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",
  async (appointmentsID, { dispatch, rejectWithValue }) => {
    try {
     

      const response = await calendarService.deleteAppointment(appointmentsID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "customers/unknown-error",
        message: error.message || "Delete customer failed",
        name: error.name,
      });
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async (appointmentDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      console.log(appointmentDataUpdate);
      const response = await calendarService.updateAppointment(
        appointmentDataUpdate
      );
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "appointments/unknown-error",
        message: error.message || "Update appointment failed",
        name: error.name,
      });
    }
  }
);

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
