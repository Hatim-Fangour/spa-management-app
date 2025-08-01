import { createAsyncThunk } from "@reduxjs/toolkit";
import { utilsService } from "../services/utilsService";
import { removeOptimisticNeed, removeOptimisticNote } from "../slices/utilsSlice";

// Thunk for add Expense
export const addNote = createAsyncThunk(
  "utils/addNote",
  async (noteData, { dispatch, rejectWithValue }) => {
    try {
    console.log(noteData)
      const response = await utilsService.addNote(noteData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Add note failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Note
export const deleteNote = createAsyncThunk(
  "utils/deleteNote",
  async (noteID, { dispatch, rejectWithValue }) => {
    try {
      // Format the data before sending
      // const formattedNote = {
      //   id: Date.now().toString(),
      //   type: "Expense",
      //   date: expenseData.date.format("DD/MM/YYYY"),
      //   amount: expenseData.amount,
      //   category: findTextByValue(
      //     ExpenseCategoryMenuItems,
      //     expenseData.category
      //   ),
      //   description: expenseData.description,
      //   payMethode: findTextByValue(
      //     PayementMethodMenuItems,
      //     expenseData.payMethode
      //   ),
      //   depServ: findTextByValue(DepServMenuItems, expenseData.depServ),
      //   notes: expenseData.notes,
      //   responsiblePerson: expenseData.responsiblePerson,
      //   status: findTextByValue(StatusMenuItems, expenseData.status),
      //   vendorSupplier: expenseData.vendorSupplier,
      //   recurring: findTextByValue(RecurringMenuItems, expenseData.recurring),
      // };

      // Optimistic update
      //   const tempId = `temp-${Date.now()}`;
      //   dispatch(expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: 'pending'
      //   }));

      const response = await utilsService.deleteNote(noteID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Delete note failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Note
export const updateNote = createAsyncThunk(
  "utils/updateNote",
  async (noteDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      
      const response = await utilsService.updateNote(noteDataUpdate);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Update note failed",
        name: error.name,
      });
    }
  }
);

// Thunk for add Need
export const addNeed = createAsyncThunk(
  "utils/addNeed",
  async (needData, { dispatch, rejectWithValue }) => {
    try {
      // Format the data before sending
      // const formattedNote = {
      //   id: Date.now().toString(),
      //   type: "Expense",
      //   date: expenseData.date.format("DD/MM/YYYY"),
      //   amount: expenseData.amount,
      //   category: findTextByValue(
      //     ExpenseCategoryMenuItems,
      //     expenseData.category
      //   ),
      //   description: expenseData.description,
      //   payMethode: findTextByValue(
      //     PayementMethodMenuItems,
      //     expenseData.payMethode
      //   ),
      //   depServ: findTextByValue(DepServMenuItems, expenseData.depServ),
      //   notes: expenseData.notes,
      //   responsiblePerson: expenseData.responsiblePerson,
      //   status: findTextByValue(StatusMenuItems, expenseData.status),
      //   vendorSupplier: expenseData.vendorSupplier,
      //   recurring: findTextByValue(RecurringMenuItems, expenseData.recurring),
      // };

      // Optimistic update
      //   const tempId = `temp-${Date.now()}`;
      //   dispatch(expenseAddedOptimistically({
      //     ...formattedExpense,
      //     id: tempId,
      //     _status: 'pending'
      //   }));

      const response = await utilsService.addNeed(needData);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNeed(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Add need failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Need
export const deleteNeed = createAsyncThunk(
  "utils/deleteNeed",
  async (needID, { dispatch, rejectWithValue }) => {
    try {
      // Format the data before sending
      // const formattedNote = {
      //   id: Date.now().toString(),
      //   type: "Expense",
      //   date: expenseData.date.format("DD/MM/YYYY"),
      //   amount: expenseData.amount,
      //   category: findTextByValue(
      //     ExpenseCategoryMenuItems,
      //     expenseData.category
      //   ),
      //   description: expenseData.description,
      //   payMethode: findTextByValue(
      //     PayementMethodMenuItems,
      //     expenseData.payMethode
      //   ),
      //   depServ: findTextByValue(DepServMenuItems, expenseData.depServ),
      //   notes: expenseData.notes,
      //   responsiblePerson: expenseData.responsiblePerson,
      //   status: findTextByValue(StatusMenuItems, expenseData.status),
      //   vendorSupplier: expenseData.vendorSupplier,
      //   recurring: findTextByValue(RecurringMenuItems, expenseData.recurring),
      // };

      // Optimistic update
    //   const tempId = `temp-${Date.now()}`;
    //   dispatch(expenseAddedOptimistically({
    //     ...formattedExpense,
    //     id: tempId,
    //     _status: 'pending'
    //   }));

      const response = await utilsService.deleteNeed(needID);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNote(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Delete need failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Need
export const updateNeed = createAsyncThunk(
  "utils/updateNeed",
  async (needDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      

      const response = await utilsService.updateNeed(needDataUpdate);
      return response.data;
      // console.log(res)
      // return res;
    } catch (error) {
      dispatch(removeOptimisticNeed(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "utils/unknown-error",
        message: error.message || "Update need failed",
        name: error.name,
      });
    }
  }
);