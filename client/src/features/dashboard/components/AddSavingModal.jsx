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
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React, { forwardRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import dayjs from "dayjs";
import {
  CategoryMenuItems,
  DepositMethodMenuItems,
  PayementMethodMenuItems,
  SavingCategoryMenuItems,
  SavingStatusMenuItems,
  StatusMenuItems,
} from "../../../app/config";

const AddSavingModal = forwardRef((props, ref) => {
  const handleDateChange = (newDate) => {
    // setSelectedDate(newDate);
    props.setData({ ...props.data, date: newDate });
  };

  // Handle Input Change
  const handleSavingDataChange = (e) => {
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
  // const { errors = {} } = props;
  console.log(props.errors);

  const modalStyle = {
    justifyContent: "space-start",
    position: "absolute",
    // height: "100%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "864px" },
    height: { xs: "100%", sm: "600px" },
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: "30px",
  };
  return (
    <Paper
      sx={{
        ...modalStyle,
        display: "flex",
        flexDirection: "column",
        maxHeight: "90vh", // or whatever maximum height you want
      }}
    >
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
            {props.isEditMode ? "Update Saving" : "Add Saving"}
          </Typography>

          <IconButton onClick={props.handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
        >
          {props.isEditMode
            ? "Update your saving details."
            : "Create a new saving."}
        </Typography>
      </header>

      <main className="flex items-center justify-between  h-full w-full">
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
                onChange={handleSavingDataChange}
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
                    // setSelectedCategory(e.target.value);
                    handleSavingDataChange(e);
                  }}
                >
                  {SavingCategoryMenuItems.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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

          {/* Deposit Method */}
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
                error={!!props.errors?.details?.depoMethode}
                // helperText={props.errors?.details.depoMethode}
                sx={{
                  ".MuiOutlinedInput-notchedOutline": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              >
                <InputLabel>Deposit Method</InputLabel>
                <Select
                  value={props.data.depoMethode}
                  name="depoMethode"
                  label="Deposit Method"
                  onChange={(e) => {
                    // setSelectedCategory(e.target.value);
                    handleSavingDataChange(e);
                  }}
                >
                  {DepositMethodMenuItems.map((methode) => (
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

          {/* Responsible Person */}
          <Grid item xs={12} sm={4} size={6}>
            <div className="flex items-center w-full gap-6 ">
              <HowToRegOutlined
                sx={{
                  color: "#cab06d",
                }}
              />
              <TextField
                fullWidth
                label="Responsible Person"
                name="respoPerson"
                variant="outlined"
                value={props.data.respoPerson}
                onChange={handleSavingDataChange}
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
              />
            </div>
          </Grid>

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
                    handleSavingDataChange(e);
                  }}
                >
                  {SavingStatusMenuItems.map((item) => (
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
                onChange={handleSavingDataChange}
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

export default AddSavingModal;
