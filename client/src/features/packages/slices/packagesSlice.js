import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase-client";
import { servicesService } from "../services/packagesServices";
import {addPackage, addService, addSubservice, deletePackage, deleteService, deleteSubService, updatePackage, updateService, updateSubService} from "../thunks/packagesThunks";
// Initial state
const initialState = {
  services: [],
  baseServices: [],
  currentSubServices: [],
  subServices: null,
  packages: null,
  editMode: false,
  changes: {
    // Add section
    addedServices: [],
    addedSubServices: [],
    updatedServices: [],
    addedPackages: [],
    // update section
    updatedServices: [],
    updatedSubServices: [],
    updatedPackages: [],
    // delete section
    deletedServices: [],
    deletedSubServices: [],
    deletedPackages: [],
  },
};


// Real-time listener setup
export const setupServicesListeners = () => (dispatch) => {
  dispatch(setLoading(true));
  const unsubscribeServices = onSnapshot(
    collection(db, "services"),
    (snapshot) => {
      const services = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setServices(services));
      dispatch(setLoading(false));
    },
    (error) => {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
    }
  );

  // Return combined cleanup function
  return () => unsubscribeServices();
};
// Reducer function
const serviceSlice = createSlice({
  name: "services", // Name of the slice
  initialState, // Initial state

  reducers: {
    setLoading: (state, action) => {
      state.isloading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setInitialChanges: (state) => {
      state.changes = {
        // Add section
        ...state.changes,
        addedServices: [],
        addedSubServices: [],
        addedPackages: [],
        // updatedServices: [],
        deletedServices: [],
        deletedSubServices: [],
        deletedPackages: [],
      };
    },

    setServices: (state, action) => {
      state.services = action.payload;

      // Update subServices if currently viewing one
      if (state.subServices) {
        state.subServices = action.payload.find(
          (s) => s.id === state.subServices?.id
        );
      }
     
    },
    setBaseServices: (state, action) => {
      state.baseServices = action.payload;
    },

    setPackages: (state, action) => {
      console.log(action.payload.toString())
      if (action.payload)
        state.packages = state.subServices.content.find(
          (pkg) => pkg.id.toString() === action.payload.toString()
        );
      else state.packages = null;
    },

    serviceAddedOptimistically: (state, action) => {
      state.services.unshift(action.payload); // Add at beginning
    },

    serviceUpdatedWithId: (state, action) => {
      const index = state.services.findIndex(
        (srv) => srv.id === action.payload.tempId
      );
      if (index !== -1) {
        state.services[index] = {
          ...state.services[index],
          id: action.payload.realId,
          ...action.payload.updates,
        };
      }
    },

    serviceRemoveOptimistic: (state, action) => {
      state.services = state.services.filter(
        (srv) => srv.id !== action.payload
      );
    },

    subServiceAddedOptimistically: (state, action) => {
      const serviceIndex = state.services.findIndex(
        (service) => service.id === action.payload.serviceID
      );

      if (serviceIndex !== -1) {
        if (!state.services[serviceIndex].content) {
          state.services[serviceIndex].content = [];
        }
        state.services[serviceIndex].content.unshift(action.payload);
      }
    },

    subServiceUpdatedWithId: (state, action) => {
      const { tempId, realId, updates } = action.payload;

      // Find the service containing this subservice
      const serviceIndex = state.services.findIndex((service) =>
        service.content?.some((sub) => sub.id === tempId)
      );

      if (serviceIndex !== -1) {
        const subServiceIndex = state.services[serviceIndex].content.findIndex(
          (sub) => sub.id === tempId
        );

        if (subServiceIndex !== -1) {
          state.services[serviceIndex].content[subServiceIndex] = {
            ...state.services[serviceIndex].content[subServiceIndex],
            id: realId,
            ...updates,
          };
        }
      }
    },

    subServiceRemoveOptimistic: (state, action) => {
      const tempId = action.payload;

      // Find and remove the optimistic subservice
      state.services = state.services.map((service) => {
        if (service.content) {
          return {
            ...service,
            content: service.content.filter((sub) => sub.id !== tempId),
          };
        }
        return service;
      });
    },

    setSubServices: (state, action) => {
      //! clicking on Service

      state.subServices = state.services.find(
        (service) => service.id.toString() === action.payload.toString()
      );
      state.packages = null;
    },

    packageAddedOptimistically: (state, action) => {
    const { subServiceID, ...packageData } = action.payload;
    const serviceIndex = state.services.findIndex(
      service => service.id === state.subServices.id
    );
    
    if (serviceIndex !== -1) {
      const subServiceIndex = state.services[serviceIndex].content.findIndex(
        sub => sub.id === subServiceID
      );
      
      if (subServiceIndex !== -1) {
        if (!state.services[serviceIndex].content[subServiceIndex].pricingPlan) {
          state.services[serviceIndex].content[subServiceIndex].pricingPlan = [];
        }
        state.services[serviceIndex].content[subServiceIndex].pricingPlan.push(packageData);
      }
    }
  },
  
  packageUpdatedWithId: (state, action) => {
    const { tempId, realId, updates } = action.payload;
    
    // Find and update the package with the real ID
    state.services.forEach(service => {
      if (service.content) {
        service.content.forEach(subService => {
          if (subService.pricingPlan) {
            const pkgIndex = subService.pricingPlan.findIndex(pkg => pkg.id === tempId);
            if (pkgIndex !== -1) {
              subService.pricingPlan[pkgIndex] = {
                ...subService.pricingPlan[pkgIndex],
                id: realId,
                ...updates
              };
            }
          }
        });
      }
    });
  }

  },

  extraReducers: (builder) => {
    builder
      // ! add expense cases
      .addCase(addService.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addService.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Update Note cases
      .addCase(updateService.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
        // This is just for loading state management
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Service cases
      .addCase(deleteService.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      // ! add expense cases
      .addCase(addSubservice.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addSubservice.fulfilled, (state, action) => {
        state.isloading = false;
        state.error = null;
      })
      .addCase(addSubservice.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Update Note cases
      .addCase(updateSubService.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updateSubService.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
        // This is just for loading state management
      })
      .addCase(updateSubService.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Service cases
      .addCase(deleteSubService.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deleteSubService.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
      })
      .addCase(deleteSubService.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })

      // Delete Service cases
      .addCase(addPackage.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      // Delete Service cases
      .addCase(deletePackage.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      })
      // Delete Service cases
      .addCase(updatePackage.pending, (state) => {
        state.isloading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.isloading = false;
        // Service: The real-time listener will handle the actual state update
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isloading = false;
        state.error = action.payload;
      });
  },
});

// Create the Redux store
export const {
  setLoading,
  setError,
  setServices,
  setSubServices,
  setPackages,
  serviceAddedOptimistically,
  serviceUpdatedWithId,
  removeOptimisticService,
  subServiceAddedOptimistically,
  subServiceUpdatedWithId,
  subServiceRemoveOptimistic,
  packageAddedOptimistically,
  packageUpdatedWithId
} = serviceSlice.actions;

export default serviceSlice.reducer;
