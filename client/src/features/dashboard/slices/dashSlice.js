// client/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { expenseService } from "../../../lib/dash/expenseService";
import {
  DepositMethodMenuItems,
  DepServMenuItems,
  ExpenseCategoryMenuItems,
  IncomeCategoryMenuItems,
  IncomeEmployeeInvolvedItems,
  PayementMethodMenuItems,
  RecurringMenuItems,
  StatusMenuItems,
} from "../../../app/config";
import { incomeService } from "../../../lib/dash/incomeService";
import { savingService } from "../../../lib/dash/savingService";
import { useDispatch } from "react-redux";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";
import moment from "moment";
import { addExpense, addIncome, addSaving } from "../thunks/dashboardThunks";

const findTextByValue = (array, value) => {
  const item = array.find((item) => item.value === value);
  return item ? item.text : ""; // Default to 'Unknown' if not found
};
// Initial state
const initialState = {
  isloading: false,
  error: null,

  incomes: [],
  expenses: [],
  savings: [],
  statistics: {},
  followUp: {},
};

function isCurrentMonth(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  return (
    objectDate.getMonth() === currentDate.getMonth() &&
    objectDate.getFullYear() === currentDate.getFullYear()
  );
}

function isLastMonth(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  // Create a date for last month
  const lastMonth = new Date(currentDate);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  return (
    objectDate.getMonth() === lastMonth.getMonth() &&
    objectDate.getFullYear() === lastMonth.getFullYear()
  );
}

function isBeforeLastMonth(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  // Create a date for two months ago
  const twoMonthsAgo = new Date(currentDate);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  return (
    objectDate.getMonth() === twoMonthsAgo.getMonth() &&
    objectDate.getFullYear() === twoMonthsAgo.getFullYear()
  );
}

function isCurrentDay(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  return (
    objectDate.getDate() === currentDate.getDate() && // getDate() for day of month
    objectDate.getMonth() === currentDate.getMonth() &&
    objectDate.getFullYear() === currentDate.getFullYear()
  );
}

function isLastDay(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  // Create a date for last month
  const lastDay = new Date(currentDate);
  lastDay.setDate(lastDay.getDate() - 1);

  return (
    objectDate.getDate() === lastDay.getDate() && // getDate() for day of month
    objectDate.getMonth() === lastDay.getMonth() &&
    objectDate.getFullYear() === lastDay.getFullYear()
  );
}

function isBeforeLastDay(object) {
  // Parse DD/MM/YYYY format
  const [day, month, year] = object.date.split("/");
  const objectDate = new Date(`${year}-${month}-${day}`);
  const currentDate = new Date();

  // Create a date for two months ago
  const twoDayssAgo = new Date(currentDate);
  twoDayssAgo.setDate(twoDayssAgo.getDate() - 2);

  return (
    objectDate.getDate() === twoDayssAgo.getDate() &&
    objectDate.getMonth() === twoDayssAgo.getMonth() &&
    objectDate.getFullYear() === twoDayssAgo.getFullYear()
  );
}

const getStatistics = (dataInOut) => {
  // return [...incomesData, ...expensesData].reduce(
  return dataInOut.reduce(
    (result, transaction) => {
      const amount = parseFloat(transaction.amount) || 0;

      if (isCurrentDay(transaction)) {
        if (transaction.type === "income") {
          result.TDI += amount;
        }
        if (transaction.type === "expense") {
          result.TDE += amount;
        }
      }

      if (isLastDay(transaction)) {
        if (transaction.type === "income") {
          result.TotalLastDayIncome += amount;
        }
        if (transaction.type === "expense") {
          result.TotalLastDayExpense += amount;
        }
      }

      if (isBeforeLastDay(transaction)) {
        if (transaction.type === "income") {
          result.TotalBeforeLastDayIncome += amount;
        }
        if (transaction.type === "expense") {
          result.TotalBeforeLastDayExpense += amount;
        }
      }

      if (isCurrentMonth(transaction)) {
        if (transaction.type === "income") {
          result.TMI += amount;
        }
        if (transaction.type === "expense") {
          result.TME += amount;
        }
      }

      if (isLastMonth(transaction)) {
        if (transaction.type === "income") {
          result.TotalLastMonthIncome += amount;
        }
        if (transaction.type === "expense") {
          result.TotalLastMonthExpense += amount;
        }
      }

      if (isBeforeLastMonth(transaction)) {
        if (transaction.type === "income") {
          result.TotalBeforeLastMonthIncome += amount;
        }
        if (transaction.type === "expense") {
          result.TotalBeforeLastMonthExpense += amount;
        }
      }

      return result;
    },
    {
      TDI: 0,
      TDE: 0,
      TMI: 0,
      TME: 0,
      TotalLastDayExpense: 0,
      TotalLastDayIncome: 0,
      TotalBeforeLastDayExpense: 0,
      TotalBeforeLastDayIncome: 0,
      TotalLastMonthIncome: 0,
      TotalLastMonthExpense: 0,
      TotalBeforeLastMonthIncome: 0,
      TotalBeforeLastMonthExpense: 0,
    }
  );
};

function compareIncomes(
  TDI,
  TDE,
  TMI,
  TME,
  TotalLastDayExpense,
  TotalLastDayIncome,
  TotalBeforeLastDayExpense,
  TotalBeforeLastDayIncome,
  TotalLastMonthIncome,
  TotalLastMonthExpense,
  TotalBeforeLastMonthIncome,
  TotalBeforeLastMonthExpense
) {
  // 3. Calculate percentage change
  let PDI = 0;
  let PDE = 0;
  let PMI = 0;
  let PME = 0;

  if (TotalBeforeLastMonthIncome !== 0) {
    // Avoid division by zero
    PMI =
      ((TotalLastMonthIncome - TotalBeforeLastMonthIncome) /
        TotalBeforeLastMonthIncome) *
      100;
  }

  if (TotalBeforeLastMonthExpense !== 0) {
    // Avoid division by zero
    PME =
      ((TotalLastMonthExpense - TotalBeforeLastMonthExpense) /
        TotalBeforeLastMonthExpense) *
      100;
  }

  if (TotalBeforeLastDayIncome !== 0) {
    // Avoid division by zero
    PDI =
      ((TotalLastDayIncome - TotalBeforeLastDayIncome) /
        TotalBeforeLastDayIncome) *
      100;
  }

  if (TotalBeforeLastDayExpense !== 0) {
    // Avoid division by zero
    PDE =
      ((TotalLastDayExpense - TotalBeforeLastDayExpense) /
        TotalBeforeLastDayExpense) *
      100;

    console.log(TotalLastDayExpense, TotalBeforeLastDayExpense, PDE);
  }

  // Return results
  return {
    PDI: PDI.toFixed(1), // Rounded to 1 decimal places
    PDE: PDE.toFixed(1), // Rounded to 1 decimal places
    PMI: PMI.toFixed(1), // Rounded to 1 decimal places
    PME: PME.toFixed(1), // Rounded to 1 decimal places
  };
}

// Real-time listener setup
export const setupAllListeners = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribeExpenses = onSnapshot(
    collection(db, "expenses"),
    (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setExpenses(expenses));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );

  const unsubscribeIncomes = onSnapshot(
    collection(db, "incomes"),
    (snapshot) => {
      const incomes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setIncomes(incomes));
    },
    (error) => dispatch(setError(`Incomes error: ${error.message}`))
  );

  const unsubscribeSavings = onSnapshot(
    collection(db, "savings"),
    (snapshot) => {
      const savings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setSavings(savings));
    },
    (error) => dispatch(setError(`Savings error: ${error.message}`))
  );

  // Return combined cleanup function
  return () => {
    unsubscribeExpenses();
    unsubscribeIncomes();
    unsubscribeSavings();
  };
};

// Real-time listener setup
export const setupIncomesListener = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribe = onSnapshot(
    collection(db, "incomes"),
    (snapshot) => {
      const incomes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setIncomes(incomes));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );
  return unsubscribe;
};

// Real-time listener setup
export const setupSavingsListener = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribe = onSnapshot(
    collection(db, "savings"),
    (snapshot) => {
      const savings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setSavings(savings));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );
  return unsubscribe;
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      console.log(action.payload);
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.statistics = getStatistics([...state.incomes, ...state.expenses]);

      state.followUp = compareIncomes(...Object.values(state.statistics));
    },
    setIncomes: (state, action) => {
      state.incomes = action.payload;
      state.statistics = getStatistics([...state.incomes, ...state.expenses]);
      state.followUp = compareIncomes(...Object.values(state.statistics));
    },
    setSavings: (state, action) => {
      state.savings = action.payload;
    },

    expenseAddedOptimistically: (state, action) => {
      state.expenses.unshift(action.payload); // Add at beginning
      state.statistics = getStatistics([...state.incomes, ...state.expenses]);
      state.followUp = compareIncomes(...Object.values(state.statistics));
    },
    incomeAddedOptimistically: (state, action) => {
      state.incomes.unshift(action.payload); // Add at beginning
      state.statistics = getStatistics([...state.incomes, ...state.expenses]);
      state.followUp = compareIncomes(...Object.values(state.statistics));
    },
    savingAddedOptimistically: (state, action) => {
      state.savings.unshift(action.payload); // Add at beginning
    },

    expenseUpdatedWithId: (state, action) => {
      const index = state.expenses.findIndex(
        (exp) => exp.id === action.payload.tempId
      );
      if (index !== -1) {
        state.expenses[index] = {
          ...state.expenses[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    expenseRemoveOptimistic: (state, action) => {
      state.expenses = state.expenses.filter(
        (exp) => exp.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // ! add expense cases
      .addCase(addExpense.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isloading = false;
        state.error = null;
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
        console.log(action.payload);
      })
      // ! add Income cases
      .addCase(addIncome.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addIncome.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isloading = false;
        state.error = null;
      })
      .addCase(addIncome.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      // ! add Saving cases
      .addCase(addSaving.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addSaving.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isloading = false;
        state.error = null;
      })
      .addCase(addSaving.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
        console.log(action.payload);
      });
  },
});

export const {
  setLoading,
  setError,
  setExpenses,
  setIncomes,
  setSavings,
  expenseAddedOptimistically,
  incomeAddedOptimistically,
  savingAddedOptimistically,
  expenseConfirmed,
  removeOptimisticExpense,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
