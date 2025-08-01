// dataThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { customerService } from "../features/customers/services/customersService";
import { calendarService } from "../features/calendar/services/calendarService";
import { employeeService } from "../features/employees/services/employeesService";
import { setCustomers } from "../features/customers/slices/customersSlice";
import { setAppointments } from "../features/calendar/slices/calendarSlice";
import { setEmployees } from "../features/employees/slices/employeesSlice";
import { servicesService } from "../features/packages/services/packagesServices";
import { setServices } from "../features/packages/slices/packagesSlice";


export const loadAllData = createAsyncThunk(
  "data/loadAll",
  async (_, { dispatch }) => {
    try {
      // Your existing optimized fetch
      const [customersRes, appointmentsRes, employeesRes, serviceesRes] = await Promise.all([
        customerService.getCustomers(),
        calendarService.getAppointments(),
        employeeService.getEmployees(),
        servicesService.getServices()
      ]);

      // Validate responses
      if (!customersRes.success || !appointmentsRes.success || !employeesRes.success || !serviceesRes.success) {
        throw new Error('Partial data loading failure');
      }


       // Transform data if needed (e.g., normalize, filter)
      const customers = customersRes.data;
      const appointments = appointmentsRes.data;
      const employees = employeesRes.data;
      const servicees = serviceesRes.data;
      


     // Dispatch to slices
      dispatch(setCustomers(customers));
      dispatch(setAppointments(appointments));
      dispatch(setEmployees(employees));
      dispatch(setServices(servicees));

      return { 
        customers, 
        appointments, 
        employees,
        servicees,
        timestamp: Date.now() // Useful for caching
      };
    } catch (error) {
      console.error("Data loading failed:", error);
    //   dispatch(setError({
    //     message: error.message,
    //     code: error.code || 'DATA_LOAD_FAILED'
    //   }));
      throw error;
    }finally {
    //   dispatch(setLoading(false));
    }
  }
);
