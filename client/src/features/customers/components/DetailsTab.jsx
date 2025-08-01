import { Avatar, Box, Button, Grid, Stack, TextField } from "@mui/material";
import  { useContext } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { PhoneInput } from "react-international-phone";
import { CustomerContext } from "../../pages/Customers";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCustomer } from "../thunks/customersThunks";
import { validateCustomer } from "../../../utils/validators";
import { notifySuccess } from "../../utils/toastNotify";

const DetailsTab = () => {
  const dispatch = useDispatch();

  const { customer, onClose } = useContext(CustomerContext);

  const [customerData, setCustomerData] = useState(customer);
  const [countryid, setCountryid] = useState(null);
  const [stateid, setStateid] = useState(null);
  const [errors, setErrors] = useState({});


  const handleUpdateCustomerDetails = () => {
    try {
      const { isValid, errors } = validateCustomer(customerData);
      
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
    if (customerData.fullName && customerData.phone) {
      
      try {
        dispatch(
          updateCustomer({
            ...customerData,
            id: customerData.id,
          })
        );
         notifySuccess("Customer", "updated");
         onClose()
      } catch (error) {
        
      }
    }
  };

  const handleCustomerDataChange = (name, value) => {
    
    setCustomerData((prev) => ({
      ...prev, // ← Always gets the latest state
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // gap: 1,
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Grid
        container
        // spacing={2}
        height={"100%"}
        sx={{
          flex: 1,
        }}
      >
        <Grid size={4}>
          <div className="flex items-center justify-center">
            <Avatar src="./blankAvatar.jpg" sx={{ width: 120, height: 120 }} />
          </div>
        </Grid>

        <Grid size={8}>
          <Stack spacing={2}>
            <div className="flex flex-col gap-4">
              <span className="sectionTitle text-[#a58a47]">main details</span>

              <Stack spacing={1} className="ml-3">
                <Stack direction="row" className="grouper w-full flex gap-3">
                  <div className="entry w-full">
                    <TextField
                      id="standard-basic"
                      label="Full Name"
                      type="text"
                      name="fullName"
                      variant="outlined"
                      // value={customer.fullName}
                      value={customerData.fullName}
                      error={!!errors?.details?.fullName}
                      fullWidth
                      required
                      autoComplete="new-password"
                      onChange={(e) => {
                        handleCustomerDataChange(e.target.name, e.target.value);
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
                      value={customerData.companyName}
                      name="companyName"
                      fullWidth
                      onChange={(e) =>
                        handleCustomerDataChange(e.target.name, e.target.value)
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

                <Stack direction="row" className="grouper w-full flex gap-3">
                  <div className="entry w-full">
                    <PhoneInput
                      defaultCountry="us"
                      value={customerData.phone}
                      required
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
                      className="h-full"
                      inputStyle={{
                        width: "100%",
                        height: "100%",
                        // marginLeft :"10px",
                        borderLeft: "none",
                        fontSize: "15px",
                        borderRadius: "0 25px 25px 0",
                        borderColor: !!errors?.details?.phone
                          ? "#ff0000"
                          : "rgba(0, 0, 0, 0.23)",
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
                      value={customerData.email}
                      autoComplete="new-password"
                      fullWidth
                      onChange={(e) =>
                        handleCustomerDataChange(e.target.name, e.target.value)
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

            <div className="flex flex-col gap-3">
              <span className="sectionTitle text-[#a58a47]">address</span>
              <Stack spacing={1} className="ml-3">
                <div className="entry">
                  <CountrySelect
                    name="country"
                    containerClassName="border-[1px] rounded-[25px] border-[#c8c9cb]"
                    autoComplete="new-password"
                    defaultValue={customerData.country} // Controlled component= {customer.country}
                    onChange={(selectedCountry) => {
                      // Properly destructure the selected country object
                      
                      const { emoji, id, name } = selectedCountry;
                      const countryData = { emoji, id, name };
                      
                      // Update country
                      handleCustomerDataChange("country", countryData);
                      handleCustomerDataChange("state", {
                        id: "",
                        name: "",
                      });
                      handleCustomerDataChange("city", {
                        id: "",
                        name: "",
                      });

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
                    // {...(isEditMode
                    //   ? { defaultValue: newCustomer.state }
                    //   : { value: newCustomer.state })}
                    defaultValue={customerData.state}
                    onChange={(selectedState) => {
                      
                      const { id, name } = selectedState;
                      const stateData = { id, name };

                      handleCustomerDataChange("state", stateData);
                      handleCustomerDataChange("city", {
                        id: "",
                        name: "",
                      });

                      setStateid(selectedState.id);
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
                    // {...(isEditMode
                    //   ? { defaultValue: newCustomer.city }
                    //   : { value: newCustomer.city })}
                    defaultValue={customerData.city}
                    name="city"
                    onChange={(e) => {
                      handleCustomerDataChange("city", e);
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
                    value={customerData.address}
                    autoComplete="new-password"
                    type="text"
                    fullWidth
                    onChange={(e) => {
                      handleCustomerDataChange(e.target.name, e.target.value);
                    }}
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
          variant="outline"
          onClick={onClose}
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
          variant="contained"
          onClick={handleUpdateCustomerDetails}
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
          UPDATE
        </Button>
      </Box>
    </Box>
  );
};

export default DetailsTab;
