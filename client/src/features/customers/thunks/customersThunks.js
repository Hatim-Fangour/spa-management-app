import { createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../services/customersService";
import { removeOptimisticCustomer } from "../slices/customersSlice";

export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customerData, { dispatch, rejectWithValue }) => {
    try {
      console.log(customerData)
      const response = await customerService.addCustomer(customerData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "customer/unknown-error",
        message: error.message || "Add customer failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customers/deleteCustomer",
  async (customerID, { dispatch, rejectWithValue }) => {
    try {
      
      const response = await customerService.deleteCustomer(customerID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "customers/unknown-error",
        message: error.message || "Delete customer failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Customer
export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (customerDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(customerDataUpdate);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "customers/unknown-error",
        message: error.message || "Update customer failed",
        name: error.name,
      });
    }
  }
);