import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextareaAutosize,
} from "@mui/material";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Ellipsis,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Add } from "@mui/icons-material";

// Mock data - replace with your actual data fetching
const customerData = {
  id: "CUST-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  joinDate: "2024-01-15",
  totalSpent: 2850,
  totalOwed: 450,
  status: "Active",
  avatar: "/placeholder.svg?height=80&width=80",
};

const services = [
  {
    id: "SRV-001",
    name: "Premium Spa Package",
    price: 1200,
    paidAmount: 800,
    status: "Partial",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    sessions: { completed: 6, total: 10 },
  },
  {
    id: "SRV-002",
    name: "Massage Therapy Course",
    price: 800,
    paidAmount: 800,
    status: "Paid",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    sessions: { completed: 8, total: 8 },
  },
  {
    id: "SRV-003",
    name: "Wellness Consultation",
    price: 300,
    paidAmount: 250,
    status: "Partial",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    sessions: { completed: 2, total: 3 },
  },
];

const appointments = [
  {
    id: "APT-001",
    service: "Premium Spa Package",
    date: "2024-07-05",
    time: "10:00 AM",
    status: "Confirmed",
    type: "Facial Treatment",
  },
  {
    id: "APT-002",
    service: "Wellness Consultation",
    date: "2024-07-03",
    time: "2:00 PM",
    status: "Completed",
    type: "Initial Consultation",
  },
  {
    id: "APT-003",
    service: "Premium Spa Package",
    date: "2024-06-28",
    time: "11:30 AM",
    status: "Completed",
    type: "Body Treatment",
  },
  {
    id: "APT-004",
    service: "Premium Spa Package",
    date: "2024-07-10",
    time: "3:00 PM",
    status: "Pending",
    type: "Aromatherapy",
  },
];

const notes = [
  {
    id: "NOTE-001",
    date: "2024-06-30",
    content: "Customer prefers morning appointments. Allergic to lavender oil.",
    author: "Dr. Smith",
  },
  {
    id: "NOTE-002",
    date: "2024-06-25",
    content:
      "Discussed payment plan for remaining balance. Customer agreed to monthly installments.",
    author: "Admin",
  },
  {
    id: "NOTE-003",
    date: "2024-06-20",
    content:
      "Excellent progress with wellness program. Customer very satisfied with results.",
    author: "Therapist Jane",
  },
];
const CustomerPayment = () => {
  const [newNote, setNewNote] = useState("");
  const [value, setValue] = useState("services");
    const [notesData, setNotesData] = useState(notes)


  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <Chip
            className="bg-green-100 text-green-800  w-[100px] "
            label={
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 mr-1" />
                Paid
              </div>
            }
            sx={{
              backgroundColor: "#008300",
              color: "#ffffff",
            }}
          ></Chip>
        );
      case "Partial":
        return (
          <Chip
            className="bg-yellow-100 text-yellow-800  w-[100px]"
            label={
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 mr-1" />
                Partial
              </div>
            }
            sx={{
              backgroundColor: "#008183",
              color: "#ffffff",
            }}
          ></Chip>
        );
      case "Overdue":
        return (
          <Chip
            className="bg-red-100 text-red-800 "
            label={
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 mr-1" />
                Overdue
              </div>
            }
          ></Chip>
        );
      default:
        return <Chip variant="secondary" label={status}></Chip>;
    }
  };

  const getAppointmentStatusBadge = (status) => {
    switch (status) {
      case "Confirmed":
        return (
          <Chip
            className="bg-blue-100 text-blue-800 hover:bg-blue-100"
            label={"Confirmed"}
          ></Chip>
        );
      case "Completed":
        return (
          <Chip
            className="bg-green-100 text-green-800 hover:bg-green-100"
            label={"Completed"}
          ></Chip>
        );
      case "Pending":
        return (
          <Chip
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            label={"Pending"}
          ></Chip>
        );
      case "Cancelled":
        return (
          <Chip
            className="bg-red-100 text-red-800 hover:bg-red-100"
            label={"Cancelled"}
          ></Chip>
        );
      default:
        return <Chip variant="secondary" label={status}></Chip>;
    }
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  const handleClickOnAppointmentRow = (event, appointment) => {
    event.stopPropagation();
    console.log(appointment);
    setAnchorEl(event.currentTarget);
    // setData(row);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
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
        {/* Customer Header */}
        <div className="space-y-6">
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item size={8}>
              <Card
                className="h-full"
                sx={{
                  "&.MuiPaper-root": {
                    width: "100%",
                  },
                }}
              >
                <CardHeader
                  className="pb-4"
                  title={
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                          {customerData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-2xl">{customerData.name}</div>
                          <div className="text-base">
                            Customer ID: {customerData.id}
                          </div>
                          <Chip
                            className="mt-2 bg-green-100 text-green-800 hover:bg-green-100"
                            label={customerData.status}
                          ></Chip>
                        </div>
                      </div>
                    </div>
                  }
                ></CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customerData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customerData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Joined {customerData.joinDate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={4} xs={12} sm={6} md={3}>
              {/* Payment Summary */}
              <Card className="">
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Payment Summary
                    </div>
                  }
                ></CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Spent
                    </span>
                    <span className="font-semibold">
                      ${customerData.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Outstanding
                    </span>
                    <span className="font-semibold text-red-600">
                      ${customerData.totalOwed.toLocaleString()}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Payment Rate</span>
                    <span className="font-semibold text-green-600">
                      {Math.round(
                        (customerData.totalSpent /
                          (customerData.totalSpent + customerData.totalOwed)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <LinearProgress variant="determinate" value={86} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={12} xs={12} sm={6} md={3}>
              <Card className="min-h-[700px]">
                <CardContent>
                  <TabContext value={value} className="TabContext">
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                      className="w-full h-full tblist"
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
                      // Add these performance props:
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      <Tab label="Services & Packages" value="services" />
                      <Tab label="Appointments" value="appointments" />
                      <Tab label="Payment History" value="payments" />
                      <Tab label="Notes" value="notes" />
                    </TabList>

                    <TabPanel value="services">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Active Services & Packages
                          </h3>

                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            // onClick={handleClickAddService}
                            sx={{
                              bgcolor: "#cab06d",
                              "&:hover": { bgcolor: "#9f874b" },
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 3,
                              px: 3,
                              py: 1.5,
                              boxShadow: "0 4px 12px cab06d",
                            }}
                          >
                            Add Service
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          {services.map((service) => (
                            <Card
                              key={service.id}
                              className="shadow-lg p-3 h-[300px]"
                              sx={{
                                bgcolor: "white",
                                borderRadius: 3,
                                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                "&:hover": {
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                                  transform: "translateY(-2px)",
                                },
                                transition: "all 0.3s ease",
                                height: "100%",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              <CardHeader
                                className="pb-3"
                                title={
                                  <div className="flex justify-between items-start w-full">
                                    <div className="text-lg">
                                      {service.name}
                                    </div>
                                    {getPaymentStatusBadge(service.status)}
                                  </div>
                                }
                                subheader={
                                  <div>
                                    {service.startDate} - {service.endDate}
                                  </div>
                                }
                              ></CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Total Price
                                    </p>
                                    <p className="font-semibold">
                                      ${service.price}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Paid Amount
                                    </p>
                                    <p className="font-semibold text-green-600">
                                      ${service.paidAmount}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Remaining
                                    </p>
                                    <p className="font-semibold text-red-600">
                                      ${service.price - service.paidAmount}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Sessions
                                    </p>
                                    <p className="font-semibold">
                                      {service.sessions.completed}/
                                      {service.sessions.total}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span>Payment Progress</span>
                                    <span>
                                      {Math.round(
                                        (service.paidAmount / service.price) *
                                          100
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      (service.paidAmount / service.price) * 100
                                    }
                                    sx={{
                                      height: "8px",
                                      borderRadius: "10px",
                                      ".MuiLinearProgress-bar": {
                                        backgroundColor: "#159f00",
                                      },
                                    }}
                                  />
                                </div>

                                <div className="mt-4">
                                  <div className="flex justify-between text-sm mb-2">
                                    <span>Session Progress</span>
                                    <span>
                                      {Math.round(
                                        (service.sessions.completed /
                                          service.sessions.total) *
                                          100
                                      )}
                                      %
                                    </span>
                                  </div>

                                  <LinearProgress
                                    variant="determinate"
                                    value={
                                      (service.sessions.completed /
                                        service.sessions.total) *
                                      100
                                    }
                                    sx={{
                                      height: "8px",
                                      borderRadius: "10px",
                                      ".MuiLinearProgress-bar": {
                                        backgroundColor: "#ffaa00",
                                      },
                                    }}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="appointments">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Appointments
                          </h3>

                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            // onClick={handleClickAddService}
                            sx={{
                              bgcolor: "#cab06d",
                              "&:hover": { bgcolor: "#9f874b" },
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 3,
                              px: 3,
                              py: 1.5,
                              boxShadow: "0 4px 12px cab06d",
                            }}
                          >
                            Schedule Appointment
                          </Button>
                        </div>

                        <div className="border rounded-lg">
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                              list: {
                                "aria-labelledby": "basic-button",
                              },
                            }}
                          >
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Remove</MenuItem>
                          </Menu>
                          <Table>
                            <TableHead className="bg-[#ffe49f4f]">
                              <TableRow>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell className="text-center">
                                  Type
                                </TableCell>
                                <TableCell className="text-center">
                                  Status
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium">
                                          {appointment.date}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {appointment.time}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{appointment.service}</TableCell>
                                  <TableCell>{appointment.type}</TableCell>
                                  <TableCell>
                                    {getAppointmentStatusBadge(
                                      appointment.status
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    >
                                      <button
                                        onClick={(e) => {
                                          handleClickOnAppointmentRow(
                                            e,
                                            appointment
                                          );
                                        }}
                                      >
                                        <Ellipsis size={20} />
                                      </button>
                                    </Box>

                                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="payments">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Payment History
                          </h3>

                          <Button
                            startIcon={<Add />}
                            // onClick={handleClickAddService}
                            variant="contained"
                            sx={{
                              bgcolor: "#cab06d",
                              "&:hover": { bgcolor: "#9f874b" },
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 3,
                              px: 3,
                              py: 1.5,
                              boxShadow: "0 4px 12px cab06d",
                            }}
                          >
                            Record Payment
                          </Button>
                        </div>

                        <div className="border rounded-lg">
                          <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                              list: {
                                "aria-labelledby": "basic-button",
                              },
                            }}
                          >
                            <MenuItem>Edit</MenuItem>
                            <MenuItem>Remove</MenuItem>
                          </Menu>
                          <Table>
                            <TableHead className="bg-[#ffe49f4f]">
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell className="text-center">
                                  Amount
                                </TableCell>
                                <TableCell className="text-center">
                                  Method
                                </TableCell>
                                <TableCell className="text-center">
                                  Status
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              <TableRow>
                                <TableCell>2024-06-15</TableCell>
                                <TableCell>Premium Spa Package</TableCell>
                                <TableCell>$400</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell>
                                  <Chip
                                    className="bg-green-100 text-green-800 hover:bg-green-100"
                                    label={"Completed"}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Receipt
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-05-20</TableCell>
                                <TableCell>Premium Spa Package</TableCell>
                                <TableCell>$400</TableCell>
                                <TableCell>Cash</TableCell>
                                <TableCell>
                                  <Chip
                                    className="bg-green-100 text-green-800 hover:bg-green-100"
                                    label={"Completed"}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Receipt
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-03-01</TableCell>
                                <TableCell>Wellness Consultation</TableCell>
                                <TableCell>$250</TableCell>
                                <TableCell>Bank Transfer</TableCell>
                                <TableCell>
                                  <Chip
                                    className="bg-green-100 text-green-800 hover:bg-green-100"
                                    label={"Completed"}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Receipt
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-02-01</TableCell>
                                <TableCell>Massage Therapy Course</TableCell>
                                <TableCell>$800</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell>
                                  <Chip
                                    className="bg-green-100 text-green-800 hover:bg-green-100"
                                    label={"Completed"}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Receipt
                                  </Button>
                                </TableCell>
                              </TableRow>

                              {/* {appointments.map((appointment) => (
                                <TableRow key={appointment.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="font-medium">
                                          {appointment.date}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {appointment.time}
                                        </p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{appointment.service}</TableCell>
                                  <TableCell>{appointment.type}</TableCell>
                                  <TableCell>
                                    {getAppointmentStatusBadge(
                                      appointment.status
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    >
                                      <button
                                        onClick={(e) => {
                                          handleClickOnAppointmentRow(
                                            e,
                                            appointment
                                          );
                                        }}
                                      >
                                        <Ellipsis size={20} />
                                      </button>
                                    </Box>

                      
                                  </TableCell>
                                </TableRow>
                              ))} */}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="notes">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Customer Notes
                          </h3>
                        </div>
                      </div>

                      <div className="  rounded-lg mt-3">
                        <Card>
                          <CardHeader
                            sx={{
                              ".MuiCardHeader-title": {
                                fontSize: "15px",
                              },
                            }}
                            title="Add New Note"
                          ></CardHeader>
                          <CardContent className="space-y-4">
                            <TextareaAutosize
                              placeholder="Enter your note here..."
                              //   value={newNote}
                              //   onChange={(e) => setNewNote(e.target.value)}
                              className="min-h-[100px] w-full p-2"
                            />
                            <Button
                              // onClick={handleAddNote}
                              variant="contained"
                              sx={{
                                bgcolor: "#cab06d",
                                "&:hover": { bgcolor: "#9f874b" },
                                textTransform: "none",
                                fontWeight: 500,
                                borderRadius: 1,
                                px: 3,
                                py: 1.5,
                                boxShadow: "0 4px 12px cab06d",
                              }}
                            >
                              Save Note
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Existing Notes */}
                        <div className="space-y-4 mt-8">
                          {notesData.map((note) => (
                            <Card key={note.id}>
                              <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {note.date}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      •
                                    </span>
                                    <span className="text-sm font-medium">
                                      {note.author}
                                    </span>
                                  </div>
                                  {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteNote(note.id)} className="text-red-600">
                          Delete Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                                </div>
                                <p className="text-sm leading-relaxed">
                                  {note.content}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </Box>
  );
};

export default CustomerPayment;
