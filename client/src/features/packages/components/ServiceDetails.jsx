import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Popover,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { servicesData } from "../../../../Services";
import { Add, Delete, Edit } from "@mui/icons-material";
import SubServiceDetails from "./SubServiceDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  addSubservice,
  deleteSubService,
  setPackages,
  updateSubService,
} from "../slices/packagesSlice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => (prop) =>
    !["subservicedeleted", "servicedeleted"].includes(prop),
})(({ theme, subservicedeleted, servicedeleted }) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },

  cursor: "pointer",

  ...(!subservicedeleted && {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  }),

  ...((subservicedeleted || servicedeleted) && {
    color: "red",
    fontWeight: "bold",

    "&:nth-of-type(odd)": {
      backgroundColor: "#ffe9ec",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#ffdce1",
    },
    "&:hover": {
      backgroundColor: "#ffcad3 !important",
      cursor: "pointer",
    },
  }),
}));

const ServiceDetails = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [newSubService, setNewSubService] = useState({});

  const [subServiceErrors, setSubServiceErrors] = useState({});
  const [subServiceToDelete, setSubServiceToDelete] = useState(false);
  const [subServiceToEdit, setSubServiceToEdit] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSubServiceId, setSelectedSubServiceId] = useState(false);
  const [editingSubServiceId, setEditingSubServiceId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const editMode = true;

  // to open popUp for adding subService
  //   const handleClick = (event) => {
  //     setAnchorEl(event.currentTarget);
  //   };

  //   const handleClose = () => {
  //     setAnchorEl(null);
  //     setNewSubService({});
  //     setSubServiceErrors({});
  //   };

  //   const subServiceValidateForm = () => {
  //     const newError = {};

  //     // Validate the service name
  //     if (!newSubService.title) {
  //       newError.title = "sub-Service Name is required !";
  //     }
  //     if (
  //       selectedService.content.find((subSrv) => subSrv.title?.trim() === newSubService?.title?.trim())
  //     ) {
  //       newError.title = "sub-Service Name already exists !";
  //     }

  //     setSubServiceErrors(newError);
  //     return {
  //       isValid: Object.keys(newError).length === 0,
  //       error: newError, // Optional: Return errors if needed
  //     };
  //   };

  //   const handleAddSubService = (e) => {
  //     e.preventDefault();

  //     const { isValid, error } = subServiceValidateForm();

  //     if (!isValid) {
  //       notifyError(error.title);
  //       return;
  //     }

  //     const newSubServiceToAdd = {
  //       ...newSubService,
  //       id: Date.now().toString(),
  //       pricingPlan: [],
  //     };

  //     dispatch(addSubService(newSubServiceToAdd));

  //     setNewSubService({});
  //     setAnchorEl(null);
  //   };

  //     const notifyError = (error) => {
  //       return toast.error(error, {
  //         style: {
  //           background: "rgba(230, 230, 230, 0.801)",
  //           // color: "#fff",
  //           backdropFilter: "blur(16px)",
  //         },
  //       });
  //     };

  //   const addSubServiceDB = async (docId, newSubService) => {
  //     const docRef = doc(db, "services", docId); // Replace with your collection name

  //     try {
  //       await updateDoc(docRef, {
  //         content: arrayUnion(newSubService), // Add the new sub-service to the `content` array
  //       });
  //     ;
  //     } catch (error) {
  //       console.error("Error adding sub-service: ", error);
  //     }
  //   };

  //   const handleClickOnSubService = (subServiceContent) => {

  //     dispatch(setPackages(subServiceContent.id));
  //   };

  //   const handleDeleteSubService = async (deletedSubService) => {

  //     try {
  //       // Filter out the sub-service to delete
  //       const updatedContent = selectedService.content.filter(
  //         (subService) => subService.id !== deletedSubService.id
  //       );

  //       const subServiceAlreadyDeleted = deletedSubServices?.find(
  //         (subService) => subService.id === deletedSubService.id
  //       );

  //       const serviceAlreadyDeleted = deletedServices?.find(
  //         (service) => service.id === selectedService.id
  //       );

  //     ;
  //       if (!serviceAlreadyDeleted) {
  //         if (subServiceAlreadyDeleted) {
  //           dispatch(
  //             setDeletedSubServices(
  //               deletedSubServices.filter(
  //                 (subSrv) => subSrv.id !== deletedSubService.id
  //               )
  //             )
  //           );
  //         } else {
  //           const restOfPackages = deletedPackages.filter((pkg) => {
  //             return pkg.subServiceID !== packages.id.toString();
  //           });

  //           dispatch(setDeletedPackages(restOfPackages));

  //         ;

  //           dispatch(
  //             addDeletedSubService({
  //               ...deletedSubService,
  //               serviceID: selectedService.id,
  //             })
  //           );
  //         }
  //       }

  //     } catch (error) {
  //       console.error("Error deleting sub-service: ", error);
  //     }
  //   };

  const selectedService = servicesData[2];
  const deletedSubServices = [servicesData[1].content[0]];
  const deletedServices = [servicesData[0]];
  const subServices = useSelector((state) => state.services.subServices);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setNewSubService({});
    setSubServiceErrors({});
    setIsEditMode(false);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedSubServiceId(null);
  }, []);

  const handleClickAddSubservice = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setSubServiceToDelete(null);
  }, []);

  const handleDeleteSubService = useCallback(
    (subServiceContent) => {
      setSelectedSubServiceId(subServiceContent.id);
      if (subServiceContent.id) {
        setSubServiceToDelete(subServiceContent.id);
        setDeleteConfirmOpen(true);
      }
      handleMenuClose();
    },
    [selectedSubServiceId, handleMenuClose]
  );

  const handleAddOrUpdateSubService = useCallback(
    async (e) => {
      e.preventDefault();
      console.log(subServices);

      if (newSubService.title) {
        if (isEditMode && editingSubServiceId) {
          console.log({
            ...newSubService,
            serviceID: subServices.id,
            id: editingSubServiceId,
          });

          dispatch(
            updateSubService({
              ...newSubService,
              serviceID: subServices.id,
              id: editingSubServiceId,
            })
          );
          setIsEditMode(false);
        } else {
          try {
            console.log(newSubService);

            // Dispatch the setServices action
            const newAddedSubService = {
              ...newSubService,
              id: Date.now().toString(), // Optional unique ID
              serviceID: subServices.id,
              pricingPlan: [],
            };
            console.log(newAddedSubService);
            dispatch(addSubservice(newAddedSubService));
          } catch (error) {
            console.log(error);
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
      setNewSubService({});
      setAnchorEl(null);
    },
    [newSubService, isEditMode, editingSubServiceId]
  );

  const handleConfirmDeleteSubservice = useCallback(
    async (e) => {
      console.log(subServiceToDelete);
      // Dispatch the setServices action
      const contentToDelete = {
        id: subServiceToDelete,
        serviceID: subServices.id,
      };
      console.log(contentToDelete);
      e.preventDefault();
      if (subServiceToDelete) {
        dispatch(deleteSubService(contentToDelete));
        setDeleteConfirmOpen(false);
        setSubServiceToDelete(null);
      }
    },
    [subServiceToDelete]
  );

  const handleEditSubservice = useCallback(
    (subServiceContent, event) => {
      event.stopPropagation(); // Prevent event bubbling if needed
      if (subServiceContent.id) {
        console.log(subServiceContent);
        setNewSubService(subServiceContent);
        setIsEditMode(true);
        setEditingSubServiceId(subServiceContent.id);
        setSelectedSubServiceId(subServiceContent.id);
        setSubServiceToEdit(subServiceContent.id);
        setAnchorEl(event.currentTarget);
      }
      // handleMenuClose();
    },
    [selectedSubServiceId, subServiceToEdit, handleMenuClose]
  );

  const handleClickOnSubService = useCallback((subServiceContent) => {
    dispatch(setPackages(subServiceContent.id));
  }, []);
  console.log(subServices);
  return (
    <div className="serviceDetails flex gap-5 h-full flex-[5] box-border mt-5 relative">
      <div className="serviceDetailsContainer flex-[4] h-full">
        <div className="header flex w-full items-center justify-between mb-5">
          <div className="headerTitle line-clamp-2 overflow-hidden text-ellipsis leading-snug max-h-[2.4em] text-xl font-bold">
            {subServices?.title}
          </div>
          {/* <div className="headerTitle">{selectedService?.title}</div> */}

          <div className="right">
            <button
              //   className={`addSubServBtn ${selectedService ? "" : "subServEmpty"}`}
              aria-describedby={id}
              onClick={handleClickAddSubservice}
              //   disabled={!editMode || !selectedService}
            >
              <Add />
            </button>
            <div>
              <Popover
                id={id}
                open={openPopover}
                anchorEl={anchorEl}
                // onClose={handleClose}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                disableEnforceFocus // Prevents focus enforcement inside the popover
                hideBackdrop
                PaperProps={{
                  className: "popover-container", // Add your custom class here
                }}
              >
                <div className="popoverWrapper">
                  <div className="popoverHeader">
                    <button
                      className="cancelSubPackageBtn"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>

                  <form className="popoverBody">
                    <Box
                      // component="form"
                      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                      noValidate
                      autoComplete="off"
                      className="fieldsContainer"
                    >
                      <TextField
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        name="name"
                        required
                        // error={!!subServiceErrors?.title}
                        value={newSubService?.title || ""}
                        onChange={(e) =>
                          setNewSubService({
                            ...newSubService,
                            title: e.target.value,
                          })
                        }
                      />
                      <TextField
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={newSubService?.description || ""}
                        onChange={(e) =>
                          setNewSubService({
                            ...newSubService,
                            description: e.target.value,
                          })
                        }
                      />
                    </Box>

                    <button
                      onClick={(e) => handleAddOrUpdateSubService(e)}
                      className="submitBtn"
                    >
                      {isEditMode ? "Update Sub-service" : "Add Sub-service"}
                    </button>
                  </form>
                </div>
              </Popover>
            </div>
          </div>
        </div>

        <div className="body">
          <TableContainer component={Paper} className="tableContainer">
            <Table
              stickyHeader
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sub-service</StyledTableCell>
                  <StyledTableCell align="center">Packages</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {subServices?.content?.map((subServiceContent) => {
                  const subServiceDeleted = deletedSubServices?.find(
                    (subSrv) => subSrv.id === subServiceContent.id
                  );

                  const serviceDeleted = deletedServices?.find(
                    (srv) => srv.id === selectedService.id
                  );

                  return (
                    <StyledTableRow
                      subservicedeleted={subServiceDeleted}
                      servicedeleted={serviceDeleted}
                      key={subServiceContent.id}
                      className="subServiceTableRow"
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <StyledTableCell
                        component="th"
                        scope="row"
                        onClick={() => {
                          handleClickOnSubService(subServiceContent);
                        }}
                      >
                        {subServiceContent.title}
                      </StyledTableCell>

                      <StyledTableCell
                        align="center"
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                          gap: "20px",
                        }}
                      >
                        {subServiceContent.pricingPlan?.length}
                        {editMode && (
                          <div className="actionsOnSubService">
                            <span
                              onClick={() =>
                                handleDeleteSubService(subServiceContent)
                              }
                            >
                              <Delete style={{ padding: 0 }} />
                            </span>
                            <span
                              onClick={(event) =>
                                handleEditSubservice(subServiceContent, event)
                              }
                            >
                              <Edit style={{ padding: 0 }} />
                            </span>
                          </div>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <div
        className="flex-[1.5] h-full"
        // className={`${
        //   packages ? "subServiceContainer opened" : "subServiceContainer"
        // }`}
      >
        <SubServiceDetails />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Service</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteSubservice}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceDetails;
