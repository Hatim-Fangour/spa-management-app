import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { employeeService } from "../services/employeesService";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";

// Helper functions for data validation
const isValidEmployee = (employee) => {
  return employee && typeof employee === "object" && employee.id;
};

// const isValidCustomersArray = (customers) => {
//   return Array.isArray(customers) && customers.every(isValidCustomer);
// };

// Initial state
const initialState = {
  isloading: false,
  error: null,

  employees: [],
  users: [],
  cache: {
    status: "fresh", // 'fresh', 'stale', 'expired'
    version: 1,
  },
};

export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (employeeData, { dispatch, rejectWithValue }) => {
    try {
      const response = await employeeService.addEmployee(employeeData);
      return response.data;
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticCustomer(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "employee/unknown-error",
        message: error.message || "Add employee failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Delete Employee
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeID, { dispatch, rejectWithValue }) => {
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

      const response = await employeeService.deleteEmployee(employeeID);
      return response.data;
      // return res;
    } catch (error) {
      // dispatch(removeOptimisticEmployee(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "employees/unknown-error",
        message: error.message || "Delete employee failed",
        name: error.name,
      });
    }
  }
);

// Thunk for Update Employee
export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (employeeDataUpdate, { dispatch, rejectWithValue }) => {
    try {
      const response = await employeeService.updateEmployee(employeeDataUpdate);
      return response.data;

      // return res;
    } catch (error) {
      // dispatch(removeOptimisticEmployee(`temp-${Date.now()}`));
      // Ensure the error reaches the rejected case
      return rejectWithValue({
        code: error.code || "employees/unknown-error",
        message: error.message || "Update employee failed",
        name: error.name,
      });
    }
  }
);

// Real-time listener setup
export const setupEmployeesListeners = () => (dispatch) => {
  dispatch(setLoading(true));

  const unsubscribeEmployees = onSnapshot(
    collection(db, "employees"),
    (snapshot) => {
      const employees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(setEmployees(employees));
    },
    (error) => {
      dispatch(setError(error.message));
    }
  );

  // User collection listener
  const unsubscribeUsers = onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setUsers(users)); // Make sure you have this action creator
    },
    (error) => {
      dispatch(setError(error.message));
    }
  );

  // Set loading to false after initial data load
  const timeoutId = setTimeout(() => {
    dispatch(setLoading(false));
  }, 500); // Small delay to prevent flickering

  // Return combined cleanup function
  // Return combined cleanup function
  return () => {
    clearTimeout(timeoutId);
    unsubscribeEmployees();
    unsubscribeUsers();
  };
};
// Reducer function
const employeeSlice = createSlice({
  name: "employees", // Name of the slice
  initialState, // Initial state

  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    employeeAddedOptimistically: (state, action) => {
      state.employees.unshift(action.payload); // Add at beginning
    },

    // employeeUpdatedWithId: (state, action) => {
    //   const index = state.employees.findIndex(
    //     (cst) => cst.id === action.payload.tempId
    //   );
    //   if (index !== -1) {
    //     state.customers[index] = {
    //       ...state.customers[index],
    //       id: action.payload.realId,
    //       ...action.payload.updates,
    //     };
    //   }
    // },

    //   customerRemoveOptimistic: (state, action) => {
    //     state.customers = state.customers.filter(
    //       (cst) => cst.id !== action.payload
    //     );
    //   },
  },

  extraReducers: (builder) => {
    builder
      // ! add expense cases
      .addCase(addEmployee.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      });

    // Update Note cases
    // .addCase(updateCustomer.pending, (state) => {
    //   state.isloading = true;
    //   state.error = null;
    // })
    // .addCase(updateCustomer.fulfilled, (state, action) => {
    //   state.isloading = false;
    //   // Customer: The real-time listener will handle the actual state update
    //   // This is just for loading state management
    // })
    // .addCase(updateCustomer.rejected, (state, action) => {
    //   state.isloading = false;
    //   state.error = action.payload;
    // })

    // // Delete Customer cases
    // .addCase(deleteCustomer.pending, (state) => {
    //   state.isloading = true;
    //   state.error = null;
    // })
    // .addCase(deleteCustomer.fulfilled, (state, action) => {
    //   state.isloading = false;
    //   // Customer: The real-time listener will handle the actual state update
    // })
    // .addCase(deleteCustomer.rejected, (state, action) => {
    //   state.isloading = false;
    //   state.error = action.payload;
    // });
  },
});

// Create the Redux store
export const {
  setLoading,
  setError,
  setEmployees,
  setUsers,
  employeeAddedOptimistically,
  // employeeUpdatedWithId,
  // removeOptimisticEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
