import {  createSlice } from "@reduxjs/toolkit";
import { customerService } from "../services/customersService";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";
import { addCustomer, deleteCustomer, updateCustomer } from "../thunks/customersThunks";

// Helper functions for data validation
const isValidCustomer = (customer) => {
  return customer && typeof customer === "object" && customer.id;
};

const isValidCustomersArray = (customers) => {
  return Array.isArray(customers) && customers.every(isValidCustomer);
};

// Initial state
const initialState = {
  isloading: false,
  error: null,

  viewedCustomer: {},
  customers: [],
  customersRowTableReduce: [],
  cache: {
    status: "fresh", // 'fresh', 'stale', 'expired'
    version: 1,
  },
};



// Real-time listener setup
export const setupCustomersListeners = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribeCustomers = onSnapshot(
    collection(db, "customers"),
    (snapshot) => {
      const customers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setCustomers(customers));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );

  // Return combined cleanup function
  return () => unsubscribeCustomers();
};
// Reducer function
const customerSlice = createSlice({
  name: "customers", // Name of the slice
  initialState, // Initial state

  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },

    customerAddedOptimistically: (state, action) => {
      state.customers.unshift(action.payload); // Add at beginning
    },

    customerUpdatedWithId: (state, action) => {
      const index = state.customers.findIndex(
        (cst) => cst.id === action.payload.tempId
      );
      if (index !== -1) {
        state.customers[index] = {
          ...state.customers[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    customerRemoveOptimistic: (state, action) => {
      state.customers = state.customers.filter(
        (cst) => cst.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // ! add expense cases
      .addCase(addCustomer.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Update Note cases
      .addCase(updateCustomer.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
        // Customer: The real-time listener will handle the actual state update
        // This is just for loading state management
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Customer cases
      .addCase(deleteCustomer.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isloading = false;
        // Customer: The real-time listener will handle the actual state update
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      });
  },
});

//Selecetors
export const selectAllCustomers = (state) => state.customers.allCustomersReduce;
export const selectViewedCustomer = (state) => state.customers.viewedCustomer;
export const selectCustomersRowTableReduce = (state) =>
  state.customers.customersRowTableReduce;

// Create the Redux store
export const {
  setLoading,
  setError,
  setCustomers,
  setViewedCustomer,
  setCustomersRowTableReduce,
  customerAddedOptimistically,
  customerUpdatedWithId,
  removeOptimisticCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;
