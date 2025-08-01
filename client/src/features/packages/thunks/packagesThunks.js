import { createAsyncThunk } from "@reduxjs/toolkit";
import {servicesService} from "../../packages/services/packagesServices";
import { packageAddedOptimistically, packageUpdatedWithId, removeOptimisticService, subServiceAddedOptimistically, subServiceUpdatedWithId } from "../slices/packagesSlice";



export const addService = createAsyncThunk(
  "services/addService",
  async (serviceData, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesService.addService(serviceData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Add service failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Customer
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceID, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      //   const tempId = `temp-${Date.now()}`;
      //   dispatch(expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: 'pending'
      //   }));

      const response = await servicesService.deleteService(serviceID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Delete service failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Service
export const updateService = createAsyncThunk(
  "services/updateService",
  async (serviceDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesService.updateService(serviceDataUpdate);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "services/unknown-error",
        message: error.message || "Update service failed",
        name: error.name,
      });
    }
  }
);

export const addSubservice = createAsyncThunk(
  "services/addSubservice",
  async (subserviceData, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      dispatch(
        subServiceAddedOptimistically({
          ...subserviceData,
          id: tempId,
          _status: "pending",
        })
      );

      const response = await servicesService.addSubService(subserviceData);

      // Update with real ID when server responds
      dispatch(
        subServiceUpdatedWithId({
          tempId,
          realId: response.id,
          updates: { _status: "fulfilled" },
        })
      );

      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // Rollback optimistic update if failed
      //   dispatch(subServiceRemoveOptimistic(tempId));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Add sub-service failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Customer
export const deleteSubService = createAsyncThunk(
  "services/deleteSubservice",
  async (subServiceData, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      //   const tempId = `temp-${Date.now()}`;
      //   dispatch(expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: 'pending'
      //   }));

      console.log(subServiceData);

      const response = await servicesService.deleteSubService(subServiceData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      //   dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Delete sub-service failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Service
export const updateSubService = createAsyncThunk(
  "services/updateSubService",
  async (subServiceDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesService.updateSubService(
        subServiceDataUpdate
      );
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      //   dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "services/unknown-error",
        message: error.message || "Update sub-service failed",
        name: error.name,
      });
    }
  }
);

export const addPackage = createAsyncThunk(
  "services/addPackage",
  async (packageData, { dispatch, rejectWithValue }) => {
    try {
      console.log(packageData);
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      dispatch(
        packageAddedOptimistically({
          ...packageData,
          id: tempId,
          _status: "pending"
        })
      );

      const response = await servicesService.addPackage(packageData);

      // Update with real ID when server responds
      dispatch(
        packageUpdatedWithId({
          tempId,
          realId: response.id,
          updates: { _status: "fulfilled" }
        })
      );

      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // Rollback optimistic update if failed
      //   dispatch(PackageRemoveOptimistic(tempId));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Add package failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Customer
export const deletePackage = createAsyncThunk(
  "services/deletePackage",
  async (packageData, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      //   const tempId = `temp-${Date.now()}`;
      //   dispatch(expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: 'pending'
      //   }));

      console.log(packageData);

      const response = await servicesService.deletePackage(packageData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      //   dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "service/unknown-error",
        message: error.message || "Delete package failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Service
export const updatePackage = createAsyncThunk(
  "services/updatePackage",
  async (packageDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const response = await servicesService.updatePackage(
        packageDataUpdate
      );
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      //   dispatch(removeOptimisticService(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "services/unknown-error",
        message: error.message || "Update package failed",
        name: error.name,
      });
    }
  }
);