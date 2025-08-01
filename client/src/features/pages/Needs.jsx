"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  Typography,
  Chip,
  Grid,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Menu,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Avatar,
  Backdrop,
} from "@mui/material";
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Spa,
  LocalFlorist,
  CleaningServices,
  Hotel,
  Restaurant,
  FitnessCenter,
  Close,
  ShoppingCart,
  Inventory,
  PriorityHigh,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setupAllUtilsListeners } from "../notes/slices/utilsSlice.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  addNeed,
  deleteNeed,
  updateNeed,
} from "../notes/utilsThunks/utilsThunks";
import { validateNeeds } from "../../utils/validators.js";
import { modalStyle, backdropStyle } from "../utils/styles.js";
import {
  categories,
  getCategoryInfo,
  getPriorityColor,
  getStatusColor,
  initNeed,
} from "../needs/utils/needsUtils.js";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog.jsx";

const Needs = () => {
  const dispatch = useDispatch();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedNeedId, setSelectedNeedId] = useState(null);
  const [editingNeedId, setEditingNeedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [needToDelete, setNeedToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNeed, setNewNeed] = useState(initNeed);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errors, setErrors] = useState({});

  const needs = useSelector((state) => state.utils.needs);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = dispatch(setupAllUtilsListeners());
    return () => unsubscribe();
  }, [dispatch]);

  const filteredNeeds = needs.filter((need) => {
    const matchesSearch =
      need.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || need.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || need.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenModal = useCallback(() => {
    setIsEditMode(false);
    setEditingNeedId(null);
    setNewNeed({
      name: "",
      category: "skincare",
      description: "",
      quantity: 1,
      unit: "",
      priority: "normal",
      estimatedCost: 0,
      supplier: "",
      dueDate: "",
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setErrors({});
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingNeedId(null);
  }, []);

  const handleMenuClick = useCallback((event, needId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNeedId(needId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedNeedId(null);
  }, []);

  const handleEditNeed = useCallback(() => {
    if (selectedNeedId) {
      const needToEdit = needs.find((need) => need.id === selectedNeedId);
      if (needToEdit) {
        setNewNeed({
          name: needToEdit.name,
          category: needToEdit.category,
          description: needToEdit.description,
          quantity: needToEdit.quantity,
          unit: needToEdit.unit,
          priority: needToEdit.priority,
          estimatedCost: needToEdit.estimatedCost,
          supplier: needToEdit.supplier || "",
          dueDate: needToEdit.dueDate
            ? dayjs(needToEdit.dueDate).format("DD/MM/YYYY")
            : "",
        });
        setIsEditMode(true);
        setEditingNeedId(selectedNeedId);
        setIsModalOpen(true);
      }
    }
    handleMenuClose();
  }, [selectedNeedId, needs, handleMenuClose]);

  const handleDeleteNeed = useCallback(() => {
    if (selectedNeedId) {
      setNeedToDelete(selectedNeedId);
      setDeleteConfirmOpen(true);
    }
    handleMenuClose();
  }, [selectedNeedId, handleMenuClose]);

  const handleConfirmDelete = useCallback(() => {
    if (needToDelete) {
      dispatch(deleteNeed(needToDelete));
      setDeleteConfirmOpen(false);
      setNeedToDelete(null);
    }
  }, [needToDelete]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setNeedToDelete(null);
  }, []);

  const handleChangeStatus = useCallback(
    (newStatus) => {
      if (selectedNeedId) {
        const concernedNeed = needs.find((need) => need.id === selectedNeedId);

        const updatedNeed = {
          ...concernedNeed,
          status: newStatus,
          updatedAt: new Date().toISOString(), // Add update timestamp
        };

        dispatch(updateNeed(updatedNeed));
      }
      handleMenuClose();
    },
    [selectedNeedId, handleMenuClose]
  );

  const handleAddOrUpdateNeed = useCallback(async () => {
    try {
      const { isValid, errors } = validateNeeds(newNeed);
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
    if (newNeed.name && newNeed.unit) {
      // Convert dueDate to ISO string only if it exists
      const dueDateISO = newNeed.dueDate
        ? dayjs(newNeed.dueDate, "DD/MM/YYYY").toISOString()
        : undefined;

      if (isEditMode && editingNeedId) {
        // Update existing need
        dispatch(
          updateNeed({
            ...newNeed,
            id: editingNeedId,
            dueDate: dueDateISO, // Store as ISO string
          })
        );
      } else {
        // Add new need
        const need = {
          id: Date.now().toString(),
          ...newNeed,
          status: "needed",
          dateAdded: new Date().toISOString(),
          dueDate: dueDateISO, // Store as ISO string
          supplier: newNeed.supplier || undefined,
        };
        await dispatch(addNeed(need)).unwrap();
      }
      handleCloseModal();
    }
  }, [newNeed, isEditMode, editingNeedId, handleCloseModal]);

  const totalEstimatedCost = needs.reduce(
    (sum, need) => sum + need.estimatedCost,
    0
  );

  const urgentNeeds = needs.filter((need) => need.priority === "urgent").length;
  const pendingNeeds = needs.filter((need) => need.status === "needed").length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: "transparent",
        overflow: "auto",
        backdropFilter: "blur(15px)",

        p: { xs: 2, md: 3, lg: 4 },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto", maxWidth: "1280px" }}>
        {/* Header */}
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
                SPA Product Management
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#cab06d", fontWeight: "300" }}
              >
                Manage your spa center's product needs and inventory
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenModal}
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
              Add Product Need
            </Button>
          </Box>
        </Box>

        {/* Filters and Search */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4} width={"40%"}>
              <TextField
                placeholder="Search products, descriptions, or suppliers..."
                variant="outlined"
                size="medium"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  label="Category"
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} width={"15%"}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ bgcolor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="needed">Needed</MenuItem>
                  <MenuItem value="ordered">Ordered</MenuItem>
                  <MenuItem value="received">Received</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item size={3} xs={12} sm={6} md={3}>
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
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#2e7d32" }}
                    >
                      {needs.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#66bb6a" }}>
                      Total Products
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={3} xs={12} sm={6} md={3}>
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
                    <PriorityHigh />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      {urgentNeeds}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#f44336" }}>
                      Urgent Needs
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={3} xs={12} sm={6} md={3}>
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
                    <ShoppingCart />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#f57c00" }}
                    >
                      {pendingNeeds}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ff9800" }}>
                      Pending Orders
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item size={3} xs={12} sm={6} md={3}>
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
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      $
                    </Typography>
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      ${totalEstimatedCost}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#2196f3" }}>
                      Total Cost
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Products Grid */}
        <Grid container spacing={3}>
          {filteredNeeds.map((need) => {
            const categoryInfo = getCategoryInfo(need.category);
            return (
              <Grid item size={4} xs={12} sm={6} lg={4} key={need.id}>
                <Card
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
                    border:
                      need.priority === "urgent"
                        ? "2px solid #f44336"
                        : "1px solid #e0e0e0",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: categoryInfo.color,
                            color: "#2e7d32",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {categoryInfo.icon}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "600",
                              color: "#2e7d32",
                              mb: 0.5,
                            }}
                          >
                            {need.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#66bb6a" }}
                          >
                            {categoryInfo.label}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, need.id)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ color: "#555", mb: 2, lineHeight: 1.6 }}
                    >
                      {need.description}
                    </Typography>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={need.priority}
                        size="small"
                        color={getPriorityColor(need.priority)}
                        variant="outlined"
                      />
                      <Chip
                        label={need.status}
                        size="small"
                        color={getStatusColor(need.status)}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Quantity:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                          {need.quantity} {need.unit}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Est. Cost:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "600", color: "#2e7d32" }}
                        >
                          ${need.estimatedCost}
                        </Typography>
                      </Box>
                      {need.supplier && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Supplier:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "600" }}
                          >
                            {need.supplier}
                          </Typography>
                        </Box>
                      )}
                      {need.dueDate && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            Due Date:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "600",
                              color:
                                new Date(need.dueDate) < new Date()
                                  ? "#f44336"
                                  : "#666",
                            }}
                          >
                            {new Date(need.dueDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredNeeds.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#f5f5f5",
                color: "#9e9e9e",
                mx: "auto",
                mb: 2,
              }}
            >
              <Search sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: "#666", mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body1" sx={{ color: "#999" }}>
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: { borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
          }}
        >
          <MenuItem onClick={() => handleChangeStatus("needed")}>
            <ListItemIcon>
              <ShoppingCart fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Mark as Needed</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus("ordered")}>
            <ListItemIcon>
              <Inventory fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Mark as Ordered</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus("received")}>
            <ListItemIcon>
              <Inventory fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Mark as Received</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleEditNeed}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Product</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteNeed} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Delete Product</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add/Edit Modal */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
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
              width: { xs: "90%", sm: 600 },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "600", color: "#cab06d" }}
              >
                {isEditMode ? "Edit Product Need" : "Add New Product Need"}
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} size={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={newNeed.name}
                  onChange={(e) => {
                    setNewNeed({ ...newNeed, name: e.target.value });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      details: {
                        ...prevErrors.details,
                        name: null,
                      },
                    }));
                  }}
                  required
                  error={!!errors?.details?.name}
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} size={6}>
                <FormControl
                  fullWidth
                  required
                  sx={{
                    ".MuiOutlinedInput-notchedOutline": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newNeed.category}
                    label="Category"
                    onChange={(e) =>
                      setNewNeed({
                        ...newNeed,
                        category: e.target.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {category.icon}
                          {category.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} size={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newNeed.description}
                  onChange={(e) =>
                    setNewNeed({ ...newNeed, description: e.target.value })
                  }
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} size={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  error={!!errors?.details?.quantity}
                  type="number"
                  value={newNeed.quantity}
                  onChange={(e) =>
                    setNewNeed({
                      ...newNeed,
                      quantity: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  required
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} size={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  error={!!errors?.details?.unit}
                  placeholder="e.g., bottles, pieces, liters, Kg"
                  value={newNeed.unit}
                  onChange={(e) => {
                    setNewNeed({ ...newNeed, unit: e.target.value });
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      details: {
                        ...prevErrors.details,
                        unit: null,
                      },
                    }));
                  }}
                  required
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4} size={6}>
                <FormControl
                  fullWidth
                  sx={{
                    ".MuiOutlinedInput-notchedOutline": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                >
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newNeed.priority}
                    label="Priority"
                    onChange={(e) =>
                      setNewNeed({
                        ...newNeed,
                        priority: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} size={6}>
                <TextField
                  fullWidth
                  label="Estimated Cost"
                  type="number"
                  value={newNeed.estimatedCost}
                  onChange={(e) =>
                    setNewNeed({
                      ...newNeed,
                      estimatedCost: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} size={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={newNeed.supplier}
                  onChange={(e) =>
                    setNewNeed({ ...newNeed, supplier: e.target.value })
                  }
                  sx={{
                    ".MuiInputBase-root": {
                      borderRadius: "30px",
                      width: "100%",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} size={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    value={
                      newNeed.dueDate
                        ? dayjs(newNeed.dueDate, "DD/MM/YYYY").isValid()
                          ? dayjs(newNeed.dueDate, "DD/MM/YYYY")
                          : null
                        : null
                    }
                    onChange={(newValue) => {
                      const isoDate = newValue.toISOString();

                      // Option 2: Get formatted string (DD/MM/YYYY)
                      // const formattedDate = newValue.format("DD/MM/YYYY");
                      const formattedDate = dayjs(
                        newValue,
                        "DD/MM/YYYY"
                      ).toISOString();

                      setNewNeed({
                        ...newNeed,
                        dueDate: newValue ? newValue.format("DD/MM/YYYY") : "",
                      });
                    }}
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
              </Grid>
            </Grid>

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
                onClick={handleAddOrUpdateNeed}
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
                {isEditMode ? "UPDATE" : "ADD"}
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete Product Need`}
          description={`Are you sure you want to delete this product need? 
              This action cannot be undone.`}
        />
      
      </Box>
    </Box>
  );
};

export default Needs;
