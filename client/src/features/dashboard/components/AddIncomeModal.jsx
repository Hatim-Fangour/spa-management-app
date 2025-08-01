import {
  AttachMoney,
  CalendarMonth,
  Category,
  Close,
  CreditCardOutlined,
  DateRange,
  DesignServicesOutlined,
  EditNoteOutlined,
  HowToRegOutlined,
  LightbulbOutlined,
  LoopOutlined,
  RequestQuoteOutlined,
  SensorOccupiedOutlined,
} from "@mui/icons-material";

import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Grid,
  Select,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";

import { forwardRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import {
  IncomeCategoryMenuItems,
  IncomeEmployeeInvolvedItems,
  PayementMethodMenuItems,
  StatusMenuItems,
} from "../../../app/config";

const AddIncomeModal = forwardRef((props, ref) => {
  const handleDateChange = (newDate) => {
    props.setData({ ...props.data, date: newDate });
  };

  // Handle Input Change
  const handleIncomeDataChange = (e) => {
    props.setData({ ...props.data, [e.target.name]: e.target.value });
    // Remove error only for the field being updated
    props.setErrors((prevErrors) => ({
      ...prevErrors,

      details: {
        ...prevErrors.details, // Keep other errors in `expense`
        [e.target.name]: "", // Clear only the error for the field being updated
      },
    }));
  };

  const modalStyle = {
    justifyContent: "space-start",
    position: "absolute",
    // height: "100%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "864px" },
    height: { xs: "100%", sm: "605px" },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: "30px",
  };

  console.log(props.isEditMode);
  return (
    <Paper
      sx={{
        ...modalStyle,
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh", // or whatever maximum height you want
      }}
    >
      {/* <div ref={ref}> */}
      <header>
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
            {props.isEditMode ? "Update Income" : "Add Income"}
          </Typography>

          <IconButton onClick={props.handleClose} size="small">
            <Close />
          </IconButton>

          {/* <div className="winTitle font-semibold ml-5 text-[25px]">
              Add Expense
            </div>
            <span className="closeIconContainer cursor-pointer flex items-center justify-center h-7 w-7 rounded-lg text-[20px] text-[#797979]">
              <Close
                className="closeIcon text-[18px] hover:bg-[#c7c7c7]"
                onClick={props.handleClose}
              />
            </span> */}
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
        >
          {props.isEditMode
            ? "Update income details in your dashboard."
            : "Create a new income in your dashboard."}
        </Typography>
      </header>

      <main className="flex justify-between flex-col flex-1">
        <Grid container spacing={4}>
          {/* Date */}
          <Grid item xs={12} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <CalendarMonth
                sx={{
                  color: "#cab06d",
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={dayjs(props.data.date, "DD/MM/YYYY")}
                  defaultValue={dayjs()}
                  onChange={handleDateChange}
                  sx={{
                    // backgroundColor :"red",
                    width: "100%",

                    ".MuiPickersInputBase-root": {
                      borderRadius: "25px",
                      width: "100%",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
          </Grid>
          {/* Amount */}
          <Grid item xs={12} sm={6} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <AttachMoney
                sx={{
                  color: "#cab06d",
                }}
              />
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                value={props.data.amount}
                error={!!props.errors?.details?.amount}
                // helperText={props.errors?.details.amount}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">$</InputAdornment>
                    ),
                  },
                }}
                onChange={handleIncomeDataChange}
                variant="outlined"
                required
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              />
            </div>
          </Grid>

          {/* category */}
          <Grid item xs={12} sm={6} size={6} spacing={3}>
            <div className="flex items-center w-full gap-6 ">
              <Category
                sx={{
                  color: "#cab06d",
                }}
              />
              <FormControl
                fullWidth
                required
                error={!!props.errors?.details?.category}
                // helperText={props.errors?.details.category}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={props.data.category}
                  name="category"
                  label="Category"
                  onChange={(e) => {
                    handleIncomeDataChange(e);
                  }}
                >
                  {IncomeCategoryMenuItems.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                          overflow: "hidden",
                          minWidth: 0,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {/* {category.icon} */}
                        {category.text}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>

          {/* Client Name */}
          <Grid item xs={12} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <HowToRegOutlined
                sx={{
                  color: "#cab06d",
                }}
              />

              <TextField
                fullWidth
                label="Client Name"
                name="vendorSupplier"
                value={props.data.vendorSupplier}
                onChange={handleIncomeDataChange}
                variant="outlined"
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              />
            </div>
          </Grid>

          {/* payment methode */}
          <Grid item xs={12} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <CreditCardOutlined
                sx={{
                  color: "#cab06d",
                }}
              />

              <FormControl
                fullWidth
                required
                error={!!props.errors?.details?.payMethode}
                // helperText={props.errors?.details.payMethode}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              >
                <InputLabel>Payment Methode</InputLabel>
                <Select
                  value={props.data.payMethode}
                  name="payMethode"
                  label="Payment Methode"
                  onChange={(e) => {
                    // setSelectedCategory(e.target.value);
                    handleIncomeDataChange(e);
                  }}
                >
                  {PayementMethodMenuItems.map((methode) => (
                    <MenuItem key={methode.value} value={methode.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* {methode.icon} */}
                        {methode.text}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>

          {/* Employee Involved */}
          {/* <Grid item xs={12} sm={4} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <SensorOccupiedOutlined sx={{
                color:"#cab06d"
              }} />
              <TextField
                fullWidth
                label="Employee Involved"
                name="employeeInvolved"
                variant="outlined"
                value={props.data.employeeInvolved}
                onChange={handleExpenseDataChange}
                required
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              />
            </div>
          </Grid> */}

          {/* Status */}
          <Grid item xs={12} sm={6} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <RequestQuoteOutlined
                sx={{
                  color: "#cab06d",
                }}
              />
              <FormControl
                fullWidth
                required
                error={!!props.errors?.details?.status}
                // helperText={props.errors?.details.status}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={props.data.status}
                  name="status"
                  label="Status"
                  onChange={(e) => {
                    // setSelectedCategory(e.target.value);
                    handleIncomeDataChange(e);
                  }}
                >
                  {StatusMenuItems.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {/* {item.icon} */}
                        {item.text}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6} size={12}>
            <div className="flex items-center w-full gap-6 ">
              <EditNoteOutlined
                sx={{
                  color: "#cab06d",
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                name="notes"
                variant="outlined"
                value={props.data.notes}
                onChange={handleIncomeDataChange}
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              />
            </div>
          </Grid>
        </Grid>
      </main>
      {/* buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 4,
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="button"
          onClick={props.handleClose}
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
          onClick={props.handleSubmit}
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
          {props.isEditMode ? "UPDATE" : "ADD"}
        </Button>
      </Box>
    </Paper>
  );
});

export default AddIncomeModal;
