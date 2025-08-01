import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
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
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
// import ServiceDetails from "../components/packages/components/ServiceDetails";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import {
  setPackages,
  setSubServices,
  setupServicesListeners,
} from "../packages/slices/packagesSlice";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Clock,
  DollarSign,
  Package,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";
import { serviceColors } from "../../app/config";
import {
  addPackage,
  addService,
  addSubservice,
  deletePackage,
  deleteService,
  deleteSubService,
  updatePackage,
  updateService,
  updateSubService,
} from "../packages/thunks/packagesThunks";
import {
  validatePackage,
  validateService,
  validateSubService,
} from "../../utils/validators";
import { setError } from "../employees/slices/employeesSlice";

const PackageInfo = () => {
  const dispatch = useDispatch();

  const [subserviceDeleteDialogOpen, setSubserviceDeleteDialogOpen] =
    useState(false);
  const [serviceDeleteDialogOpen, setServiceDeleteDialogOpen] = useState(false);
  const [packageDeleteDialogOpen, setPackageDeleteDialogOpen] = useState(false);
  const [selectedSubserviceId, setSelectedSubserviceId] = useState(false);
  const [subserviceDialogOpen, setSubserviceDialogOpen] = useState(false);
  const [editingSubserviceId, setEditingSubserviceId] = useState(null);
  const [subserviceToDelete, setSubserviceToDelete] = useState(false);
  const [selectedSubService, setSelectedSubService] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingSubservice, setEditingSubservice] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [packageToDelete, setPackageToDelete] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [subserviceErrors, setSubserviceErrors] = useState({});
  const [editingPackageId, setEditingPackageId] = useState({});
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState({});
  const [serviceErrors, setServiceErrors] = useState({});
  const [packageErrors, setPackageErrors] = useState({});
  const [newSubservice, setNewSubservice] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPackage, setNewPackage] = useState({});
  const [newService, setNewService] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState("services");
  const [errors, setErrors] = useState({});



  const subServices = useSelector((state) => state.services.subServices);
  const services = useSelector((state) => state.services.services);

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;


  useEffect(() => {
    const unsubscribe = dispatch(setupServicesListeners());
    return () => unsubscribe();
  }, [dispatch, isEditMode]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // !########################################################
  const handleServiceClick = useCallback((service) => {
    setSelectedService(service);
    setSelectedSubService(null);
    setServiceToDelete(service);
    dispatch(setSubServices(service.id));
    setValue("subservices");
  }, []);

  const handleClickAddService = useCallback((event) => {
    setServiceDialogOpen(true);
    setIsEditMode(false);

    setNewService({});
  }, []);

  const handleEditService = useCallback((service, e) => {
    e.stopPropagation();
    setNewService(service);
    setIsEditMode(true);
    setEditingService(service);
    setEditingServiceId(service.id);
    setServiceDialogOpen(true);
  }, []);

  const handleCloseDialService = useCallback(() => {
    // setIsEditMode(false);
    setErrors({});
    setNewService({});
    setServiceErrors({});
    setServiceDialogOpen(false);
  }, []);

  const handleAddOrUpdateService = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const { isValid, errors } = validateService(newService);

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

      if (newService.title) {
        if (isEditMode && editingServiceId) {
          dispatch(
            updateService({
              ...newService,
              id: editingServiceId,
            })
          );
        } else {
          try {
            // Dispatch the setServices action
            const newAddedService = {
              ...newService,
              id: Date.now().toString(), // Optional unique ID
              service: newService.title?.replace(/\s+/g, ""),
              content: [],
            };

            dispatch(addService(newAddedService));
          } catch (error) {
            if (error.payload?.type === "validation") {
              //   setErrors(error.payload.errors);
            } else {
              // General server error
              // notifyError(error.payload?.message || "Failed to add expense");
            }
          }
        }
      }

      // dispatch(setSubServices(newAddedService));
      setNewService({});
      setServiceDialogOpen(false);
    },
    [newService, isEditMode, editingServiceId]
  );

  // !########################################################
  const handleDeleteService = useCallback((service, e) => {
    e.stopPropagation();
    setServiceToDelete(service);
    setServiceDeleteDialogOpen(true);
    setSelectedServiceId(service.id);
  }, []);

  const handleCancelDeleteService = useCallback(() => {
    // setNewService({});
    // setServiceErrors({});
    setServiceDeleteDialogOpen(false);
    // setServiceToDelete(null);
  }, []);

  const confirmDeleteService = useCallback(
    async (e) => {
      e.preventDefault();
      if (serviceToDelete) {
        dispatch(deleteService(serviceToDelete.id));
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        setServiceDeleteDialogOpen(false);
      }
    },
    [serviceToDelete]
  );
  // !########################### SUB SERVICE ##############################################

  const handleSubServiceClick = useCallback((content) => {
    dispatch(setPackages(content.id));
    setSelectedSubService(content);
    setValue("packages");
  }, []);

  const handleClickAddSubservice = useCallback((event) => {
    setSubserviceDialogOpen(true);

    setIsEditMode(false);
    setErrors({});

    setNewSubservice({});
  }, []);

  const handleEditSubservice = useCallback((subservice, e) => {
    e.stopPropagation();
    setNewSubservice(subservice);
    setIsEditMode(true);
    setEditingSubservice(subservice);
    setEditingSubserviceId(subservice.id);
    setSubserviceDialogOpen(true);
  }, []);

  const handleCloseDialSubservice = useCallback(() => {
    // setIsEditMode(false);
    setErrors({});
    setNewSubservice({});
    setSubserviceErrors({});
    setSubserviceDialogOpen(false);
  }, []);

  const handleAddOrUpdateSubService = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const { isValid, errors } = validateSubService(newSubservice);

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

      if (newSubservice.title) {
        if (isEditMode && editingSubserviceId) {
          dispatch(
            updateSubService({
              ...newSubservice,
              serviceID: subServices.id,
              id: editingSubserviceId,
            })
          );
          setIsEditMode(false);
        } else {
          try {
            // Dispatch the setServices action
            const newAddedSubService = {
              ...newSubservice,
              id: Date.now().toString(), // Optional unique ID
              serviceID: subServices.id,
              pricingPlan: [],
            };

            dispatch(addSubservice(newAddedSubService));
          } catch (error) {
            if (error.payload?.type === "validation") {
              //   setErrors(error.payload.errors);
            } else {
              // General server error
              // notifyError(error.payload?.message || "Failed to add expense");
            }
          }
        }
      }

      // dispatch(setSubServices(newAddedService));
      setNewSubservice({});
      setSubserviceDialogOpen(false);
    },
    [newSubservice, isEditMode, editingSubserviceId, subServices]
  );

  const handleDeleteSubservice = useCallback((subservice, e) => {
    e.stopPropagation();
    setSubserviceToDelete(subservice);
    setSubserviceDeleteDialogOpen(true);
    setSelectedSubserviceId(subservice.id);
    setSubserviceToDelete(subservice);
  }, []);

  const handleCancelDeleteSubservice = useCallback(() => {
    // setNewService({});
    // setServiceErrors({});
    // setSubserviceToDelete(null);
    setSubserviceDeleteDialogOpen(false);
    setSelectedSubserviceId(null);
  }, []);

  const confirmDeleteSubservice = useCallback(
    async (e) => {
      e.preventDefault();
      if (subserviceToDelete) {
        const contentToDelete = {
          id: subserviceToDelete.id,
          serviceID: subServices.id,
        };
        dispatch(deleteSubService(contentToDelete));
        setDeleteDialogOpen(false);
        setSubserviceToDelete(null);
        setSubserviceDeleteDialogOpen(false);
        setSubserviceDeleteDialogOpen(false);
      }
    },
    [subserviceToDelete]
  );

  // !########################### PACKAGES ##############################################
  const packages = subServices?.content.find(
    (cntnt) => cntnt?.id === selectedSubService?.id
  );

  const handleClickAddPackage = useCallback((event) => {
    setPackageDialogOpen(true);

    setIsEditMode(false);

    setNewPackage({});
  }, []);

  const handleEditPackage = useCallback((Package, e) => {
    e.stopPropagation();
    setNewPackage(Package);
    setIsEditMode(true);
    setEditingPackageId(Package.id);
    setPackageDialogOpen(true);
    setEditingPackage(Package);
  }, []);

  const handleCloseDialPackage = useCallback(() => {
    setNewPackage({});
    setErrors({});
    setPackageErrors({});
    setPackageDialogOpen(false);
    // setIsEditMode(false);
  }, []);

  const handleAddOrUpdatePackage = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const { isValid, errors } = validatePackage(newPackage);

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

      if (newPackage.name) {
        if (isEditMode && editingPackageId) {
          dispatch(
            updatePackage({
              ...newPackage,
              subServiceID: packages.id,
              serviceID: subServices.id,
              id: editingPackageId,
            })
          );
          setIsEditMode(false);
        } else {
          try {
            // Dispatch the setServices action
            const newAddedPackage = {
              ...newPackage,
              id: Date.now().toString(), // Optional unique ID
              subServiceID: packages.id,
              serviceID: subServices.id,
            };

            dispatch(addPackage(newAddedPackage));
          } catch (error) {
            if (error.payload?.type === "validation") {
              //   setErrors(error.payload.errors);
            } else {
              // General server error
              // notifyError(error.payload?.message || "Failed to add expense");
            }
          }
        }
      }

      // dispatch(setPackages(newAddedService));
      setNewPackage({});
      setPackageDialogOpen(false);
    },
    [newPackage, isEditMode, editingPackageId]
  );

  const handleDeletePackage = useCallback((packageContent) => {
    // setSelectedPackageId(PackageContent.id);
    setPackageToDelete(packageContent?.id);
    // setPackageDeleteDialogOpen(true);
    setPackageToDelete(packageContent);
    // setSelectedPackageId(PackageContent.id);
    // if (PackageContent.id) {
    //   setPackageToDelete(PackageContent.id);
    setPackageDeleteDialogOpen(true);
    // }
  }, []);

  const handleCancelDeletePackage = useCallback(() => {
    // setNewService({});
    // setServiceErrors({});
    setPackageDeleteDialogOpen(false);
    // setPackageToDelete(null);
    // setSelectedPackageId(null);
  }, []);

  const confirmDeletePackage = useCallback(
    async (e) => {
      e.preventDefault();
      const contentToDelete = {
        id: packageToDelete.id,
        subServiceID: packages.id,
        serviceID: subServices.id,
      };

      if (packageToDelete) {
        dispatch(deletePackage(contentToDelete));
        setPackageDeleteDialogOpen(false);
        setPackageToDelete(null);
      }
    },
    [packageToDelete]
  );

  const totalSubServices = services.reduce(
    (acc, service) => acc + service.content.length,
    0
  );
  const totalPackages = services.reduce(
    (acc, service) =>
      acc +
      service.content.reduce(
        (subAcc, sub) => subAcc + sub.pricingPlan.length,
        0
      ),
    0
  );

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
      <div className="mx-auto max-w-7xl">
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
                Services Management
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#cab06d", fontWeight: "300" }}
              >
                Manage your services, sub-services, and packages all in one
                place
              </Typography>
            </Box>
          </Box>
        </Box>

        <div className="space-y-6">
          {/* Stats Overview */}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item size={4} xs={12} sm={6} md={3}>
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
                        color: "#2e7d32",
                        width: 56,
                        height: 56,
                      }}
                    >
                      <Building2 />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#2e7d32" }}
                      >
                        {services.length}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#66bb6a" }}>
                        Total Services
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={4} xs={12} sm={6} md={3}>
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
                      <Settings />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#d32f2f" }}
                      >
                        {totalSubServices}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#f44336" }}>
                        Sub-Services
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item size={4} xs={12} sm={6} md={3}>
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
                      <Package />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#f57c00" }}
                      >
                        {totalPackages}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ff9800" }}>
                        Total Packages
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Management Interface */}
          <Card className="min-h-[700px]">
            <CardHeader
              title={
                <div className="flex items-start justify-between">
                  <div>
                    <span>Service Management</span>
                    <div>
                      {selectedService && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[15px]">Current Service:</span>
                          <Chip
                            variant="outlined"
                            label={selectedService.title}
                            sx={{
                              height: "20px",
                            }}
                          ></Chip>
                          {selectedSubService && (
                            <div className="flex items-center gap-1">
                              <ArrowRight className="h-4" />
                              <Chip
                                variant="secondary"
                                label={selectedSubService.title}
                                sx={{
                                  height: "20px",
                                }}
                              ></Chip>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              }
            ></CardHeader>

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
                  <Tab label="Services" value="services" />
                  <Tab
                    label="Sub-Services"
                    value="subservices"
                    // disabled={!selectedService}
                  />
                  <Tab
                    label="Packages"
                    value="packages"
                    // disabled={!selectedSubService}
                  />
                </TabList>

                <TabPanel value="services">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Services</h3>

                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleClickAddService}
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

                    <div className="border rounded-lg">
                      <Table>
                        <TableHead className="bg-[#ffe49f4f]">
                          <TableRow>
                            <TableCell>Service Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell className="text-center">
                              Sub-Services
                            </TableCell>
                            <TableCell className="text-center">
                              Total Packages
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {services.map((service) => {
                            const totalPackages = service.content.reduce(
                              (acc, sub) => acc + sub.pricingPlan.length,
                              0
                            );
                            // const totalPackages = 6;
                            const isSelected =
                              selectedService?.id === service.id;

                            return (
                              <TableRow
                                key={service.id}
                                className={`cursor-pointer transition-colors 
                                  ${
                                    isSelected
                                      ? "bg-blue-50 border-l-4"
                                      : "hover:bg-gray-50"
                                  }
                                `}
                                style={{
                                  borderLeft: isSelected
                                    ? `2px solid ${service?.color || "#149ceb"}`
                                    : `2px solid ${
                                        service?.color || "#149ceb"
                                      }`,
                                }}
                                onClick={() => handleServiceClick(service)}
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {service.title}
                                    {isSelected && (
                                      <ChevronRight className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {service.description || "No description"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Chip
                                    variant="secondary"
                                    label={service.content.length}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Chip
                                    variant="outline"
                                    label={totalPackages}
                                  ></Chip>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      // variant="ghost"
                                      sx={{
                                        color: "#cab06d",
                                        "&:hover": {
                                          backgroundColor: "#cab06d20",
                                        },
                                      }}
                                      size="md"
                                      onClick={(e) =>
                                        handleEditService(service, e)
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                      // variant="ghost"
                                      sx={{
                                        color: "red",
                                        "&:hover": {
                                          backgroundColor: "#ff000020",
                                        },
                                      }}
                                      size="md"
                                      onClick={(e) =>
                                        handleDeleteService(service, e)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* <ServiceDialog
                      open={dialogOpen}
                      onOpenChange={setDialogOpen}
                      service={editingService}
                    /> */}

                    <Dialog
                      open={serviceDialogOpen}
                      onClose={handleCloseDialService}
                      sx={{
                        ".MuiPaper-root": {
                          borderRadius: "15px",
                        },
                        ".MuiDialogContent-root": {
                          width: "400px",
                          boxSizing: "border-box",
                        },
                      }}
                    >
                      <DialogContent>
                        <DialogTitle
                          sx={{
                            paddingLeft: "8px",
                            paddingRight: 0,
                            paddingTop: 0,
                            fontWeight: "600",
                            color: "#cab06d",
                          }}
                        >
                          {isEditMode ? "Edit Service" : "Add Service"}
                        </DialogTitle>

                        <form className="popoverBody w-full box-border flex flex-col gap-6">
                          <Box
                            // component="form"
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              gap: 2, // Replaces the margin on children
                              boxSizing: "border-box",
                            }}
                            noValidate
                            autoComplete="off"
                            className="fieldsContainer"
                          >
                            <TextField
                              fullWidth
                              id="outlined-basic"
                              label="Service Name"
                              error={!!errors?.details?.title}
                              variant="outlined"
                              name="serviceName"
                              required
                              // disabled={!edit}
                              value={newService?.title || ""}
                              onChange={(e) => {
                                setNewService({
                                  ...newService,
                                  title: e.target.value,
                                });

                                setErrors((prevErrors) => ({
                                  ...prevErrors,

                                  details: {
                                    ...prevErrors.details, // Keep other errors in `expense`
                                    title: "", // Clear only the error for the field being updated
                                  },
                                }));
                              }}
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "30px",
                                  width: "100%",
                                },
                              }}
                            />

                            <TextField
                              id="outlined-basic"
                              label="Description"
                              multiline
                              rows={3}
                              variant="outlined"
                              name="serviceDescription"
                              value={newService?.description || ""}
                              onChange={(e) =>
                                setNewService({
                                  ...newService,
                                  description: e.target.value,
                                })
                              }
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "30px",
                                  width: "100%",
                                },
                              }}
                            />

                            <FormControl
                              fullWidth
                              sx={{
                                ".MuiInputBase-root": {
                                  borderRadius: "30px",
                                  width: "100%",
                                },
                              }}
                            >
                              <InputLabel>Color</InputLabel>
                              <Select
                                value={newService?.color || ""}
                                // value={5654}
                                label="Color"
                                onChange={(event) => {
                                  setNewService({
                                    ...newService,
                                    color: event.target.value,
                                  });
                                }}
                                renderValue={(selected) => {
                                  if (!selected) return <em>Select a color</em>;
                                  return (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: "100%",
                                          height: 24,
                                          borderRadius: "10px",
                                          backgroundColor: selected,
                                          border: "1px solid #ccc",
                                        }}
                                      />
                                    </Box>
                                  );
                                }}
                                // MenuProps={{
                                //   PaperProps: {
                                //     sx: {
                                //       maxHeight: 300,
                                //       padding: 1,
                                //       display: "flex",
                                //       flexWrap: "wrap",
                                //       gap: 1,
                                //       width: 250,
                                //     },
                                //   },
                                // }}
                              >
                                {/* <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    padding: 1,
                                    width: 250,
                                  }}
                                > */}
                                {serviceColors.map((color) => (
                                  <MenuItem
                                    value={color}
                                    key={color}
                                    sx={{ padding: 0.5 }}
                                  >
                                    <Box
                                      sx={{
                                        pointerEvents: "none",
                                        width: "100%",
                                        height: 24,
                                        borderRadius: "10px",
                                        backgroundColor: color,
                                        border: "1px solid #ccc",
                                        margin: "auto",
                                      }}
                                    >
                                      {/* {color} */}
                                    </Box>
                                  </MenuItem>
                                ))}
                                {/* </Box> */}
                              </Select>
                            </FormControl>
                          </Box>

                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleCloseDialService()}
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
                              onClick={(e) => handleAddOrUpdateService(e)}
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
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <DeleteConfirmDialog
                      open={serviceDeleteDialogOpen}
                      onOpenChange={handleCancelDeleteService}
                      onConfirm={confirmDeleteService}
                      title={`Delete ${serviceToDelete?.title}`}
                      description="Are you sure you want to delete this service? This will also delete all sub-services and packages associated with it."
                    />
                  </div>
                </TabPanel>

                <TabPanel value="subservices">
                  {selectedService ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        {/* <div> */}
                        <h3 className="text-lg font-semibold">Sub-Services</h3>
                        {/* <p className="text-sm text-gray-600">
                            Managing: {selectedService.title}
                          </p> */}
                        {/* </div> */}

                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={handleClickAddSubservice}
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
                          Add Sub-Service
                        </Button>
                      </div>

                      {subServices?.content?.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                              <h4 className="text-lg font-semibold mb-2">
                                No sub-service yet
                              </h4>
                              <p className="text-gray-600 mb-4">
                                Create your first sub-service to get started
                              </p>
                              <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleClickAddSubservice}
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
                                Add First Sub-service
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHead className="bg-[#ffe49f4f]">
                              <TableRow>
                                <TableCell>Sub-Service Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell className="text-center">
                                  Packages
                                </TableCell>
                                <TableCell align="center">Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {subServices?.content?.map((content) => {
                                const isSelected =
                                  selectedSubService?.id === content.id;

                                return (
                                  <TableRow
                                    key={content.id}
                                    className={`cursor-pointer transition-colors ${
                                      isSelected
                                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() =>
                                      handleSubServiceClick(content)
                                    }
                                  >
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        {content.title}
                                        {isSelected && (
                                          <ChevronRight className="h-4 w-4 text-blue-500" />
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                      {content.description || "No description"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Chip
                                        variant="secondary"
                                        label={content.pricingPlan.length}
                                      ></Chip>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          sx={{
                                            color: "#cab06d",
                                            "&:hover": {
                                              backgroundColor: "#cab06d20",
                                            },
                                          }}
                                          onClick={(e) =>
                                            handleEditSubservice(content, e)
                                          }
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          sx={{
                                            color: "red",
                                            "&:hover": {
                                              backgroundColor: "#ff000020",
                                            },
                                          }}
                                          onClick={(e) =>
                                            handleDeleteSubservice(content, e)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      <Dialog
                        open={subserviceDialogOpen}
                        onClose={handleCloseDialSubservice}
                        sx={{
                          ".MuiPaper-root": {
                            borderRadius: "15px",
                          },
                          ".MuiDialogContent-root": {
                            width: "400px",
                            boxSizing: "border-box",
                          },
                        }}
                      >
                        <DialogContent>
                          <DialogTitle
                            sx={{
                              paddingLeft: "8px",
                              paddingRight: 0,
                              paddingTop: 0,
                              fontWeight: "600",
                              color: "#cab06d",
                            }}
                          >
                            {isEditMode
                              ? "Edit Sub-service"
                              : "Add Sub-service"}
                          </DialogTitle>

                          <form className="popoverBody w-full box-border flex flex-col gap-6">
                            <Box
                              component="form"
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                gap: 2, // Replaces the margin on children
                                boxSizing: "border-box",
                              }}
                              noValidate
                              autoComplete="off"
                              className="fieldsContainer"
                            >
                              <TextField
                                id="outlined-basic"
                                label="Sub-service Name"
                                error={!!errors?.details?.title}
                                variant="outlined"
                                name="subserviceName"
                                required
                                // disabled={!edit}
                                value={newSubservice?.title || ""}
                                onChange={(e) => {
                                  setNewSubservice({
                                    ...newSubservice,
                                    title: e.target.value,
                                  });
                                  setErrors({});
                                }}
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Description"
                                variant="outlined"
                                name="subserviceDescription"
                                multiline
                                rows={3}
                                value={newSubservice?.description || ""}
                                onChange={(e) =>
                                  setNewSubservice({
                                    ...newSubservice,
                                    description: e.target.value,
                                  })
                                }
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                            </Box>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                sx={{
                                  color: "#cab06d",
                                  "&:hover": {
                                    color: "#9f874b",
                                  },
                                }}
                                onClick={() => handleCloseDialSubservice()}
                              >
                                Cancel
                              </Button>

                              <Button
                                variant="contained"
                                // startIcon={<Add />}
                                onClick={(e) => handleAddOrUpdateSubService(e)}
                                sx={{
                                  bgcolor: "#cab06d",
                                  "&:hover": {
                                    bgcolor: "#9f874b",
                                    boxShadow: "none",
                                  },
                                  textTransform: "none",
                                  fontWeight: 500,
                                  borderRadius: 3,
                                  // px: 3,
                                  // py: 1.5,
                                  boxShadow: "none",
                                }}
                              >
                                {isEditMode ? "UPDATE" : "ADD"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <DeleteConfirmDialog
                        open={subserviceDeleteDialogOpen}
                        onOpenChange={handleCancelDeleteSubservice}
                        onConfirm={confirmDeleteSubservice}
                        title={`Delete ${subserviceToDelete?.title}`}
                        description="Are you sure you want to delete this sub-service? This will also delete all sub-services and packages associated with it."
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Please select a service first
                    </div>
                  )}
                </TabPanel>

                <TabPanel value="packages">
                  {selectedSubService ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        {/* <div> */}
                        <h3 className="text-lg font-semibold">Packages</h3>
                        {/* <p className="text-sm text-gray-600">
                            Managing: {selectedService.title} →{" "}
                            {selectedSubService.title}
                          </p> */}
                        {/* </div> */}
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={handleClickAddPackage}
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
                          Add Package
                        </Button>
                      </div>

                      {packages?.pricingPlan?.length === 0 ? (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                              <h4 className="text-lg font-semibold mb-2">
                                No packages yet
                              </h4>
                              <p className="text-gray-600 mb-4">
                                Create your first package to get started
                              </p>
                              <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleClickAddPackage}
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
                                Add First Package
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {packages?.pricingPlan?.map((pkg) => (
                            <Card
                              key={pkg.id}
                              className="hover:shadow-md transition-shadow"
                              sx={{
                                width: "100%",
                                display: "flex",
                                borderRadius: 3,
                                flexDirection: "column",
                                justifyContent: "space-between",
                                // backgroundColor:
                                //   note.status === "done"
                                //     ? "#f3f4f6"
                                //     : "#ffffff",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                                transition: "all 0.3s ease",
                                border: "1px solid rgba(0,0,0,0.08)",
                                "&:hover": {
                                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                                  transform: "translateY(-2px)",
                                },
                                "& *": {
                                  // Targets ALL elements inside Card
                                  // opacity: note.status === "done" ? 0.9 : 1,
                                  transition: "opacity 0.3s ease",
                                },
                              }}
                            >
                              <CardHeader
                                className="pb-3"
                                title={
                                  <div className="flex items-start justify-between">
                                    <p className="text-lg">{pkg.name}</p>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        sx={{
                                          color: "#cab06d",
                                          width: "10px",
                                          "&:hover": {
                                            backgroundColor: "#cab06d20",
                                          },
                                        }}
                                        onClick={(e) =>
                                          handleEditPackage(pkg, e)
                                        }
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        sx={{
                                          color: "red",
                                          "&:hover": {
                                            backgroundColor: "#ff000020",
                                          },
                                        }}
                                        onClick={() => handleDeletePackage(pkg)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                }
                              ></CardHeader>
                              <CardContent className="space-y-3">
                                {pkg.description && (
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {pkg.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <div className="flex items-center gap-2">
                                      {pkg.promoPrice ? (
                                        <>
                                          <span className="font-bold text-green-600">
                                            ${pkg.promoPrice}
                                          </span>
                                          <span className="text-sm text-gray-500 line-through">
                                            ${pkg.price}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="font-bold">
                                          ${pkg.price}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {pkg.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <Chip
                                        variant="outline"
                                        className="text-xs"
                                        sx={{
                                          height: "25px",
                                        }}
                                        label={`${pkg.duration}min`}
                                      ></Chip>
                                    </div>
                                  )}
                                </div>

                                {pkg.promoPrice && (
                                  <div className="text-xs text-green-600 font-medium">
                                    Save $
                                    {(pkg.price - pkg.promoPrice).toFixed(2)}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      <Dialog
                        open={packageDialogOpen}
                        onClose={handleCloseDialPackage}
                        sx={{
                          ".MuiPaper-root": {
                            borderRadius: "15px",
                          },
                          ".MuiDialogContent-root": {
                            width: "400px",
                            boxSizing: "border-box",
                          },
                        }}
                      >
                        <DialogContent>
                          <DialogTitle
                            sx={{
                              paddingLeft: "8px",
                              paddingRight: 0,
                              paddingTop: 0,
                              fontWeight: "600",
                              color: "#cab06d",
                            }}
                          >
                            {isEditMode ? "Edit Package" : "Add Package"}
                          </DialogTitle>

                          <form className="popoverBody w-full box-border flex flex-col gap-6">
                            <Box
                              component="form"
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                gap: 2, // Replaces the margin on children
                                boxSizing: "border-box",
                              }}
                              noValidate
                              autoComplete="off"
                              className="fieldsContainer"
                            >
                              <TextField
                                id="outlined-basic"
                                label="Name"
                                variant="outlined"
                                name="name"
                                error={!!errors?.details?.name || false}
                                required
                                value={newPackage?.name || ""}
                                onChange={(e) => {
                                  setNewPackage({
                                    ...newPackage,
                                    name: e.target.value,
                                  });

                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    details: {
                                      ...prevErrors.details,
                                      name: "",
                                    },
                                  }));
                                }}
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Description"
                                multiline
                                rows={3}
                                variant="outlined"
                                name="description"
                                value={newPackage?.description || ""}
                                onChange={(e) =>
                                  setNewPackage({
                                    ...newPackage,
                                    description: e.target.value,
                                  })
                                }
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />

                              <TextField
                                id="outlined-basic"
                                label="Price"
                                variant="outlined"
                                type="number"
                                name="price"
                                error={!!errors?.details?.price}
                                required
                                value={newPackage?.price || ""}
                                onChange={(e) => {
                                  setNewPackage({
                                    ...newPackage,
                                    price: e.target.value,
                                  });

                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    details: {
                                      ...prevErrors.details,
                                      price: "",
                                    },
                                  }));
                                }}
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Promo Price"
                                variant="outlined"
                                type="number"
                                name="promoPrice"
                                value={newPackage?.promoPrice || ""}
                                onChange={(e) =>
                                  setNewPackage({
                                    ...newPackage,
                                    promoPrice: e.target.value,
                                  })
                                }
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                              <TextField
                                id="outlined-basic"
                                label="Duration"
                                variant="outlined"
                                type="number"
                                name="duration"
                                value={newPackage?.duration || ""}
                                onChange={(e) =>
                                  setNewPackage({
                                    ...newPackage,
                                    duration: e.target.value,
                                  })
                                }
                                sx={{
                                  ".MuiInputBase-root": {
                                    borderRadius: "30px",
                                    width: "100%",
                                  },
                                }}
                              />
                            </Box>

                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleCloseDialPackage()}
                                sx={{
                                  color: "#cab06d",
                                  "&:hover": {
                                    color: "#9f874b",
                                  },
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="contained"
                                onClick={(e) => handleAddOrUpdatePackage(e)}
                                sx={{
                                  bgcolor: "#cab06d",
                                  "&:hover": {
                                    bgcolor: "#9f874b",
                                    boxShadow: "none",
                                  },
                                  textTransform: "none",
                                  fontWeight: 500,
                                  borderRadius: 3,
                                  // px: 3,
                                  // py: 1.5,
                                  boxShadow: "none",
                                }}
                              >
                                {isEditMode ? "UPDATE" : "ADD"}
                              </Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <DeleteConfirmDialog
                        open={packageDeleteDialogOpen}
                        onOpenChange={handleCancelDeletePackage}
                        onConfirm={confirmDeletePackage}
                        title={`Delete ${packageToDelete?.name}`}
                        description="Are you sure you want to delete this package? This action cannot be undone."
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Please select a sub-service first
                    </div>
                  )}
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
};

export default PackageInfo;
