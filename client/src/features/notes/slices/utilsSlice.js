import { createSlice } from "@reduxjs/toolkit";


import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";
import { addNeed, addNote, deleteNeed, deleteNote, updateNeed, updateNote } from "../utilsThunks/utilsThunks";

// Initial state
const initialState = {
  isloading: false,
  error: null,

  notes: [],
  needs: [],
};


// Real-time listener setup
export const setupAllUtilsListeners = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribeNotes = onSnapshot(
    collection(db, "notes"),
    (snapshot) => {
      const notes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setNotes(notes));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );
  const unsubscribeNeeds = onSnapshot(
    collection(db, "needs"),
    (snapshot) => {
      const needs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setNeeds(needs));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );

  // Return combined cleanup function
  return () => {
    unsubscribeNotes();
    unsubscribeNeeds();
  };
};

const notesSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setNeeds: (state, action) => {
      state.needs = action.payload;
    },

    noteAddedOptimistically: (state, action) => {
      state.notes.unshift(action.payload); // Add at beginning
    },

    needAddedOptimistically: (state, action) => {
      state.needs.unshift(action.payload); // Add at beginning
    },

    noteUpdatedWithId: (state, action) => {
      const index = state.notes.findIndex(
        (nt) => nt.id === action.payload.tempId
      );
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    needUpdatedWithId: (state, action) => {
      const index = state.needs.findIndex(
        (nd) => nd.id === action.payload.tempId
      );
      if (index !== -1) {
        state.needs[index] = {
          ...state.needs[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    // needRemoveOptimistic: (state, action) => {
    //   state.needs = state.needs.filter(
    //     (nd) => nd.id !== action.payload
    //   );
    // },

    removeOptimisticNote: (state, action) => {
      state.notes = state.notes.filter((nt) => nt.id !== action.payload);
    },

    removeOptimisticNeed: (state, action) => {
      state.needs = state.needs.filter((nd) => nd.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // ! add notes cases
      .addCase(addNote.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Update Note cases
      .addCase(updateNote.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.isloading = false;
        // Note: The real-time listener will handle the actual state update
        // This is just for loading state management
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Note cases
      .addCase(deleteNote.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.isloading = false;
        // Note: The real-time listener will handle the actual state update
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // ! add Needs cases
      .addCase(addNeed.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addNeed.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addNeed.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })


      // Update Note cases
      .addCase(updateNeed.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updateNeed.fulfilled, (state, action) => {
        state.isloading = false;
        // Note: The real-time listener will handle the actual state update
        // This is just for loading state management
      })
      .addCase(updateNeed.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Note cases
      .addCase(deleteNeed.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteNeed.fulfilled, (state, action) => {
        state.isloading = false;
        // Note: The real-time listener will handle the actual state update
      })
      .addCase(deleteNeed.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
  },
});

export const {
  setLoading,
  setError,
  setNotes,
  noteAddedOptimistically,
  removeOptimisticNote,
  noteUpdatedWithId,
  setNeeds,
  needAddedOptimistically,
  removeOptimisticNeed,
  needUpdatedWithId,
} = notesSlice.actions;

export default notesSlice.reducer;
