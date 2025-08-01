// ``` Create an async thunk for login
//  This function will handle the login process
//  It will send a POST request to the server with the user credentials
//  The server will return the user data if the login is successful
//  If the login is unsuccessful, it will return an error message
//  The async thunk will handle the pending, fulfilled, and rejected states of the login action
//  The pending state will set the isloading state to true and the error state to null
//  The fulfilled state will set the isloading state to false and the user state to the payload of the action
//  The rejected state will set the isloading state to false and the error state to the payload of the action
//  The login action will be dispatched when the user logs in
//  The login action will be dispatched when the user clicks the login button
//  The login action will be dispatched when the user is logged in
//  The login action will be dispatched when the user is logged in successfully
//  The login action will be dispatched when the user is logged in unsuccessfully
//  The login action will be dispatched when the user is logged in with the wrong credentials
//  The login action will be dispatched when the user is logged in with the wrong email or password
//  ```;

import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { customerService } from "../../customers/services/customersService";
import { calendarService } from "../../calendar/services/calendarService";
import { employeeService } from "../../employees/services/employeesService";

// Thunk for Login
export const loginUser = createAsyncThunk(
  "auth/auth",
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const authData = await authService.login(loginCredentials);
      

      if (authData.user.role !== 111) {
        // 4. Fetch ALL data in parallel (optimized)
        const [customers, appointments, employees] = await Promise.all([
          customerService.getCustomers(), // Uses your existing GET /customers
          calendarService.getAppointments(), // Uses GET /appointments
          employeeService.getEmployees(), // Uses GET /employees
        ]);
        return {
          auth: authData, // { customClaims, token, user }
          customers,
          appointments,
          employees,
        };
      }
      
            return {
        auth: authData, // { customClaims, token, user }
      };
    } catch (error) {
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "auth/unknown-error",
        message: error.message || "Authentication failed",
        name: error.name,
      });
    }
  }
);

export const googleSignIn = createAsyncThunk(
  "auth/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      // 1. Authenticate with Google via authService
      const authData = await authService.googleLogin();
      

        if (authData.user.role !== 111) {
        // 4. Fetch ALL data in parallel (optimized)
        const [customers, appointments, employees] = await Promise.all([
          customerService.getCustomers(), // Uses your existing GET /customers
          calendarService.getAppointments(), // Uses GET /appointments
          employeeService.getEmployees(), // Uses GET /employees
        ]);
        return {
          auth: authData, // { customClaims, token, user }
          customers,
          appointments,
          employees,
        };
      }

     

       return {
        auth: authData, // { customClaims, token, user }
      };
    } catch (error) {
      return rejectWithValue({
        code: error.code,
        message: error.message,
      });
    }
  }
);

// Thunk for Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (registerCredentials, { rejectWithValue }) => {
    try {
      
      const {email} = registerCredentials;
      // const response = await api.post("/verification/send-verification", {email});
      
      // return response
     

      return await authService.register(registerCredentials);
      // return 
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verify-token",
  async (token, { rejectWithValue }) => {
    try {
      return await authService.verifyToken(token);
    } catch (error) {
      return rejectWithValue(error.message || "Token verification failed");
    }
  }
);