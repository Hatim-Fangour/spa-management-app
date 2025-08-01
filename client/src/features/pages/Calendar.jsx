import { useCallback, useEffect, useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IoAddOutline } from "react-icons/io5";
import "./CalendarPageStyle.scss";
import TodayEventCard from "../calendar/components/TodayEventCard";
import {
  AccessTime,
  AttachMoney,
  BedroomChildOutlined,
  Close,
  DeleteOutlined,
  EditOutlined,
  PersonOutlineOutlined,
  SafetyDividerOutlined,
  SelfImprovementOutlined,
  SpaOutlined,
  SubjectOutlined,
  TimerOutlined,
} from "@mui/icons-material";

import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Select,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { rooms, timeOffReasons } from "../../app/config";
import { useDispatch, useSelector } from "react-redux";
import { setupEmployeesListeners } from "../employees/slices/employeesSlice";
import { setupAppointmentsListeners } from "./../calendar/slices/calendarSlice";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Toaster } from "react-hot-toast";
import {
  addAppointment,
  deleteAppointment,
  updateAppointment,
} from "../calendar/thunks/calendarThunks";
import { validateAppointment } from "../../utils/validators";
import { ArrowRightFromLine } from "lucide-react";
import {
  add15MinutesToDate,
  appointmnetType,
  calculateDuration,
  calculateDurationInDays,
  eventPropGetter,
  formatedTodayDate,
  formats,
  getDaysRemaining,
  getTitleByService,
  initNewAppointmentData,
  initTimeSlots,
  isToday,
  parseDateTime,
  THERAPIST_ROLE_ID,
  localizer,
  processAppointment,
} from "../calendar/utils/calendarUtils";
import { backdropStyle, modalStyle } from "../utils/styles";
import { notifySuccess } from "../utils/toastNotify";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";


const CalendarPage = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.calendar.appointments);
  const employees = useSelector((state) => state.employees.employees);
  const events = useSelector((state) => state.calendar.events);
  const { user, claims } = useSelector((state) => state.auth);
  const err = useSelector((state) => state.calendar.error);

  const [timeSlots, setTimeSlots] = useState(initTimeSlots);

  const [newAppointmentData, setNewAppointmentData] = useState(
    initNewAppointmentData
  );

  const [appointmentDeleteDialogOpen, setAppointmentDeleteDialogOpen] =
    useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, left: 0 });
  const [appoitementModalOpen, setAppoitementModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const customers = useSelector((state) => state.customers.customers);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [startingTimeIndex, setStartingTimeIndex] = useState(0);
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const [errors, setErrors] = useState({});

  const todayEvents = appointments.filter((event) =>
    isToday(event.interval.start.date)
  );


  useEffect(() => {
    const unsubscribeEmployees = dispatch(setupEmployeesListeners());
    const unsubscribeAppointments = dispatch(setupAppointmentsListeners());

    return () => {
      unsubscribeEmployees();
      unsubscribeAppointments();
    };
  }, [dispatch, isEditMode]);

  useEffect(() => {
    if (selectedEvent) {
      const found = events.find((evnt) => evnt?.id === selectedEvent?.id);

      // Only update state if `found` is different from `selectedAppointment`
      if (found !== selectedAppointment) {
        setSelectedAppointment(found);
      }
    }
  }, [selectedEvent]); // Add dependencies

  const handleCloseAppointmentModal = () => {
    setNewAppointmentData(initNewAppointmentData);
    setAppoitementModalOpen(false);
    setIsEditMode(false);
  };

  const handleChange = (field, value) => {
    setNewAppointmentData((prev) => ({ ...prev, [field]: value }));
    if (value !== null) {
      setErrors((prevErrors) => ({
        ...prevErrors,

        details: {
          ...prevErrors.details, // Keep other errors in `expense`
          [field]: "", // Clear only the error for the field being updated
        },
      }));
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleClickAddAppointment = (event) => {
    setNewAppointmentData(initNewAppointmentData);
    setErrors({});
    setIsEditMode(false);
    setAppoitementModalOpen(true);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    setErrors({});
  };

  const handleDeleteAppointment = (appointmentContent) => {
    setAppointmentToDelete(appointmentContent);
    setAppointmentDeleteDialogOpen(true);
    // }
  };

  const confirmDeleteAppointment = useCallback(
    async (e) => {
      e.preventDefault();

      if (appointmentToDelete) {
        dispatch(deleteAppointment(appointmentToDelete.id));
        setAppointmentDeleteDialogOpen(false);
        setAppointmentToDelete(null);
        setIsPopoverOpen(false);
        setSelectedEvent(null);
      }
    },
    [appointmentToDelete]
  );

  const handleCancelDeleteAppointment = useCallback(() => {
    setAppointmentDeleteDialogOpen(false);
    setAppointmentToDelete(null);
  }, []);

  const handleAddOrUpdateAppointment = async (e) => {
    e.preventDefault();

    try {
      const { isValid, errors } = validateAppointment(newAppointmentData);

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

    if (isEditMode && editingAppointment?.id) {
      setEditingAppointment(null);
      setAppoitementModalOpen(false);
      const processedAppointment = processAppointment(newAppointmentData,user, isEditMode);

      dispatch(updateAppointment(processedAppointment));
      notifySuccess("Appointment", "updated");
      setIsEditMode(false);
      setNewAppointmentData(initNewAppointmentData);
      setIsPopoverOpen(false);
      setSelectedEvent(null);
    } else {
      try {
        const processedAppointment = processAppointment(newAppointmentData,user, isEditMode);

        // Wait for the dispatch to complete
        await dispatch(addAppointment(processedAppointment)).unwrap();
        notifySuccess("Appointment", "added");
        setAppoitementModalOpen(false);
        setNewAppointmentData(initNewAppointmentData);
      } catch (error) {
        setErrors(error);
        if (error.payload?.type === "validation") {
          //   setErrors(error.payload.errors);
        } else {
          // General server error
          // notifyError(error.payload?.message || "Failed to add expense");
        }
      }
    }
    // }

    // dispatch(setPackages(newAddedService));

    // setAppoitementDialogOpen(false);
  };

  const handleSelectEvent = (event, e) => {
    setSelectedEvent(event); // Dispatch the selected event to the Redux store
    setAnchorPosition({ top: e.clientY, left: e.clientX }); // Store the click coordinates
    setIsPopoverOpen(true); // Open the popover
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setSelectedEvent(null);
    setTabValue("1");
    setErrors({});
  };

  const handleEditAppointment = (appointment, e) => {
    e.stopPropagation();

    setErrors({});
    setNewAppointmentData(appointment);
    setIsEditMode(true);
    setEditingAppointment(appointment);
    setIsPopoverOpen(false);
    setAppoitementModalOpen(true);
    setSelectedEvent(null);
  };

  const therapists = employees
    .filter((employee) => employee.details.role === THERAPIST_ROLE_ID)
    .map((employee) => ({
      fullName: `${employee.details.firstName} ${employee.details.lastName}`,
    }));

    return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <Box
        sx={{
          minHeight: "100vh",
          // bgcolor: "#f8fffe",
          overflow: "auto",
          backdropFilter: "blur(15px)",
          p: { xs: 2, md: 3, lg: 4 },
          display: "flex",
        }}
      >
        <Modal
          open={appoitementModalOpen}
          // onClose={(event, reason) => {
          //   if (reason !== "backdropClick") {
          //     handleOpenExpenseModal();
          //   }
          // }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // className="absolute inset-0 bg-black/30 w-[550px] h-[600px] rounded-xl p-3 px-[15px] mx-auto my-auto"

          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              style: { ...backdropStyle, zIndex: 200 }, // zIndex matches default MUI modal
            },
          }}
        >
          <div tabIndex={0}>
            <Paper
              sx={{
                ...modalStyle,
                width: { xs: "90%", sm: "720px" },
                display: "flex",
                flexDirection: "column",
                zIndex: 400,
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
                    {isEditMode ? "Edit Appointment" : "Add New Appointment"}
                  </Typography>

                  <IconButton
                    onClick={handleCloseAppointmentModal}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
                >
                  {isEditMode
                    ? "Edit your calendar Appointment"
                    : "Add New Appointment to your calendar"}
                </Typography>
              </header>

              <main className="flex justify-between flex-col flex-1">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div className="premOptions flex flex-col gap-3">
                    <FormControl
                      fullWidth
                      size="small"
                      disabled={isEditMode}
                      sx={{
                        ".MuiInputBase-root": {
                          borderRadius: "30px",
                          width: "100%",
                        },
                      }}
                    >
                      <InputLabel>Appointment Type</InputLabel>
                      <Select
                        value={newAppointmentData?.type}
                        label="Appointment Type"
                        onChange={(e, value) => {
                          setNewAppointmentData({
                            ...initNewAppointmentData,
                            type: e.target.value,
                            concerned: null,
                            reason: null,
                          });

                          setErrors({});

                          if (e.target.value === "Time Off") {
                            setNewAppointmentData((prev) => ({
                              ...prev,
                              interval: {
                                ...prev.interval,
                                start: {
                                  ...prev.interval.start,
                                  time: dayjs("00:00", "HH:mm").format("HH:mm"),
                                },

                                end: {
                                  ...prev.interval.end,
                                  time: dayjs("00:00", "HH:mm").format("HH:mm"),
                                },
                              },
                            }));
                          }
                        }}
                      >
                        {appointmnetType
                          .filter((appType) => {
                            // If user is admin, show all options
                            if ([705].includes(claims)) return true;
                            // For non-admin users, filter out "Time Off"
                            return appType !== "Time Off";
                          })
                          .map((appType) => (
                            <MenuItem key={appType} value={appType}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {appType}
                              </Box>
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    <div className="appointmentDateTime flex items-center gap-3">
                      <div
                        className={`appointmentDates ${
                          newAppointmentData.type === "Time Off"
                            ? "flex w-full items-center gap-4"
                            : newAppointmentData.type === "Reminder"
                            ? "w-[100%]"
                            : " w-[30%]"
                        }`}
                      >
                        {/* // * this date we start from */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            format="DD/MM/YYYY"
                            // error={!!errors?.details?.startDate}
                            disabled={!newAppointmentData.type}
                            {...(isEditMode
                              ? {
                                  value: dayjs.isDayjs(
                                    newAppointmentData?.interval?.start?.date
                                  )
                                    ? newAppointmentData.interval.start.date
                                    : newAppointmentData?.interval?.start?.date
                                    ? dayjs(
                                        newAppointmentData.interval.start.date,
                                        "DD/MM/YYYY"
                                      )
                                    : dayjs(),
                                }
                              : {
                                  defaultValue: dayjs(),
                                })}
                            shouldDisableDate={(day) => {
                              return !day.isValid();
                            }}
                            slotProps={{
                              textField: {
                                error: !!errors?.details?.startDate,
                                // helperText: errors?.details?.startDate
                                //   ? "Invalid date"
                                //   : "",
                              },
                            }}
                            onChange={(newValue) => {
                              setNewAppointmentData((prev) => ({
                                ...prev,
                                interval: {
                                  ...prev.interval,
                                  start: {
                                    ...prev.interval.start,
                                    date: newValue?.format("DD/MM/YYYY"),
                                  },
                                  end: {
                                    ...prev.interval.end,
                                    date: newValue?.format("DD/MM/YYYY"),
                                  },
                                },
                              }));
                            }}
                            sx={{
                              // backgroundColor :"red",
                              width: "100%",

                              ".MuiPickersInputBase-root": {
                                borderRadius: "25px",
                                width: "100%",
                              },

                              ".MuiPickersSectionList-root": {
                                padding: "9px 0px",
                              },
                            }}
                          />
                        </LocalizationProvider>

                        {newAppointmentData.type === "Time Off" && (
                          <ArrowRightFromLine className="h-11 w-11" />
                        )}

                        {/* // * this date we go to */}
                        {newAppointmentData.type === "Time Off" && (
                          <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            className="!mt-2"
                          >
                            <DatePicker
                              format="DD/MM/YYYY" // Specify the display format
                              disabled={
                                !newAppointmentData.type ||
                                newAppointmentData.type !== "Time Off"
                              }
                              // disabled={true}
                              // defaultValue={dayjs()}

                              value={
                                dayjs(
                                  newAppointmentData.interval.end?.date,
                                  "DD/MM/YYYY"
                                )
                                  ? dayjs(
                                      newAppointmentData.interval.end?.date,
                                      "DD/MM/YYYY"
                                    )
                                  : null
                              }
                              minDate={
                                dayjs(
                                  newAppointmentData.interval.start?.date,
                                  "DD/MM/YYYY"
                                )
                                  ? dayjs(
                                      newAppointmentData.interval.start?.date,
                                      "DD/MM/YYYY"
                                    )
                                  : null
                              }
                              shouldDisableDate={(day) => {
                                return !day.isValid();
                              }}
                              slotProps={{
                                textField: {
                                  error: !!errors?.details?.endDate,
                                  // helperText: errors?.details?.startDate
                                  //   ? "Invalid date"
                                  //   : "",
                                },
                              }}
                              onChange={(newValue) => {
                                setNewAppointmentData((prev) => ({
                                  ...prev,
                                  interval: {
                                    ...prev.interval,
                                    end: {
                                      ...prev.interval.end,
                                      date: newValue?.format("DD/MM/YYYY"), // Update the specific field
                                    },
                                  },
                                }));
                              }}
                              sx={{
                                // backgroundColor :"red",
                                width: "100%",

                                ".MuiPickersInputBase-root": {
                                  borderRadius: "25px",
                                  width: "100%",
                                },

                                ".MuiPickersSectionList-root": {
                                  padding: "9px 0px",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        )}
                      </div>
                      {/* don't Show time slots for Time Off type keep only date start and end  */}
                      {!(newAppointmentData.type === "Time Off") && (
                        <div className="appointmentTimes flex justify-between gap-2 w-[90%]">
                          {/* show "From or At" time only in Service or Remindeer type */}
                          {!(newAppointmentData.type === "Time Off") && (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors?.details?.startTime}
                              disabled={
                                newAppointmentData?.interval?.allDay &&
                                newAppointmentData.type === "Time Off"
                              }
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "30px",
                                  width: "100%",
                                },
                              }}
                            >
                              <InputLabel>
                                {newAppointmentData.type === "Reminder"
                                  ? "At"
                                  : "From"}
                              </InputLabel>
                              <Select
                                value={
                                  newAppointmentData?.interval?.start?.time ||
                                  null
                                }
                                label={
                                  newAppointmentData.type === "Reminder"
                                    ? "At"
                                    : "From"
                                }
                                onChange={(e) => {
                                  setNewAppointmentData((prev) => ({
                                    ...prev,
                                    interval: {
                                      ...prev.interval,
                                      start: {
                                        ...prev.interval.start,
                                        time: dayjs(
                                          e.target.value,
                                          "HH:mm"
                                        ).format("HH:mm"),
                                      },
                                    },
                                  }));
                                  setStartingTimeIndex(
                                    timeSlots.indexOf(e.target.value)
                                  );

                                  setErrors((prevErrors) => ({
                                    ...prevErrors,

                                    details: {
                                      ...prevErrors.details, // Keep other errors in `expense`
                                      startTime: "", // Clear only the error for the field being updated
                                    },
                                  }));
                                }}
                              >
                                {timeSlots.map((timeSlot) => (
                                  <MenuItem key={timeSlot} value={timeSlot}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      {timeSlot}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}

                          {/* show "To" time only in service type */}
                          {newAppointmentData.type === "Service" && (
                            <FormControl
                              fullWidth
                              size="small"
                              error={!!errors?.details?.endTime}
                              disabled={
                                newAppointmentData?.interval?.allDay &&
                                newAppointmentData.type === "Time Off"
                              }
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "30px",
                                  width: "100%",
                                },
                              }}
                            >
                              <InputLabel>
                                {newAppointmentData.type === "Reminder"
                                  ? "At"
                                  : "To"}
                              </InputLabel>
                              <Select
                                value={
                                  newAppointmentData?.interval?.end?.time ||
                                  null
                                }
                                label={
                                  newAppointmentData.type === "Reminder"
                                    ? "Time"
                                    : "From"
                                }
                                onChange={(e) => {
                                  setNewAppointmentData((prev) => ({
                                    ...prev,
                                    interval: {
                                      ...prev.interval,
                                      end: {
                                        ...prev.interval.end,
                                        time: dayjs(
                                          e.target.value,
                                          "HH:mm"
                                        ).format("HH:mm"),
                                      },
                                    },
                                  }));
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,

                                    details: {
                                      ...prevErrors.details, // Keep other errors in `expense`
                                      endTime: "", // Clear only the error for the field being updated
                                    },
                                  }));
                                }}
                              >
                                {timeSlots
                                  .slice(startingTimeIndex + 1)
                                  .map((timeSlot) => (
                                    <MenuItem key={timeSlot} value={timeSlot}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        {timeSlot}
                                      </Box>
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>

                            // <LocalizationProvider dateAdapter={AdapterDayjs}>
                            //   <Autocomplete
                            //     options={timeSlots.slice(startingTimeIndex + 1)}
                            //     disableClearable
                            //     disabled={
                            //       newAppointmentData?.interval?.allDay ||
                            //       !newAppointmentData.type
                            //     }
                            //     value={
                            //       newAppointmentData?.interval?.end?.time || null
                            //     } // Use value instead of inputValue
                            //     getOptionLabel={(option) => option}
                            //     sx={{
                            //       width: "65%",
                            //     }}
                            //     renderInput={(params) => (
                            //       <TextField
                            //         {...params}
                            //         label="To"
                            //         required
                            //         error={!!err?.details?.endTime}
                            //         variant="outlined"
                            //         size="small"
                            //         sx={{
                            //           ".MuiInputBase-root": {
                            //             borderRadius: "25px",
                            //             width: "100%",
                            //           },
                            //         }}
                            //       />
                            //     )}
                            //     onChange={(e, value) => {
                            //       setNewAppointmentData((prev) => ({
                            //         ...prev,
                            //         interval: {
                            //           ...prev.interval,
                            //           end: {
                            //             ...prev.interval.end,
                            //             time: dayjs(value, "HH:mm").format(
                            //               "HH:mm"
                            //             ),
                            //           },
                            //         },
                            //       }));
                            //     }}
                            //   />
                            // </LocalizationProvider>
                          )}

                          {/* {newAppointmentData.type === "Time Off" && (
                          <FormControlLabel
                            className="allDayCheckBox w-[50%]"
                            control={
                              <Checkbox
                                disabled={
                                  !newAppointmentData.type ||
                                  newAppointmentData.type === "Reminder"
                                }
                                defaultChecked={
                                  newAppointmentData.interval.allDay
                                }
                                onChange={(e) => {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,

                                    details: {
                                      ...prevErrors.details, // Keep other errors in `expense`
                                      startTime: "", // Clear only the error for the field being updated
                                      endTime: "", // Clear only the error for the field being updated
                                    },
                                  }));
                                  setNewAppointmentData((prev) => ({
                                    ...prev,
                                    interval: {
                                      ...prev.interval,
                                      allDay: e.target.checked,
                                      start: {
                                        ...prev.interval.start,
                                        time: "",
                                      },
                                      end: {
                                        ...prev.interval.end,
                                        time: "",
                                      },
                                    },
                                  }));
                                }}
                              />
                            }
                            label="All day"
                          />
                        )} */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="serviceSection appointmentDetails flex flex-col gap-4">
                    {/* Concerned  */}
                    {(newAppointmentData.type === "Service" ||
                      newAppointmentData.type === "Time Off") && (
                      <Autocomplete
                        id="concerned-selector"
                        autoComplete
                        includeInputInList
                        error={!!errors?.details?.concerned}
                        disabled={!newAppointmentData.type || isEditMode}
                        options={
                          newAppointmentData.type === "Service"
                            ? customers
                            : newAppointmentData.type === "Time Off"
                            ? employees
                            : []
                        }
                        getOptionLabel={(option) => {
                          if (!option) return ""; // Handle null/undefined cases

                          // Customize label based on appointment type
                          switch (newAppointmentData.type) {
                            case "Service":
                              return option.fullName || ""; // Customer format
                            case "Time Off":
                              if (isEditMode)
                                return option.fullName || ""; // Customer format
                              else
                                return (
                                  `${option.details.firstName} ${option.details.lastName}` ||
                                  ""
                                ); // Employee format
                            default:
                              return "";
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        value={
                          newAppointmentData.type === "Service" ||
                          newAppointmentData.type === "Time Off"
                            ? newAppointmentData.concerned || null
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Concerned"
                            required
                            error={!!errors?.details?.concerned}
                            variant="outlined"
                            size="small"
                            sx={{
                              ".MuiInputBase-root": {
                                borderRadius: "25px",
                                width: "100%",
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => {
                          handleChange("concerned", value);
                          handleChange("reason", null); // Reset reason when concerned changes
                        }}
                      />
                    )}

                    {/* //* Available services OR Reason */}
                    {(newAppointmentData.type === "Service" ||
                      newAppointmentData.type === "Time Off") && (
                      // <FormControl
                      //   fullWidth
                      //   size="small"
                      //   disabled={!newAppointmentData.type}
                      //   sx={{
                      //     ".MuiInputBase-root": {
                      //       borderRadius: "30px",
                      //       width: "100%",
                      //     },
                      //   }}
                      // >
                      //   <InputLabel>
                      //     {newAppointmentData?.type === "Service"
                      //       ? "Available services"
                      //       : "Reason"}
                      //   </InputLabel>
                      //   <Select
                      //     value={
                      //       newAppointmentData.type === "Service" ||
                      //       newAppointmentData.type === "Time Off"
                      //         ? newAppointmentData?.reason?.name || null
                      //         : null
                      //     }
                      //     label={
                      //       newAppointmentData?.type === "Service"
                      //         ? "Available services"
                      //         : "Reason"
                      //     }
                      //     onChange={(event, value) => {
                      //       // newAppointmentData.type === "Service"
                      //       // ?

                      //       handleChange("reason", event.target.value);

                      //       // : handleChange("reason", { ...value, name: value?.text });

                      //     }}
                      //   >
                      //     {newAppointmentData.type === "Service"
                      //       ? newAppointmentData?.concerned?.services?.map(
                      //           (service) => (
                      //             <MenuItem key={service.id} value={service.name}>
                      //               <Box
                      //                 sx={{
                      //                   display: "flex",
                      //                   alignItems: "center",
                      //                   gap: 1,
                      //                 }}
                      //               >
                      //                 {service.name}
                      //               </Box>
                      //             </MenuItem>
                      //           )
                      //         )
                      //       : newAppointmentData.type === "Time Off"
                      //       ? timeOffReasons.map((reason) => (
                      //           <MenuItem key={reason} value={reason}>
                      //             <Box
                      //               sx={{
                      //                 display: "flex",
                      //                 alignItems: "center",
                      //                 gap: 1,
                      //               }}
                      //             >
                      //               {reason}
                      //             </Box>
                      //           </MenuItem>
                      //         ))
                      //       : []}
                      //   </Select>
                      // </FormControl>

                      <Autocomplete
                        id="tags-outlined-listbox"
                        // multiple
                        // id="tags-outlined"
                        getOptionLabel={(option) =>
                          newAppointmentData.type === "Service"
                            ? option?.name ?? ""
                            : option ?? ""
                        }
                        disabled={isEditMode}
                        options={
                          newAppointmentData.type === "Service"
                            ? newAppointmentData?.concerned?.services ?? []
                            : timeOffReasons ?? []
                        }
                        inputValue={
                          newAppointmentData?.reason
                            ? newAppointmentData.type === "Service"
                              ? newAppointmentData?.reason?.name ?? ""
                              : newAppointmentData?.reason?.name ?? ""
                            : ""
                        }
                        // onInputChange={(event, newInputValue) => setServiceInputValue(newInputValue)}
                        renderInput={(params) => (
                          <TextField
                            required
                            {...params}
                            label={
                              newAppointmentData?.type === "Service"
                                ? "Available services"
                                : "Reason"
                            }
                            variant="outlined"
                            error={!!errors?.details?.reason}
                            size="small"
                            sx={{
                              ".MuiInputBase-root": {
                                borderRadius: "25px",
                                width: "100%",
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => {
                          newAppointmentData.type === "Service"
                            ? handleChange("reason", value)
                            : handleChange("reason", { name: value });
                          // : handleChange("reason", { ...value, name: value?.text });
                        }}
                      />
                    )}

                    {newAppointmentData.type === "Service" && (
                      <Autocomplete
                        id="nurse-selector"
                        options={therapists}
                        getOptionLabel={(option) => option.fullName}
                        // isOptionEqualToValue={(option, value) => option.id === value?.id}
                        value={
                          newAppointmentData.nurse
                            ? therapists.find(
                                (e) => e.fullName === newAppointmentData.nurse
                              ) || null
                            : null
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Therapist"
                            variant="outlined"
                            error={!!errors?.details?.nurse}
                            size="small"
                            sx={{
                              ".MuiInputBase-root": {
                                borderRadius: "25px",
                                width: "100%",
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => {
                          handleChange("nurse", value?.fullName || "");
                        }}
                      />
                    )}

                    {newAppointmentData.type === "Service" && (
                      <Autocomplete
                        id="room-selector"
                        options={rooms}
                        getOptionLabel={(option) => option}
                        value={newAppointmentData.room || ""}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Room"
                            variant="outlined"
                            error={!!errors?.details?.room}
                            size="small"
                            sx={{
                              ".MuiInputBase-root": {
                                borderRadius: "25px",
                                width: "100%",
                              },
                            }}
                          />
                        )}
                        onChange={(event, value) => {
                          handleChange("room", value || "");
                        }}
                      />
                    )}

                    <TextField
                      fullWidth
                      label="Description"
                      className={`${
                        newAppointmentData.type === "Reminder"
                          ? "descriptionInput"
                          : ""
                      }`}
                      value={newAppointmentData.desc}
                      required={newAppointmentData.type === "Reminder"}
                      error={!!errors?.details?.desc}
                      multiline={newAppointmentData.type === "Reminder"}
                      rows={4}
                      variant="outlined"
                      size="small"
                      sx={{
                        ".MuiInputBase-root": {
                          borderRadius: "25px",
                          width: "100%",
                        },
                      }}
                      onChange={(event, value) => {
                        handleChange("desc", event.target.value);
                      }}
                    />
                  </div>
                </Box>
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
                  variant="outline"
                  onClick={handleCloseAppointmentModal}
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
                  onClick={(e) => handleAddOrUpdateAppointment(e)}
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
                  {isEditMode ? "UPDATE" : "ADD"}
                </Button>
              </Box>
            </Paper>
          </div>
        </Modal>

        <DeleteConfirmDialog
          open={appointmentDeleteDialogOpen}
          onOpenChange={handleCancelDeleteAppointment}
          onConfirm={confirmDeleteAppointment}
          title={`Delete ${appointmentToDelete?.title}`}
          description="Are you sure you want to delete this appointment? This action cannot be undone."
        />

        <div className="todayEvents w-[300px] h-full p-2.5 box-border">
          <div className="todayEventsContainer w-full h-full flex flex-col">
            {" "}
            {/* Added flex-col */}
            <span className="topContainer flex items-center justify-between">
              <h1 className="title m-0 text-2xl font-bold">Today's Events</h1>
              <button
                className="addAppointmentBtn border-none cursor-pointer bg-[#cab06d] text-white font-bold rounded px-1.25"
                onClick={handleClickAddAppointment}
              >
                <IoAddOutline className="addAppointmentIcon text-xl" />
              </button>
            </span>
            <h2 className="todayDate m-0 text-base text-gray-500/75 mt-2.5">
              {formatedTodayDate()}
            </h2>
            <div
              className="eventsContainer h-full flex- mt-7 mb-0 pr-2.5 w-full overflow-y-auto pb-5 flex-col items-center gap-2.5
        [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full 
        [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600"
            >
              {todayEvents.map((todayEvent) => (
                <TodayEventCard
                  todayEventData={todayEvent}
                  key={todayEvent.id}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="calendarPageBody h-full flex-[1] box-border pt-3">
          <div
            className={`calendar-container h-full ${currentView}-view`}
            // ref={calendarRef}
          >
            <Calendar
              localizer={localizer}
              events={events}
              formats={formats}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventPropGetter}
              view={currentView}
              onView={handleViewChange}
              defaultView={Views.MONTH}
              onSelectEvent={handleSelectEvent} // Handle event click
              style={{
                // backgroundColor:"red",

                "& .rbc-toolbar-label": {
                  color: "green",
                },
              }}
            />

            <Popover
              open={isPopoverOpen}
              onClose={handleClosePopover}
              anchorReference="anchorPosition"
              anchorPosition={{
                top: anchorPosition.top,
                left: anchorPosition.left,
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              BackdropProps={{
                style: {
                  backgroundColor: "transparent",
                },
              }}
              transitionDuration={200}
              sx={{
                "& .MuiPopover-paper": {
                  display: "flex",
                  flexDirection: "column",
                  height: "550px",
                  width: "500px", // Add explicit width to prevent collapse
                  maxHeight: "80vh",
                  overflow: "hidden",
                  transition: "all 0.2s ease-in-out",
                  // Option 1: Hide content during exit animation
                  "&.MuiPopover-paperAnchorOrigin": {
                    opacity: isPopoverOpen ? 1 : 0,
                  },
                },
              }}
            >
              {selectedEvent &&
                isPopoverOpen && ( // Only render content when fully open
                  <Box
                    className="popoverRbcEvent"
                    sx={{
                      p: 3,
                      width: "100%", // Use full width instead of fixed 500px
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      // Option 2: Add opacity transition to content
                      // opacity: isPopoverOpen ? 1 : 0,
                      transition: "opacity 0.15s ease-in-out",
                    }}
                  >
                    <Box className="popoverRbcEventHeader h-12 flex items-center justify-between py-2 px-0">
                      <span className="headerTitle text-[20px] font-bold">
                        Appointment
                      </span>
                      <Button
                        onClick={handleClosePopover}
                        size="small"
                        sx={{
                          color: "#cab06d",
                          // height: "30px",
                          // width: "30px",
                          // borderRadius : "50%",
                          "&:hover": {
                            color: "#9f874b",
                            backgroundColor: "#cab06d3e",
                          },
                        }}
                      >
                        <Close />
                      </Button>
                    </Box>

                    <Box
                      id="firstBox"
                      sx={{
                        width: "100%",
                        height: "100",
                        // backgroundColor: "yellow",
                        flex: 1,
                        // overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        // minHeight: 0, // Important: allows flex children to shrink below content size
                      }}
                    >
                      <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: "#cab06d" }}>
                          <TabList
                            onChange={handleChangeTab}
                            aria-label="lab API tabs"
                            sx={{
                              minHeight: "30px",
                              height: "40px",
                              ".MuiTabs-list": {
                                width: "100%",
                                justifyContent: "space-between",
                                backgroundColor: "#ffe49f4f",
                                borderRadius: "5px",
                                padding: "6px",
                                height: "100%",
                              },

                              ".MuiTabs-indicator": {
                                display: "none",
                              },

                              ".MuiButtonBase-root": {
                                flex: "1",
                                color: "#828085",
                                minHeight: "20px",
                                height: "100%",
                                textTransform: "initial",

                                "&.Mui-selected": {
                                  backgroundColor: "#cab06d",
                                  color: "white",
                                  borderRadius: "3px",
                                },
                              },
                            }}
                          >
                            <Tab label="Details" value="1" />
                            <Tab
                              label="History"
                              value="2"
                              disabled={
                                ![705].includes(claims) &&
                                selectedEvent.type === "Time Off"
                              }
                            />
                          </TabList>
                        </Box>

                        <TabPanel
                          value="1"
                          // className="flex flex-col justify-between flex-1 pb-0"
                          sx={{
                            pb: 0,
                            display: "flex",
                            // flex: 1,
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="tabContainer h-[100%] flex-1 gap-3 flex flex-col justify-between">
                            <div className="tabContainerSecond details flex flex-col justify-between gap-2">
                              <h4 className="eventTitle text-center font-bold border-b-2 pb-2">
                                {selectedEvent?.title}
                              </h4>
                              <div className="flex flex-col gap-4 h-[280px] overflow-y-auto">
                                <div className="grouper flex gap-2">
                                  {(selectedEvent?.type === "Service" ||
                                    selectedEvent?.type === "Time Off") && (
                                    <div className="durationConatiner container flex items-center gap-4 border-2 p-2 rounded-lg">
                                      <span className="durationTitle title ">
                                        <TimerOutlined />
                                      </span>
                                      <span className="duration data">
                                        {selectedEvent.type === "Service"
                                          ? calculateDuration(
                                              selectedEvent?.start,
                                              selectedEvent?.end,
                                              selectedEvent?.allDay
                                            )
                                          : `${calculateDurationInDays(
                                              selectedEvent?.interval?.start
                                                ?.date,
                                              selectedEvent?.interval?.end?.date
                                            )} days   
                            (${getDaysRemaining(
                              selectedEvent?.interval?.end?.date
                            )} days left)`}
                                      </span>
                                    </div>
                                  )}

                                  {selectedEvent?.type === "Service" && (
                                    <div className="costContainer container flex items-center gap-4 border-2 p-2 rounded-lg">
                                      <>
                                        <span className="costTitle title">
                                          <AttachMoney />
                                        </span>
                                        <span className="cost data">
                                          {selectedEvent.reason?.promoPrice
                                            ? `${selectedEvent.reason?.promoPrice} $`
                                            : `${selectedEvent.reason?.price} $`}
                                        </span>
                                      </>
                                    </div>
                                  )}
                                </div>

                                <div className="dateTimeContainer container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                  <AccessTime className="title" />

                                  <div className="date data">
                                    {selectedAppointment?.interval?.start?.date}
                                  </div>
                                  <div className="timeInterval data">
                                    {!(selectedEvent?.type === "Time Off")
                                      ? selectedEvent.type === "Service"
                                        ? `${
                                            selectedEvent?.interval?.start.time
                                          }  ${`- ${selectedEvent?.interval?.end.time}`}`
                                        : `At ${selectedEvent?.interval?.start.time}`
                                      : `to  ${selectedEvent?.interval?.end.date}`}
                                  </div>
                                </div>
                                <div className="grouper flex gap-2">
                                  <div className="eventTypeContainer container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                    <div className="eventTypeTitle title">
                                      <SpaOutlined />
                                    </div>
                                    <div className="eventType data">
                                      {selectedEvent.type}
                                    </div>
                                  </div>
                                  <div className="concernedContainer container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                    <div className="concernedTitle title">
                                      <PersonOutlineOutlined />
                                    </div>
                                    <div className="concerned data">
                                      <span className="conernedName">
                                        {
                                          // selectedEvent.type === "Service"
                                          //   ?
                                          selectedEvent.concerned?.fullName
                                          // : selectedEvent.type === "Time Off"
                                          // ? `${selectedEvent.concerned?.details?.firstName} ${selectedEvent.concerned?.details?.lastName}`
                                          // : ""
                                        }
                                      </span>
                                      {selectedEvent.type === "Service" && (
                                        <span className="concernedDetails">
                                          <div>
                                            {selectedEvent.concerned?.email}
                                          </div>

                                          <div>
                                            {selectedEvent.concerned?.phone}
                                          </div>
                                          <div>
                                            {selectedEvent.concerned?.address}
                                          </div>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {!selectedEvent?.type === "Reminder" && (
                                  <div className="concernedServiceContainer container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                    <div className="concernedServiceTitle title">
                                      <SelfImprovementOutlined />
                                    </div>
                                    <div className="concernedService data">
                                      {selectedEvent?.reason?.name}
                                    </div>
                                  </div>
                                )}

                                {selectedEvent?.type === "Service" && (
                                  <div className="grouper flex gap-2">
                                    <div className="durationConatiner container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                      <span className="durationTitle title">
                                        <BedroomChildOutlined />
                                      </span>
                                      <span className="duration data">
                                        {selectedEvent?.room ?? "Room"}
                                      </span>
                                    </div>

                                    <div className="durationConatiner container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                      <span className="durationTitle title">
                                        <SafetyDividerOutlined />
                                      </span>
                                      <span className="duration data">
                                        {selectedEvent?.nurse}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {selectedEvent?.desc && (
                                  <div className="descContainer container  flex items-center gap-4 border-2 p-2 rounded-lg">
                                    <div className="eventDescriptionTitle title">
                                      <SubjectOutlined />
                                    </div>
                                    <div className="eventNote data">
                                      {selectedEvent?.desc?.trim()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {([705].includes(claims) ||
                              (![705].includes(claims) &&
                                selectedEvent.type !== "Time Off")) && (
                              <div className="popoverRbcEventFooter flex items-center justify-end gap-4 mt-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={(e) =>
                                    handleEditAppointment(selectedEvent, e)
                                  }
                                  sx={{
                                    color: "#cab06d",
                                    border: "1px solid #cab06d",
                                    "&:hover": {
                                      color: "#9f874b",
                                      backgroundColor: "#cab06d3e",
                                    },
                                  }}
                                >
                                  <EditOutlined />
                                </Button>

                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleDeleteAppointment(selectedEvent)
                                  }
                                  sx={{
                                    bgcolor: "#e00000",
                                    "&:hover": {
                                      bgcolor: "#9f0000",
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
                                  <DeleteOutlined />
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabPanel>
                        <TabPanel value="2"></TabPanel>
                      </TabContext>
                    </Box>
                  </Box>
                )}
            </Popover>
          </div>
        </div>

        {/* </div> */}
      </Box>
    </>
  );
};

export default CalendarPage;
