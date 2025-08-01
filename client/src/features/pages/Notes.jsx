import {
  Close,
  Search,
  CheckCircleOutline,
  CheckCircle,
  MoreVert,
  Edit,
  Delete,
  Add,
} from "@mui/icons-material";
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
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, CircleCheck, Notebook, Plus, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setupAllUtilsListeners } from "../notes/slices/utilsSlice";
import {
  addNote,
  deleteNote,
  updateNote,
} from "../notes/utilsThunks/utilsThunks";
import { validateNote } from "../../utils/validators";
import { backdropStyle, modalStyle } from "../utils/styles";
import { getCategoryColor, initNote } from "../notes/utils/notesUtils";
import { getPriorityColor, getStatusColor } from "../needs/utils/needsUtils";
import DeleteConfirmDialog from "../communComponents/DeleteConfirmDialog";

const Notes = () => {
  const dispatch = useDispatch();

  const employees = useSelector((state) => state.employees.employees);
  const { user } = useSelector((state) => state.auth);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newNote, setNewNote] = useState(initNote);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [errors, setErrors] = useState({});

  const notes = useSelector((state) => state.utils.notes);
  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.writer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = dispatch(setupAllUtilsListeners());
    return () => unsubscribe();
  }, [dispatch]);

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedNoteId(null);
  };

  const handleMenuClick = (event, noteId) => {
    setAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
  };

  const handleCloseModal = () => {
    setErrors({});
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingNoteId(null);
    setNewNote({ content: "", writer: "", priority: "medium", category: "" });
  };

  const handleEditNote = useCallback(() => {
    if (selectedNoteId) {
      const noteToEdit = notes.find((note) => note.id === selectedNoteId);

      if (noteToEdit) {
        setNewNote({
          content: noteToEdit.content,
          writer: noteToEdit.writer.fullName, // Use fullName instead of object
          priority: noteToEdit.priority,
          category: noteToEdit.category,
        });

        setIsEditMode(true);
        setEditingNoteId(selectedNoteId);
        setIsModalOpen(true);
      }
    }
    handleMenuClose();
  }, [selectedNoteId, notes, handleMenuClose]);

  const handleAddOrUpdateNote = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const { isValid, errors } = validateNote(newNote);

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
      if (newNote.content && newNote.writer && newNote.category) {
        const selectedEmployee = employees.find(
          (emp) =>
            `${emp.details.firstName} ${emp.details.lastName}` ===
            newNote.writer
        );

        if (selectedEmployee) {
          if (isEditMode && editingNoteId) {
            dispatch(
              updateNote({
                ...newNote,
                writer: {
                  id: selectedEmployee.id,
                  fullName: `${selectedEmployee.details.firstName} ${selectedEmployee.details.lastName}`,
                  email: selectedEmployee.details.email,
                  phone: selectedEmployee.details.phone,
                },
                id: editingNoteId,
              })
            );
          } else {
            // Add new note
            const note = {
              id: Date.now().toString(),
              content: newNote.content,
              completedDate: new Date().toISOString().split("T")[0],
              writer: {
                id: selectedEmployee.id,
                fullName: `${selectedEmployee.details.firstName} ${selectedEmployee.details.lastName}`,
                email: selectedEmployee.details.email,
                phone: selectedEmployee.details.phone,
              },
              priority: newNote.priority,
              category: newNote.category,
              takenBy: user.displayName,
              status: "pending",
            };

            try {
              // setSavingData(initSaving);
              await dispatch(addNote(note)).unwrap();
            } catch (error) {
              if (error.payload?.type === "validation") {
                //   setErrors(error.payload.errors);
              } else {
                // General server error
                // notifyError(error.payload?.message || "Failed to add expense");
              }
            }

            // setNotes((prevNotes) => [note, ...prevNotes]);
          }
          handleCloseModal();
        }
      }
    },
    [newNote, isEditMode, editingNoteId, handleCloseModal]
  );

  const handleToggleStatus = useCallback(() => {
    if (selectedNoteId) {
      const concernedNote = notes.find((note) => note.id === selectedNoteId);
      const newStatus = concernedNote.status === "done" ? "pending" : "done";

      const updatedNote = {
        ...concernedNote,
        status: newStatus,
        updatedAt: new Date().toISOString(), // Add update timestamp
      };

      dispatch(updateNote(updatedNote));
    }
    handleMenuClose();
  }, [selectedNoteId, notes, handleMenuClose, dispatch]);

  const handleNoteDataChange = (event) => {
    setNewNote((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      details: {
        ...prevErrors.details,
        [event.target.name]: "",
      },
    }));
  };

  const handleDeleteNote = useCallback(() => {
    if (selectedNoteId) {
      setNoteToDelete(selectedNoteId);
      setDeleteConfirmOpen(true);
    }
    handleMenuClose();
  }, [selectedNoteId, handleMenuClose]);

  const handleConfirmDelete = useCallback(() => {
    if (noteToDelete) {
      dispatch(deleteNote(noteToDelete));
      setDeleteConfirmOpen(false);
      setNoteToDelete(null);
    }
  }, [noteToDelete]);

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setNoteToDelete(null);
  };

  const selectedNote = selectedNoteId
    ? notes.find((note) => note.id === selectedNoteId)
    : null;

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
                Employee Notes
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#cab06d", fontWeight: "300" }}
              >
                Manage and track notes from team members
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsModalOpen(true)}
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
              Add Note
            </Button>
          </Box>
        </Box>

        {/*Search */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4} width={"40%"}>
              <TextField
                placeholder="Search notes, employees, or categories..."
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
          </Grid>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item size={3} xs={2} sm={2} md={3}>
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
                    <Notebook />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#66bb6a" }}
                    >
                      {notes.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#66bb6a" }}>
                      Total Notes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={3} xs={2} sm={2} md={3}>
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
                    <CalendarDays />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      {notes.filter((n) => n.priority === "high").length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#f44336" }}>
                      High Priority
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={3} xs={2} sm={2} md={3}>
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
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#f57c00" }}
                    >
                      {notes.filter((n) => n.status === "done").length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ff9800" }}>
                      Completed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={3} xs={2} sm={2} md={3}>
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
                    <CircleCheck />
                    {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      $
                    </Typography> */}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      {notes.filter((n) => n.status === "pending").length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#2196f3" }}>
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Notes Grid */}
        <Grid container spacing={3}>
          {filteredNotes.map((note) => {
            return (
              <Grid item size={4} xs={2} sm={2} md={3} key={note.id}>
                <Card
                  size={3}
                  key={note.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  sx={{
                    width: "100%",
                    display: "flex",
                    borderRadius: 3,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border:
                      note.priority === "high" && note.status === "pending"
                        ? "2px solid #f44336"
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      note.status === "done" ? "#f3f4f6" : "#ffffff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                      transform: "translateY(-2px)",
                    },
                    "& *": {
                      // Targets ALL elements inside Card
                      opacity: note.status === "done" ? 0.9 : 1,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                >
                  <CardHeader
                    className="pb-2"
                    title={
                      <div className="!flex items-start justify-between w-full gap-3">
                        <div className="flex items-center gap-2">
                          <Avatar
                            className="h-10 w-10"
                            src={note.writer?.avatar}
                            alt={note.writer?.fullName}
                          ></Avatar>
                          <div>
                            <h1 className="text-sm font-medium text-gray-900">
                              {note.writer?.fullName}
                            </h1>
                            <p className="text-xs text-gray-500 mt-2">
                              {note.writer.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Chip
                            label={note.priority}
                            variant="outline"
                            sx={{
                              p: 0,
                              height: "20px",
                              ...getPriorityColor(note.priority), // Spread the color styles
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, note.id)}
                            sx={{ ml: 0.5 }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    }
                  ></CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Chip
                          label={note.category}
                          variant="outline"
                          sx={{
                            p: 0,
                            height: "20px",
                            ...getCategoryColor(note.category), // Spread the color styles
                          }}
                          //   className={`text-xs ${getPriorityColor(note.category)}`}
                        />
                        <Chip
                          label={note.status}
                          size="small"
                          color={getStatusColor(note.status)}
                          variant={
                            note.status === "done" ? "filled" : "outlined"
                          }
                          icon={
                            note.status === "done" ? (
                              <CheckCircle />
                            ) : (
                              <CheckCircleOutline />
                            )
                          }
                        />
                      </div>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#374151",
                          lineHeight: 1.6,
                          textDecoration:
                            note.status === "done" ? "line-through" : "none",
                        }}
                      >
                        {note.content}
                      </Typography>
                      <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                        <CalendarDays className="h-3 w-3" />
                        <span>
                          Completed on{" "}
                          {new Date(note.completedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredNotes.length === 0 && (
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
              No notes found
            </Typography>
            <Typography variant="body1" sx={{ color: "#999" }}>
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            ".MuiPaper-root": {
              boxShadow: "0px 0px 13px -2px  rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <MenuItem onClick={handleToggleStatus}>
            <ListItemIcon>
              {selectedNote?.status === "done" ? (
                <CheckCircleOutline fontSize="small" />
              ) : (
                <CheckCircle fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {selectedNote?.status === "done"
                ? "Mark as Pending"
                : "Mark as Done"}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleEditNote}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Note</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteNote} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Delete Note</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add/Edit Note Modal */}
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="add-note-modal"
          aria-describedby="add-note-form"
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              style: backdropStyle,
            },
          }}
        >
          <Paper sx={{ ...modalStyle, width: { xs: "90%", sm: 500 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "600", color: "#cab06d" }}
              >
                {isEditMode ? "Edit Note" : "Add New Note"}
              </Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <Close />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: "#cab06d", fontWeight: "300" }}
            >
              {isEditMode
                ? "Update the note details."
                : "Create a new note entry for an employee."}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
                error={!!errors?.details?.writer}
              >
                <InputLabel>Employee</InputLabel>
                <Select
                  value={newNote.writer || ""} // Ensure we have a fallback empty string
                  label="Employee"
                  name="writer"
                  disabled={isEditMode}
                  onChange={handleNoteDataChange}
                  
                >
                  {employees.map((employee) => {
                    const fullName = `${employee.details.firstName} ${employee.details.lastName}`;
                    return (
                      <MenuItem key={employee.id} value={fullName}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={employee.avatar}
                            alt={fullName}
                            sx={{ width: 24, height: 24 }}
                          />
                          {fullName}
                        </Box>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
                required
                label="Category"
                error={!!errors?.details?.category}
                placeholder="e.g., Development, Review, HR"
                value={newNote.category}
                name="category"
                onChange={handleNoteDataChange}
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
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={newNote.priority}
                  name="priority"
                  onChange={handleNoteDataChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "30px",
                    width: "100%",
                  },
                }}
                label="Note Content"
                placeholder="Enter note details..."
                multiline
                rows={4}
                value={newNote.content}
                name="content"
                required
                error={!!errors?.details?.content}
                onChange={handleNoteDataChange}
              />
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
                variant="contained"
                onClick={handleAddOrUpdateNote}
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
                {isEditMode ? "Update Note" : "Add Note"}
              </Button>
            </Box>
          </Paper>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={`Delete Note`}
          description={`Are you sure you want to delete this note?
              This action cannot be undone.`}
        />
      </div>
    </Box>
  );
};

export default Notes;
