import React, { useMemo, useEffect, useState, useRef } from "react";
import { Add, Close, Delete, Search, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { setupCustomersListeners } from "../customers/slices/customersSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "react-country-state-city/dist/react-country-state-city.css";
import { initCustomer } from "../../app/config";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DetailsTab from "../customers/components/DetailsTab";
import NotesTab from "../customers/components/NotesTab";
import AppointmentsTab from "../customers/components/AppointmentsTab";
import ServicesTab from "../customers/components/ServicesTab";
import {
  addCustomer,
  deleteCustomer,
  updateCustomer,
} from "../customers/thunks/customersThunks";
import { validateCustomer } from "../../utils/validators";
import { Toaster } from "react-hot-toast";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";
import { backdropStyle, modalStyle } from "../utils/styles";
import {
  getCustomerColumns,
  tabListStyles,
} from "../customers/utils/customersUtils";
import { notifySuccess } from "../utils/toastNotify";

export const CustomerContext = React.createContext();

const Customers = () => {
  const dispatch = useDispatch();

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState(initCustomer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState("1");
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [errors, setErrors] = useState({});

  const newCustomerRef = useRef(initCustomer);
  const customers = useSelector((state) => state.customers.customers);

  useEffect(() => {
    const unsubscribe = dispatch(setupCustomersListeners());
    return () => unsubscribe();
  }, [dispatch]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId(null);
  };

  const handleDeleteCustomer = useCallback(
    (params) => {
      setSelectedCustomerId(params.row.id);
      if (params.row.id) {
        setCustomerToDelete(params.row.id);
        setDeleteConfirmOpen(true);
      }
      handleMenuClose();
    },
    [selectedCustomerId, handleMenuClose]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setErrors({});
    setEditingCustomerId(null);
    setNewCustomer({
      // content: "", writer: "", priority: "medium", category: ""
    });
  }, []);

  const handleEditCustomer = useCallback(
    (params) => {
      setSelectedCustomerId(params.row.id);
      if (params.row.id) {
        const customerToEdit = customers.find(
          (customer) => customer.id === params.row.id
        );

        if (customerToEdit) {
          setNewCustomer(customerToEdit);
          setCustomerData(customerToEdit);
          setIsEditMode(true);
          setEditingCustomerId(params.row.id);
          setIsViewModalOpen(true);
        }
      }
      handleMenuClose();
    },
    [selectedCustomerId, customers, handleMenuClose]
  );

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const currentData = newCustomerRef.current; // Capture current value
    try {
      const { isValid, errors } = validateCustomer(currentData);

      if (!isValid) {
        throw {
          code: 400,
          message: "Validation failed",
          details: errors,
        };
      }
    } catch (error) {
      setErrors(error);
      return;
    }

    if (currentData.fullName && currentData.phone) {
      try {
        const customer = {
          id: Date.now().toString(),
          ...currentData,
        };

        // setSavingData(initSaving);
        await dispatch(addCustomer(customer)).unwrap();
        notifySuccess("Customer", "added");
      } catch (error) {
        if (error.payload?.type === "validation") {
          //   setErrors(error.payload.errors);
        } else {
          // General server error
          // notifyError(error.payload?.message || "Failed to add expense");
        }
      }
    }

    handleCloseModal();
    // }
  };

  const handleCustomerDataChange = (name, value) => {
    newCustomerRef.current = {
      ...newCustomerRef.current,
      [name]: value,
    };
  };

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setCustomerToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete));
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    }
  }, [customerToDelete]);

  const handelAddCustomer = () => {
    setNewCustomer({});
    setIsModalOpen(true);
  };

  const customersRows = customers.map((customer) => ({
    ...customer,
    id: customer.id,
    country: customer?.country?.name,
    state: customer?.state?.name,
    city: customer?.city?.name,
  }));

  const filteredCustomers = customersRows.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>

      <Box
        // className="min-h-screen bg-[#f8fffe] p-4 md:p-6 lg:p-8 overflow-auto"
        sx={{
          minHeight: "100vh",
          // bgcolor: "#f8fffe",
          overflow: "auto",
          backdropFilter: "blur(15px)",
          p: { xs: 2, md: 3, lg: 4 },
        }}
      >
        <div className="mx-auto max-w-7xl">
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { sm: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "400",
                    color: "#cab06d",
                    mb: 0.5,
                  }}
                >
                  Customers
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#cab06d", fontWeight: "300" }}
                >
                  Manage your customers
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  handelAddCustomer();
                }}
                sx={{
                  bgcolor: "#cab06d",
                  "&:hover": { bgcolor: "#9f874b" },
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  // boxShadow: "0 4px 12px #cab06d",
                }}
              >
                Add Customer
              </Button>
            </Box>
          </Box>

          {/*Search */}
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4} width={"40%"}>
                <TextField
                  placeholder="Search customers . . ."
                  variant="outlined"
                  size="medium"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    // width: "40%",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "#895700",
                      },
                      "&:hover fieldset": {
                        borderColor: "#cab06d",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#9ca3af" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* create new customer */}
          <Modal
            open={isModalOpen}
            onClose={(event, reason) => {
              if (reason !== "backdropClick") {
                setIsEditMode(false);
                setIsModalOpen(false);
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                style: backdropStyle,
              },
            }}
          >
            <Paper
              sx={{
                ...modalStyle,
                width: { xs: "90%", sm: "864px" },
                height: { xs: "100%", sm: "700px" },
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh", // or whatever maximum height you want
              }}
            >
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-[25px] mb-[10px]"
                    sx={{
                      fontSize: "25px",
                      marginBottom: "0",
                      color: "#cab06d",
                    }}
                  >
                    Add New Customer
                  </Typography>

                  <IconButton onClick={handleCloseModal} size="small">
                    <Close />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
                >
                  Create a new customer.
                </Typography>
              </div>

              <div className="flex justify-between flex-col flex-1">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <div className="flex items-center justify-center">
                        <Avatar
                          src="./blankAvatar.jpg"
                          sx={{ width: 120, height: 120 }}
                        />
                      </div>
                    </Grid>

                    <Grid size={8}>
                      <Stack spacing={4}>
                        <div className="flex flex-col gap-4">
                          <span className="sectionTitle text-[#a58a47]">
                            main details
                          </span>

                          <Stack spacing={2} className="ml-3">
                            <Stack
                              direction="row"
                              className="grouper w-full flex gap-3"
                            >
                              <div className="entry w-full">
                                <TextField
                                  id="standard-basic"
                                  label="Full Name"
                                  type="text"
                                  name="fullName"
                                  variant="outlined"
                                  value={newCustomer.fullName}
                                  error={!!errors?.details?.fullName}
                                  fullWidth
                                  required
                                  autoComplete="new-password"
                                  onChange={(e) => {
                                    handleCustomerDataChange(
                                      e.target.name,
                                      e.target.value
                                    );
                                    if (errors?.details?.fullName) {
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        details: {
                                          ...prevErrors.details,
                                          [e.target.name]: "",
                                        },
                                      }));
                                    }
                                  }}
                                  size="small"
                                  sx={{
                                    ".MuiInputBase-root": {
                                      borderRadius: "25px",
                                      width: "100%",
                                    },
                                  }}
                                />
                              </div>

                              <div className="entry w-full">
                                <TextField
                                  id="standard-basic"
                                  label="Company Name"
                                  autoComplete="new-password"
                                  type="text"
                                  value={newCustomer.companyName}
                                  name="companyName"
                                  fullWidth
                                  onChange={(e) =>
                                    handleCustomerDataChange(
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    ".MuiInputBase-root": {
                                      borderRadius: "25px",
                                      width: "100%",
                                    },
                                  }}
                                />
                              </div>
                            </Stack>

                            <Stack
                              direction="row"
                              className="grouper w-full flex gap-3"
                            >
                              <div className="entry w-full">
                                <PhoneInput
                                  defaultCountry="us"
                                  value={newCustomer.phone}
                                  required
                                  className="h-full"
                                  name="phone"
                                  onChange={(e) => {
                                    handleCustomerDataChange("phone", e);
                                    if (errors?.details?.phone) {
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        details: {
                                          ...prevErrors.details,
                                          phone: "",
                                        },
                                      }));
                                    }
                                  }}
                                  inputStyle={{
                                    width: "100%",
                                    height: "100%",
                                    // marginLeft :"10px",
                                    borderLeft: "none",
                                    fontSize: "15px",
                                    borderRadius: "0 25px 25px 0",
                                    // borderColor: "rgba(0, 0, 0, 0.23)",
                                    borderColor: !!errors?.details?.phone
                                      ? "#ff0000"
                                      : "rgba(0, 0, 0, 0.23)",
                                    // borderColor: "#ff0000",
                                  }}
                                  countrySelectorStyleProps={{
                                    buttonStyle: {
                                      height: "100%",
                                      padding: "8px",
                                      backgroundColor: "transparent",
                                      borderRadius: "25px 0 0 25px",
                                      borderColor: !!errors?.details?.phone
                                        ? "#ff0000"
                                        : "rgba(0, 0, 0, 0.23)",
                                      borderRight: "none",
                                    },
                                    dropdownStyle: {
                                      width: "300px",
                                      borderRadius: "8px",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    },
                                    // ... other country selector styles
                                  }}
                                />
                              </div>

                              <div className="entry w-full">
                                <TextField
                                  id="standard-basic"
                                  label="Email"
                                  type="email"
                                  name="email"
                                  value={newCustomer.email}
                                  autoComplete="new-password"
                                  fullWidth
                                  onChange={(e) =>
                                    handleCustomerDataChange(
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    ".MuiInputBase-root": {
                                      borderRadius: "25px",
                                      width: "100%",
                                    },
                                  }}
                                />
                              </div>
                            </Stack>
                          </Stack>
                        </div>

                        <div className="flex flex-col gap-4">
                          <span className="sectionTitle text-[#a58a47]">
                            address
                          </span>
                          <Stack spacing={2} className="ml-3">
                            <div className="entry">
                              <CountrySelect
                                name="country"
                                containerClassName="border-[1px] rounded-[25px] border-[#c8c9cb]"
                                autoComplete="new-password"
                                {...(isEditMode
                                  ? { defaultValue: newCustomer.country }
                                  : { value: newCustomer.country })}
                                onChange={(selectedCountry) => {
                                  const { emoji, id, name } = selectedCountry;
                                  const countryData = { emoji, id, name };
                                  handleCustomerDataChange(
                                    "country",
                                    countryData
                                  );
                                  handleCustomerDataChange("state", {
                                    id: "",
                                    name: "",
                                  });
                                  handleCustomerDataChange("city", {
                                    id: "",
                                    name: "",
                                  });
                                  // setNewCustomer({
                                  //   ...newCustomer,
                                  //   country: (({ emoji, id, name }) => ({
                                  //     emoji,
                                  //     id,
                                  //     name,
                                  //   }))(e),
                                  // });
                                  setCountryid(selectedCountry.id);
                                }}
                                placeHolder="Select Country"
                                inputClassName="outline-0"
                              />
                            </div>

                            <div className="entry">
                              <StateSelect
                                containerClassName="border-[1px] rounded-[25px] border-[#c8c9cb]"
                                countryid={countryid}
                                autoComplete="new-password"
                                name="state"
                                {...(isEditMode
                                  ? { defaultValue: newCustomer.state }
                                  : { value: newCustomer.state })}
                                onChange={(selectedState) => {
                                  const { id, name } = selectedState;
                                  const stateData = { id, name };
                                  handleCustomerDataChange("state", stateData);

                                  handleCustomerDataChange("city", {
                                    id: "",
                                    name: "",
                                  });
                                  setstateid(selectedState.id);
                                }}
                                placeHolder="Select State"
                                inputClassName="outline-0"
                              />
                            </div>

                            <div className="entry">
                              <CitySelect
                                containerClassName="border-[1px] rounded-[25px] border-[#c8c9cb]"
                                countryid={countryid}
                                stateid={stateid}
                                autoComplete="new-password"
                                {...(isEditMode
                                  ? { defaultValue: newCustomer.city }
                                  : { value: newCustomer.city })}
                                name="city"
                                onChange={(selectedCity) => {
                                  const { id, name } = selectedCity;
                                  const cityData = { id, name };

                                  handleCustomerDataChange("city", cityData);
                                  // setNewCustomer({ ...newCustomer, city: e });
                                }}
                                placeHolder="Select City"
                                inputClassName="outline-0"
                              />
                            </div>

                            <div className="entry">
                              <TextField
                                id="standard-basic"
                                label="Address"
                                name="address"
                                value={newCustomer.address}
                                autoComplete="new-password"
                                type="text"
                                fullWidth
                                onChange={(e) =>
                                  handleCustomerDataChange(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                variant="outlined"
                                size="small"
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "25px",
                                    width: "100%",
                                  },
                                }}
                              />
                            </div>
                          </Stack>
                        </div>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 3,
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    sx={{
                      color: "#cab06d",
                      border: "1px solid #cab06d",
                      "&:hover": {
                        color: "#9f874b",
                        backgroundColor: "#cab06d3e",
                      },
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleAddCustomer}
                    variant="contained"
                    sx={{
                      bgcolor: "#cab06d",
                      "&:hover": {
                        bgcolor: "#9f874b",
                        boxShadow: "none",
                      },
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 1,
                      // px: 3,
                      // py: 1.5,
                      boxShadow: "none",
                    }}
                  >
                    ADD
                  </Button>
                </Box>
              </div>
            </Paper>
          </Modal>

          {/* Update customer */}
          <Modal
            open={isViewModalOpen}
            onClose={(event, reason) => {
              if (reason !== "backdropClick") {
                setIsEditMode(false);
                setIsViewModalOpen(false);
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                style: backdropStyle,
              },
            }}
          >
            <Paper
              sx={{
                ...modalStyle,
                width: { xs: "90%", sm: "864px" },
                height: { xs: "100%", sm: "700px" },
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh", // or whatever maximum height you want
              }}
            >
              <div>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    className="text-[25px] mb-[10px]"
                    sx={{
                      fontSize: "25px",
                      marginBottom: "0",
                      color: "#cab06d",
                    }}
                  >
                    {isEditMode ? "Edit Customer" : "Add New Customer"}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setIsEditMode(false);
                      setTabValue("1");
                    }}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
                >
                  Update the customer details.
                </Typography>
              </div>

              <div className="remainingHeight flex flex-col flex-1 justify-between">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    // gap: 1,
                    flex: 1,
                  }}
                >
                  <CustomerContext.Provider
                    value={{
                      customer: newCustomer,
                      onClose: () => {
                        setIsViewModalOpen(false);
                        setIsEditMode(false);
                        setTabValue("1");
                      },
                      // saveCustomerToFirebase,
                    }}
                  >
                    <TabContext value={tabValue}>
                      <Box sx={{ borderBottom: 1, borderColor: "#cab06d" }}>
                        <TabList
                          onChange={(event, newValue) => setTabValue(newValue)} // Directly here
                          aria-label="lab API tabs"
                          sx={tabListStyles}
                        >
                          <Tab label="details" value="1" />
                          <Tab label="notes" value="2" />
                          <Tab label="appointments" value="3" />
                          <Tab label="services" value="4" />
                        </TabList>
                      </Box>

                      <TabPanel
                        value="1"
                        sx={{
                          height: "100%",
                          p: "15px",
                        }}
                      >
                        <DetailsTab />
                      </TabPanel>

                      <TabPanel
                        value="2"
                        sx={{
                          height: "100%",
                          p: "15px",
                        }}
                      >
                        <NotesTab />
                      </TabPanel>

                      <TabPanel value="3">
                        <AppointmentsTab />
                      </TabPanel>

                      <TabPanel
                        value="4"
                        sx={{
                          height: "100%",
                          p: "15px",
                        }}
                      >
                        <ServicesTab />
                      </TabPanel>
                    </TabContext>
                  </CustomerContext.Provider>
                </Box>
              </div>
            </Paper>
          </Modal>

          {/* Delete Confirmation Dialog */}
          <DeleteConfirmDialog
            open={deleteConfirmOpen}
            onOpenChange={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title={`Delete Customer`}
            description="Are you sure you want to delete this customer ?"
          />

          <div className="customersContainer w-full h-full items-center flex flex-col">
            <div className="itemContent w-[100%] h-full pb-[40px] pt-[10px]">
              <div className="itemContent h-full ">
                <DataGrid
                  className="bg-transparent"
                  rows={filteredCustomers}
                  columns={getCustomerColumns(
                    handleEditCustomer,
                    handleDeleteCustomer
                  )}
                  pagination
                  disableRowSelectionOnClick
                  // disableColumnMenu
                  disableColumnSelector
                  // disableDensitySelector
                  disableSelectionOnClick // Prevents auto-scroll when selecting a row
                  disableVirtualization={false} // ✅ Keep virtualization ENABLED (better performance)
                  sx={{
                    backgroundColor: "transparent",

                    "& .MuiDataGrid-columnHeader ": {
                      backgroundColor: "#ffe49f4f",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default Customers;
