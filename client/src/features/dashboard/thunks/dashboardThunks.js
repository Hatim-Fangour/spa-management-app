
import { createAsyncThunk } from "@reduxjs/toolkit";
import { expenseService } from "../../../lib/dash/expenseService";
import { incomeService } from "../../../lib/dash/incomeService";
import { savingService } from "../../../lib/dash/savingService";
import { incomeAddedOptimistically, savingAddedOptimistically } from "../slices/dashSlice";

// Thunk for add Expense
export const addExpense = createAsyncThunk(
  "dashboard/addExpense",
  async (expenseData, { dispatch, rejectWithValue }) => {
    try {
      // Format the data before sending
      const formattedExpense = {
        ...expenseData,
        id: Date.now().toString(),
        type: "expense",
        date: expenseData.date.format("DD/MM/YYYY"),
      };

      // Optimistic update
      // const tempId = `temp-${Date.now()}`;
      // dispatch(
      //   expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: "pending",
      //   })
      // );

      const response = await expenseService.addExpense(formattedExpense);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticExpense(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Add expense failed",
        details: error.details,
      });
    }
  }
);

// Thunk for Delete Expense
export const deleteExpense = createAsyncThunk(
  "dashboard/deleteExpense",
  async (expenseID, { dispatch, rejectWithValue }) => {
    try {
      const response = await expenseService.deleteExpense(expenseID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Delete expense failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Note
export const updateExpense = createAsyncThunk(
  "dashboard/updateExpense",
  async (expenseDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      console.log(expenseDataUpdate);

      const formattedExpense = {
        ...expenseDataUpdate,
        date:
          typeof expenseDataUpdate.date === "string"
            ? expenseDataUpdate.date // Keep as-is if it's already a string
            : expenseDataUpdate.date.format("DD/MM/YYYY"), // Format if it's a Moment object
      };

      console.log(formattedExpense);

      const response = await expenseService.updateExpense(formattedExpense);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      console.log(error);
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Update expense failed",
        name: error.name,
      });
    }
  }
);

export const addIncome = createAsyncThunk(
  "dashboard/addIncome",
  async (incomeData, { dispatch, rejectWithValue }) => {
    try {
      // Format the data before sending

      const formattedIncome = {
        ...incomeData,
        id: Date.now().toString(), // Optional unique ID
        type: "income",
        date: incomeData.date.format("DD/MM/YYYY"),
        amount: incomeData.amount,
      };

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      dispatch(
        incomeAddedOptimistically({
          ...formattedIncome,
          id: tempId,
          _status: "pending",
        })
      );

      const response = await incomeService.addIncome(formattedIncome);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Add income failed",
        details: error.details,
      });
    }
  }
);

// Thunk for Delete Expense
export const deleteIncome = createAsyncThunk(
  "dashboard/deleteIncome",
  async (incomeID, { dispatch, rejectWithValue }) => {
    try {
      const response = await incomeService.deleteIncome(incomeID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Delete income failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Note
export const updateIncome = createAsyncThunk(
  "dashboard/updateIncome",
  async (incomeDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const formattedIncome = {
        ...incomeDataUpdate,
        date:
          typeof incomeDataUpdate.date === "string"
            ? incomeDataUpdate.date // Keep as-is if it's already a string
            : incomeDataUpdate.date.format("DD/MM/YYYY"), // Format if it's a Moment object
      };

      const response = await incomeService.updateIncome(formattedIncome);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Update income failed",
        name: error.name,
      });
    }
  }
);

export const addSaving = createAsyncThunk(
  "dashboard/addSaving",
  async (savingData, { dispatch, rejectWithValue }) => {
    try {
      const formattedSaving = {
        ...savingData,
        id: Date.now().toString(), // Optional unique ID
        type: "saving",
        date: savingData.date.format("DD/MM/YYYY"),
      };

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      dispatch(
        savingAddedOptimistically({
          ...formattedSaving,
          id: tempId,
          _status: "pending",
        })
      );

      const response = await savingService.addSaving(formattedSaving);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      console.log(error);
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Add saving failed",
        details: error.details,
      });
    }
  }
);

export const deleteSaving = createAsyncThunk(
  "dashboard/deleteSaving",
  async (savingID, { dispatch, rejectWithValue }) => {
    try {
      const response = await savingService.deleteSaving(savingID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Delete saving failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Note
export const updateSaving = createAsyncThunk(
  "dashboard/updateSaving",
  async (savingDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const formattedSaving = {
        ...savingDataUpdate,
        date:
          typeof savingDataUpdate.date === "string"
            ? savingDataUpdate.date // Keep as-is if it's already a string
            : savingDataUpdate.date.format("DD/MM/YYYY"), // Format if it's a Moment object
      };

      const response = await savingService.updateSaving(formattedSaving);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "dash/unknown-error",
        message: error.message || "Update saving failed",
        name: error.name,
      });
    }
  }
);
