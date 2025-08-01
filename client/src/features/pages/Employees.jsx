import {
  Add,
  Label,
  More,
  Search,
  Settings,
  Shield,
  ShieldMoon,
  VerifiedUser,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Ellipsis,
  ShieldCheck,
  Sparkles,
  Users,
  Warehouse,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  addEmployee,
  deleteEmployee,
  setupEmployeesListeners,
  updateEmployee,
} from "../employees/slices/employeesSlice";
import { useDispatch, useSelector } from "react-redux";
import { initialEmployee } from "../../app/config";
import { validateEmployee } from "../../utils/validators";
import {
  getRoleBadge,
  getRoleLabelById,
  getRoleTitle,
  getStatusBadge,
  getStatusTitle,
  spaDepartments,
  spaEmployeesStatus,
  spaRoles,
} from "../employees/utils/employeesUtils";
import { backdropStyle } from "../utils/styles";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "672px", lg: "672px" },
  height: { xs: "100%", sm: "600px" },
  bgcolor: "background",
  borderRadius: 2,
  boxShadow: 24,
  p: "20px",
};

// const modalStyle = {
//   justifyContent: "space-start",
//   position: "absolute",
//   // height: "100%",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: { xs: "90%", sm: "864px" },
//   height: { xs: "100%", sm: "700px" },
//   bgcolor: "background.paper",
//   borderRadius: 2,
//   boxShadow: 24,
//   p: "20px",
// };

// 2. Custom backdrop style
// const backdropStyle = {
//   backdropFilter: "blur(5px)", // Blur intensity
//   backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
// };
// Spa-specific mock data
const employees = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "sarah.williams@zenspaspa.com",
    phone: "(555) 123-4567",
    role: "Spa Manager",
    department: "Management",
    status: "Active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Spa Management Certified", "Customer Service Excellence"],
    specialties: ["Operations Management", "Staff Training"],
    permissions: {
      bookingManagement: true,
      staffScheduling: true,
      treatmentAccess: true,
      productSales: true,
      reporting: true,
      clientRecords: true,
      inventory: true,
    },
  },
  {
    id: 2,
    name: "Emma Thompson",
    email: "emma.thompson@zenspaspa.com",
    phone: "(555) 234-5678",
    role: "Licensed Massage Therapist",
    department: "Massage Therapy",
    status: "Active",
    lastLogin: "2024-01-14",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: [
      "Licensed Massage Therapist",
      "Deep Tissue Specialist",
      "Hot Stone Certified",
    ],
    specialties: [
      "Swedish Massage",
      "Deep Tissue",
      "Hot Stone",
      "Prenatal Massage",
    ],
    permissions: {
      bookingManagement: false,
      staffScheduling: false,
      treatmentAccess: true,
      productSales: true,
      reporting: false,
      clientRecords: true,
      inventory: false,
    },
  },
  {
    id: 3,
    name: "Olivia Chen",
    email: "olivia.chen@zenspaspa.com",
    phone: "(555) 345-6789",
    role: "Licensed Esthetician",
    department: "Facial Treatments",
    status: "Active",
    lastLogin: "2024-01-13",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: [
      "Licensed Esthetician",
      "Chemical Peel Certified",
      "Microdermabrasion Specialist",
    ],
    specialties: [
      "Anti-Aging Facials",
      "Acne Treatment",
      "Chemical Peels",
      "Microdermabrasion",
    ],
    permissions: {
      bookingManagement: false,
      staffScheduling: false,
      treatmentAccess: true,
      productSales: true,
      reporting: false,
      clientRecords: true,
      inventory: false,
    },
  },
  {
    id: 4,
    name: "Jessica Martinez",
    email: "jessica.martinez@zenspaspa.com",
    phone: "(555) 456-7890",
    role: "Spa Receptionist",
    department: "Front Desk",
    status: "Active",
    lastLogin: "2024-01-15",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["Customer Service Certified"],
    specialties: [
      "Client Relations",
      "Appointment Scheduling",
      "Product Knowledge",
    ],
    permissions: {
      bookingManagement: true,
      staffScheduling: false,
      treatmentAccess: false,
      productSales: true,
      reporting: false,
      clientRecords: true,
      inventory: false,
    },
  },
  {
    id: 5,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@zenspaspa.com",
    phone: "(555) 567-8901",
    role: "Spa Attendant",
    department: "Support Services",
    status: "Part-time",
    lastLogin: "2024-01-12",
    avatar: "/placeholder.svg?height=40&width=40",
    certifications: ["First Aid Certified"],
    specialties: ["Facility Maintenance", "Guest Services"],
    permissions: {
      bookingManagement: false,
      staffScheduling: false,
      treatmentAccess: false,
      productSales: false,
      reporting: false,
      clientRecords: false,
      inventory: true,
    },
  },
];

const Employees = () => {
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.employees);
  const users = useSelector((state) => state.employees.users);
  // const auth = useSelector((state) => state.auth);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployeeData, setNewEmployeeData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [tabValue, setTabValue] = useState("basic");
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [errors, setErrors] = useState({});

  const open = Boolean(anchorEl);

  // In your component
  useEffect(() => {
    const unsubscribe = dispatch(setupEmployeesListeners());
    return () => unsubscribe();
  }, [dispatch]);

  const handleClick = (event, employee) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setNewEmployeeData(employee);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditEmployee = () => {
    setEditingEmployee(newEmployeeData);
    setIsEditMode(true);
    setIsAddEmployeeOpen(true);
    setAnchorEl(null);
  };

  const handleAddEmployee = () => {
    // setNewEmployeeData(employee);
    setNewEmployeeData(initialEmployee);
    setIsEditMode(false);
    setIsAddEmployeeOpen(true);
    // setAnchorEl(null);
  };

  const handleDeleteEmployee = useCallback(() => {
    if (newEmployeeData.id) {
      setDeleteConfirmOpen(true);
    }
    setAnchorEl(null);
  }, [newEmployeeData]);

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setNewEmployeeData(null);
  };

  const handleConfirmDelete = useCallback(() => {
    if (newEmployeeData?.id) {
      dispatch(deleteEmployee(newEmployeeData.id));
      setDeleteConfirmOpen(false);
      setNewEmployeeData(null);
    }
  }, [newEmployeeData]);

  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch =
      employee.details.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.details.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      employee.details.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      getRoleLabelById(employee.details.status) === filterRole;
    const matchesDepartment =
      filterDepartment === "all" ||
      employee.details.department === filterDepartment;

    return matchesSearch && matchesDepartment && matchesRole;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: "#f8fffe",
        overflow: "auto",
        backdropFilter: "blur(15px)",
        p: { xs: 2, md: 3, lg: 4 },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto", maxWidth: "1280px" }}>
        <Box sx={{ mb: 4 }}>
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
                Employee Management
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#cab06d", fontWeight: "300" }}
              >
                Manage your team members and their access permissions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAddEmployee()}
              sx={{
                bgcolor: "#cab06d",
                "&:hover": { bgcolor: "#9f874b" },
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                // boxShadow: "0 4px 12px cab06d",
              }}
            >
              Add Employee
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4} width={"40%"}>
              <TextField
                placeholder="Search staff members..."
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
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#4caf50",
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

            <Grid item xs={12} sm={6} md={4} width={"15%"}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={filterRole}
                  label="Role"
                  onChange={(e) => setFilterRole(e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="all">All Roles</MenuItem>

                  {spaRoles.map((role) => (
                    <MenuItem value={role.label} key={role.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} width={"15%"}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={filterDepartment}
                  label="Department"
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {spaDepartments.map((dept) => (
                    <MenuItem value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item size={4} xs={2} sm={2} md={3}>
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e8f5e8",
                      color: "#66bb6a",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Users />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#66bb6a" }}
                    >
                      {employees.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#66bb6a" }}>
                      Total Staff
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={4} xs={2} sm={2} md={3}>
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#ffebee",
                      color: "#d32f2f",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Sparkles />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      {
                        employees.filter((empl) => empl.details.status !== 111)
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#f44336" }}>
                      Active Therapists
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={4} xs={2} sm={2} md={3}>
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#fff3e0",
                      color: "#f57c00",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <Warehouse />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#f57c00" }}
                    >
                      {spaDepartments.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ff9800" }}>
                      Departments
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* <Grid item size={3} xs={2} sm={2} md={3}>
            <Card
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <ShieldCheck />
                    {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    $
                                  </Typography> */}
          {/* </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      {employees.reduce(
                        (total, emp) => total + emp.certifications.length,
                        0
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#2196f3" }}>
                      Certifications
                    </Typography>
                  </Box>
                </Box>
              </CardContent> */}
          {/* </Card> */}
          {/* </Grid>  */}
        </Grid>

        <Box sx={{ mb: 4 }}>
          {/* Employee Table */}
          <Card className="border-rose-200 bg-white/60 backdrop-blur-sm">
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Staff Member</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Specialties</TableCell>
                    <TableCell className="text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-rose-50/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar src="" alt={employee.details.firstName}>
                            {employee.details.firstName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </Avatar>
                          <div>
                            <div className="font-medium text-rose-900">
                              {employee.details.firstName}
                            </div>
                            <div className="text-sm text-rose-600">
                              {employee.details.email}
                            </div>
                            <div className="text-sm text-rose-500">
                              {employee.details.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(getRoleTitle(employee.details.role))}
                      </TableCell>
                      <TableCell className="text-rose-800">
                        {employee.details.department}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          getStatusTitle(employee.details.status)
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-32">
                          <p className="text-sm text-rose-700 truncate">
                            {[employee.certifications.specialties]
                              .slice(0, 2)
                              .join(", ")}
                            {[employee.certifications.specialties].length > 2 &&
                              "..."}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <Button
                            id="basic-button"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={(e) => handleClick(e, employee)}
                          >
                            <Ellipsis className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
                <MenuItem onClick={handleClose}>
                  Profile(not implemented yet)
                </MenuItem>
                <MenuItem onClick={handleEditEmployee}>Edit Details</MenuItem>
                {/* <MenuItem onClick={handleClose}>Manage Access</MenuItem> */}
                {/* <MenuItem onClick={handleClose}>Certifications</MenuItem> */}
                <MenuItem onClick={handleDeleteEmployee}>Remove</MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Box>

        <Modal
          open={isAddEmployeeOpen}
          // onClose={handleCloseModal}
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              style: backdropStyle,
            },
          }}
        >
          <Paper sx={modalStyle}>
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
                }}
              >
                {isEditMode ? "Edit a Staff Member" : "Add new Staff Member"}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
              {isEditMode
                ? "Edit staff account."
                : "Create a new staff account and set their spa access permissions."}
            </Typography>

            <AddEmployeeForm
              onClose={() => setIsAddEmployeeOpen(false)}
              newEmployeeData={newEmployeeData}
              isEditMode={isEditMode}
            />
          </Paper>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete Employee`}
          description={`Are you sure you want to delete this employee?
              This action cannot be undone.`}
        />
      </Box>
    </Box>
  );
};

function AddEmployeeForm({ onClose, isEditMode, newEmployeeData }) {
  const [employeeData, setEmployeeData] = useState(newEmployeeData);
  const [tabValue, setTabValue] = useState("basic");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const handleAddOrUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const { isValid, errors } = validateEmployee(employeeData);
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

    if (isEditMode) {
      if (employeeData.details.firstName) {
        dispatch(updateEmployee(employeeData));
        onClose();
      }
    } else {
      if (employeeData.details.firstName) {
        try {
          // Dispatch the setServices action
          const newAddedEmployee = {
            ...employeeData,
            id: Date.now().toString(), // Optional unique ID
          };

          dispatch(addEmployee(newAddedEmployee));
          onClose();
          // setNewEmployeeData(initialEmployee);
        } catch (error) {
          if (error.payload?.type === "validation") {
            //   setErrors(error.payload.errors);
          } else {
            // notifyError(error.payload?.message || "Failed to add expense");
          }
        }
      }
    }
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNewEmployeeData = (section, field, value) => {
    setEmployeeData((prev) => {
      // For the 'details' section
      if (section === "details") {
        return {
          ...prev,
          details: {
            ...prev.details,
            [field]: value,
          },
        };
      }
      // For the 'access' section (assuming you want to replace the whole array)
      // else if (section === 'access') {
      //   return {
      //     ...prev,
      //     access: value // This replaces the entire access array
      //   };
      // }
      // For the 'certifications' section (assuming you want to replace the whole array)
      else if (section === "certifications") {
        return {
          ...prev,
          certifications: {
            ...prev.certifications,
            [field]: value, // This replaces the entire certifications array
          },
        };
      }
      // Default case (shouldn't happen if you're using the function correctly)
      return prev;
    });
  };

  return (
    <div className=" h-[100%]">
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
            // sx={tabListStyles}
          >
            <Tab label="Basic Info" value="basic" />
            {/* <Tab label="Spa Access" value="permissions" /> */}
            <Tab label="Certifications" value="certifications" />
          </TabList>
        </Box>

        <TabPanel
          value="basic"
          id="helo"
          sx={{
            height: "80%",
            marginTop: "0px !important",
          }}
        >
          <Stack
            direction="column"
            className="grouper w-full h-full flex justify-between space-y-2"
          >
            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 w-full">
                <label htmlFor="firstName">First Name</label>
                <TextField
                  id="firstName"
                  placeholder="Sarah"
                  fullWidth
                  required
                  error={!!errors?.details?.firstName}
                  size="small"
                  value={employeeData.details.firstName || ""}
                  onChange={(e) =>
                    handleNewEmployeeData(
                      "details",
                      "firstName",
                      e.target.value
                    )
                  }
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "10px",
                      width: "100%",
                    },
                  }}
                />
              </div>

              <div className="space-y-1 w-full">
                <label htmlFor="lastName">Last Name</label>
                <TextField
                  id="lastName"
                  placeholder="Williams"
                  fullWidth
                  size="small"
                  value={employeeData.details.lastName || ""}
                  onChange={(e) =>
                    handleNewEmployeeData("details", "lastName", e.target.value)
                  }
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "10px",
                      width: "100%",
                    },
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email">Email</label>
              <TextField
                id="email"
                type="email"
                fullWidth
                size="small"
                required
                disabled={isEditMode}
                error={!!errors?.details?.email}
                value={employeeData.details.email || ""}
                onChange={(e) =>
                  handleNewEmployeeData("details", "email", e.target.value)
                }
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "10px",
                    width: "100%",
                  },
                }}
                placeholder="sarah.williams@zenspaspa.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone">Phone</label>
              <TextField
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                fullWidth
                size="small"
                value={employeeData.details.phone || ""}
                onChange={(e) =>
                  handleNewEmployeeData("details", "phone", e.target.value)
                }
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "10px",
                    width: "100%",
                  },
                }}
              />
            </div>

            {/* Role/deprtment */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <FormControl
                  fullWidth
                  required
                  error={!!errors?.details?.role}
                  size="small"
                >
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={employeeData.details.role || ""}
                    label="Role"
                    onChange={(e) => {
                      handleNewEmployeeData("details", "role", e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          role: "",
                        },
                      }));
                    }}
                    sx={{ bgcolor: "white", borderRadius: "10px" }}
                  >
                    {/* <MenuItem key={0} value={0}>Select Role</MenuItem> */}

                    {spaRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="space-y-1">
                <FormControl
                  fullWidth
                  required
                  error={!!errors?.details?.department}
                  size="small"
                >
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={employeeData.details.department || ""}
                    label="Department"
                    onChange={(e) => {
                      handleNewEmployeeData(
                        "details",
                        "department",
                        e.target.value
                      );

                      setErrors((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          department: "",
                        },
                      }));
                    }}
                    // onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: "10px" }}
                  >
                    {/* <MenuItem value="all">All Departments</MenuItem> */}
                    {spaDepartments.map((dept) => (
                      <MenuItem value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="space-y-1">
                <FormControl
                  fullWidth
                  error={!!errors.details?.status}
                  size="small"
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={
                      getStatusTitle(employeeData.details?.status) ===
                      "Inactive"
                        ? 111
                        : 1 || ""
                    }
                    label="Department"
                    onChange={(e) => {
                      handleNewEmployeeData(
                        "details",
                        "status",
                        e.target.value
                      );
                      setErrors((prev) => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          status: "",
                        },
                      }));
                    }}
                    // onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: "10px" }}
                  >
                    {/* <MenuItem value="all">All Departments</MenuItem> */}
                    {spaEmployeesStatus.map((status) => (
                      <MenuItem key={status.id} value={status.id}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-10">
              <Button
                onClick={onClose}
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
                variant="contained"
                onClick={(e) => handleAddOrUpdateEmployee(e)}
                // className="bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600"
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
                {isEditMode ? "Update staff account." : "Create Staff Member"}
              </Button>
            </div>
          </Stack>
        </TabPanel>

        {/* <TabPanel
          value="permissions"
          sx={{
            height: "80%",
            marginTop: "0px !important",
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "space-between",
          }}
        >
          <Stack
            direction="column"
            className="grouper w-full h-full flex justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Booking Management</label>
                <p className="text-sm text-muted-foreground">
                  Create, modify, and cancel client appointments
                </p>
              </div>
              <Switch
                defaultChecked
                onChange={(e) =>
                  handleNewEmployeeData("bookingManagement", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Staff Scheduling</label>
                <p className="text-sm text-muted-foreground">
                  Manage staff schedules and availability
                </p>
              </div>
              <Switch
                onChange={(e) =>
                  handleNewEmployeeData("manageStaff", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Treatment Access</label>
                <p className="text-sm text-muted-foreground">
                  Perform spa treatments and services
                </p>
              </div>
              <Switch
                onChange={(e) =>
                  handleNewEmployeeData("performSpa", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Product Sales</label>
                <p className="text-sm text-muted-foreground">
                  Sell spa products and retail items
                </p>
              </div>
              <Switch
                onChange={(e) =>
                  handleNewEmployeeData("sellSpa", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Client Records</label>
                <p className="text-sm text-muted-foreground">
                  Access and update client information
                </p>
              </div>
              <Switch
                onChange={(e) =>
                  handleNewEmployeeData("accessUpdateClient", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label>Inventory Management</label>
                <p className="text-sm text-muted-foreground">
                  Manage spa supplies and products
                </p>
              </div>
              <Switch
                onChange={(e) =>
                  handleNewEmployeeData(
                    "manageSpaSuppliesProducts",
                    e.target.checked
                  )
                }
              />
            </div>
            <div className="flex justify-end space-x-2 mt-10">
              <Button
                onClick={onClose}
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
                variant="contained"
                onClick={(e) => handleAddEmployee(e)}
                // className="bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600"
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
                Create Staff Member
              </Button>
            </div>
          </Stack>
        </TabPanel> */}

        <TabPanel
          value="certifications"
          sx={{
            height: "80%",
            marginTop: "0px !important",
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "space-between",
          }}
        >
          <Stack
            direction="column"
            className="grouper w-full h-full flex justify-between space-y-2"
          >
            {/* <div className="space-y-4"> */}
            <div className="space-y-2">
              <label>Professional Licenses</label>
              <TextField
                value={employeeData.certifications.proLicenses}
                placeholder="e.g., Licensed Massage Therapist"
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "10px",
                    width: "100%",
                  },
                }}
                onChange={(e) =>
                  handleNewEmployeeData(
                    "certifications",
                    "proLicenses",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label>Specialization Certifications</label>
              <TextField
                value={employeeData.certifications.specCertif}
                placeholder="e.g., Hot Stone Massage Certified"
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "10px",
                    width: "100%",
                  },
                }}
                onChange={(e) =>
                  handleNewEmployeeData(
                    "certifications",
                    "specCertif",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <label>Specialties</label>
              <TextField
                value={employeeData.certifications.specialties}
                placeholder="e.g., Swedish Massage, Deep Tissue"
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "10px",
                    width: "100%",
                  },
                }}
                onChange={(e) =>
                  handleNewEmployeeData(
                    "certifications",
                    "specialties",
                    e.target.value
                  )
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 mt-10">
              <Button
                onClick={onClose}
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
                variant="contained"
                onClick={(e) => handleAddOrUpdateEmployee(e)}
                // className="bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600"
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
                {isEditMode ? "Update staff account." : "Create Staff Member"}
              </Button>
            </div>
            {/* </div> */}
          </Stack>
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Employees;
