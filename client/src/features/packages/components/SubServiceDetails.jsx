import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Popover,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  addPackage,
  deletePackage,
  updatePackage,
} from "../slices/packagesSlice";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const SubServiceDetails = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [newPackage, setNewPackage] = useState({});
  const [packageErrors, setPackageErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const [packageToDelete, setPackageToDelete] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const [openCardId, setOpenCardId] = useState(null);
  // Function to handle card toggle
  // Handle card open/close
  const handleToggleCard = useCallback((packageId) => {
    setOpenCardId((prevId) => {
      // If clicking the same card, toggle it
      if (prevId === packageId) {
        setIsEditMode(false); // Reset edit mode when closing
        return null;
      }
      // If clicking a different card, open it and close others
      setIsEditMode(false); // Reset edit mode when switching cards
      return packageId;
    });
  }, []);

  // Handle entering edit mode
  const handleEnterEditMode = useCallback((packageContent) => {
    setIsEditMode(true);
    setNewPackage(packageContent);
    setEditingPackageId(packageContent.id);
    setSelectedPackageId(packageContent.id);
    setPackageToEdit(packageContent.id);
  }, []);

  // const handleEditPackage = useCallback((packageContent) => {
  //   console.log(packageContent)
  //   setOpenCardId((prevId) => (prevId === packageContent.id ? null : packageContent.id));
  //   setIsEditMode((prev) => !prev); // Use functional update
  //   // setIsEditMode(true);
  //   console.log("hello");
  //   // event.stopPropagation(); // Prevent event bubbling if needed
  //   // console.log(packageContent);
  //   if (packageContent.id && isEditMode) {
  //     console.log(packageContent);
  //     setNewPackage(packageContent);
  //     setEditingPackageId(packageContent.id);
  //     setSelectedPackageId(packageContent.id);
  //     setPackageToEdit(packageContent.id);
  //     // setAnchorEl(event.currentTarget);
  //   }else{
  //     // setIsEditMode((prev) => false); // Use functional update
  //     console.log("rien")
  //   }

  // }, []);
  // const packages = {
  //   id: 1739904423771,
  //   title: "Consultation Fee",
  //   description:
  //     "During this Session you can expect to receive information regarding supplies needed to prepare for your surgery. We discuss physical sensations and emotional experiences One can expect Post Surgery. We recommend where to purchase your supplies, Doctor referrals, and your schedule for Lymphatic Drainage sessions. We will address all concerns and questions You may have.If consultation is booked prior to surgery, you will receive a complimentary day of or after service check-in call or text. Our services For the Pre-Op Consultation are available Virtually or In Person.",
  //   duration: 30,
  //   includes: [],
  //   pricingPlan: [
  //     {
  //       id: 1739904425913,
  //       name: "Consultation Fee",
  //       price: 209,
  //       promoPrice: 142,
  //     },
  //     {
  //       id: 1739904425913,
  //       name: "Consultation Fee",
  //       price: 209,
  //       promoPrice: 142,
  //     }
  //   ],
  // };

  const packages = useSelector((state) => state.services.packages);
  const subServices = useSelector((state) => state.services.subServices);

  // console.log(packages);

  const handleClickAddPackage = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setNewPackage({});
    setPackageErrors({});
    setIsEditMode(false);
  }, []);

  const handleAddOrUpdatePackage = useCallback(
    async (e) => {
      e.preventDefault();
      // console.log(packages);
      console.log(subServices);
      console.log(newPackage);

      if (newPackage.name) {
        if (isEditMode && editingPackageId) {
          console.log({
            ...newPackage,
            serviceID: packages.id,
            id: editingPackageId,
          });

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
            console.log(newPackage);

            // Dispatch the setServices action
            const newAddedPackage = {
              ...newPackage,
              id: Date.now().toString(), // Optional unique ID
              subServiceID: packages.id,
              serviceID: subServices.id,
            };
            console.log(newAddedPackage);
            dispatch(addPackage(newAddedPackage));
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

      // dispatch(setPackages(newAddedService));
      setNewPackage({});
      setAnchorEl(null);
    },
    [newPackage, isEditMode, editingPackageId]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedPackageId(null);
  }, []);

  const handleDeletePackage = useCallback(
    (PackageContent) => {
      setSelectedPackageId(PackageContent.id);
      if (PackageContent.id) {
        setPackageToDelete(PackageContent.id);
        setDeleteConfirmOpen(true);
      }
      handleMenuClose();
    },
    [handleMenuClose]
  );

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setPackageToDelete(null);
  }, []);

  const handleConfirmDeletePackage = useCallback(
    async (e) => {
      console.log(packageToDelete);
      // Dispatch the setServices action
      const contentToDelete = {
        id: packageToDelete,
        subServiceID: packages.id,
        serviceID: subServices.id,
      };
      console.log(contentToDelete);
      e.preventDefault();
      if (packageToDelete) {
        dispatch(deletePackage(contentToDelete));
        setDeleteConfirmOpen(false);
        setPackageToDelete(null);
      }
    },
    [packageToDelete]
  );

  // const handleEditPackage = useCallback((packageContent, event) => {
  //   setIsEditMode((prev) => true);
  //   // setIsEditMode(true);
  //   console.log("hello");
  //   // event.stopPropagation(); // Prevent event bubbling if needed
  //   // console.log(packageContent);
  //   if (packageContent.id) {
  //     console.log(packageContent);
  //     setNewPackage(packageContent);
  //     setEditingPackageId(packageContent.id);
  //     setSelectedPackageId(packageContent.id);
  //     setPackageToEdit(packageContent.id);
  //     // setAnchorEl(event.currentTarget);
  //   }
  //   // handleMenuClose();
  // }, []);

  useEffect(() => {
    console.log("isEditMode changed to:", isEditMode);
  }, [isEditMode]);
  //   const subServices = useSelector((state) => state.services.subServices);
  const editMode = true;
  // console.log(isEditMode)
  return (
    <div className="subServiceComponent w-full flex-[2] h-full">
      <div className="subServiceHeader flex w-full items-center justify-between mb-5 gap-2.5">
        <div
          className="subServiceTitle flex-[2] line-clamp-2 overflow-hidden text-ellipsis leading-snug max-h-[2.4em] text-base font-bold"
          title={packages?.title}
        >
          {packages?.title}
        </div>
        <button
          aria-describedby={id}
          onClick={handleClickAddPackage}
          className="addPackageBtn border-none rounded-[50px] font-bold cursor-pointer box-border  transition-all duration-400 ease-in-out opacity-100 disabled:opacity-0 disabled:cursor-default"
          //   disabled={!editMode || !subServices || !packages}
        >
          <Add />
        </button>
      </div>

      <div>
        <Popover
          id={id}
          open={openPopover}
          anchorEl={anchorEl}
          //   onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
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
              <button className="cancelSubPackageBtn" onClick={handleClose}>
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
                  //   error={!!packageErrors?.errorName}
                  required
                  value={newPackage?.name || ""}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, name: e.target.value })
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={newPackage?.description || ""}
                  onChange={(e) =>
                    setNewPackage({
                      ...newPackage,
                      description: e.target.value,
                    })
                  }
                />

                <TextField
                  id="outlined-basic"
                  label="Price"
                  variant="outlined"
                  type="number"
                  name="price"
                  //   error={!!packageErrors?.errorPrice}
                  required
                  value={newPackage?.price || ""}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, price: e.target.value })
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Promo Price"
                  variant="outlined"
                  type="number"
                  name="promoPrice"
                  value={newPackage?.promoPrice || ""}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, promoPrice: e.target.value })
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Duration"
                  variant="outlined"
                  type="number"
                  name="duration"
                  value={newPackage?.duration || ""}
                  onChange={(e) =>
                    setNewPackage({ ...newPackage, duration: e.target.value })
                  }
                />
              </Box>

              <button
                onClick={(e) => handleAddOrUpdatePackage(e)}
                className="submitBtn"
              >
                Add
              </button>
            </form>
          </div>
        </Popover>
      </div>

      <ul className="packagesListDetailsContainer h-[90%] overflow-y-auto list-none m-0 p-0 scrollbar-thin pr-1.25 flex flex-col gap-2.5">
        {packages?.pricingPlan?.map((ppl, index) => {
          return (
            <li key={index}>
              <div
                //   className=''
                className={`relative flex flex-col justify-between w-full h-[70px] overflow-hidden box-border rounded-[10px] mr-[10px] gap-1 bg-[rgba(190,190,190,0.184)]
                   transition-all duration-300 ease-in-out ${
                     openCardId === ppl.id ? "view !h-[380px]" : ""
                   }`}
              >
                <div
                  className="packageCardContainer flex items-center w-full p-[10px] cursor-pointer justify-between"
                  onDoubleClick={() => {
                    handleToggleCard(ppl.id);
                    handleEnterEditMode(ppl);
                  }}
                >
                  <div className="info flex items-center gap-[10px] flex-[5]">
                    <div className="titleContainer flex-1 py-[5px]">
                      <div
                        className="title text-[15px] font-bold text-[rgba(37,37,37,0.89)] line-clamp-2 overflow-hidden text-ellipsis leading-snug max-h-[2.4em]"
                        title={ppl.name}
                      >
                        {ppl.name}
                      </div>
                    </div>
                  </div>

                  <div className="pricing flex-[2] flex flex-col items-end gap-1">
                    {ppl.promoPrice ? (
                      <>
                        <span className="promoPrice font-bold">
                          {ppl.promoPrice} $
                        </span>
                        <span className="price text-red-500 italic line-through text-[14px]">{`${ppl.price} $`}</span>
                      </>
                    ) : (
                      <span className="promoPrice font-bold">
                        {ppl.price} $
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`packageCardEdition absolute top-[70px] left-0 flex flex-col gap-[10px] w-full p-[10px]`}
                >
                  <div className="header flex items-center justify-between w-full h-[35px]">
                    <span>Details</span>

                    <div className="groupe flex gap-[10px]">
                      {editMode && (
                        <>
                          <button
                            className="deleteBtn bg-[rgb(219,0,0)] text-white rounded-[20px] px-[15px] cursor-pointer font-bold box-border w-[70px] h-[25px] border-none hover:shadow-[0px_0px_5px_0px_rgba(219,0,0,0.75)]"
                            onClick={() => handleDeletePackage(ppl)}
                          >
                            Delete
                          </button>
                          <button
                            className="deleteBtn bg-[rgb(0,51,219)] text-white rounded-[20px] px-[15px] cursor-pointer font-bold box-border w-[70px] h-[25px] border-none hover:shadow-[0px_0px_5px_0px_rgba(219,0,0,0.75)]"
                            onClick={handleAddOrUpdatePackage}
                          >
                            update
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="container w-full">
                    <Box
                      component="form"
                      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                      noValidate
                      autoComplete="off"
                      className="fieldsContainer flex flex-col w-full gap-[10px]"
                    >
                      <TextField
                        className="!m-0 !w-full"
                        fullWidth
                        size="small"
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        disabled={!editMode}
                        value={ppl.name}
                        onChange={(e) =>
                          setNewPackage({ ...newPackage, name: e.target.value })
                        }
                      />
                      <TextField
                        className="!m-0 !w-full"
                        id="outlined-basic"
                        label="Description"
                        variant="outlined"
                        size="small"
                        disabled={!editMode}
                        // defaultValue={ppl.description ?? ""}
                        value={ppl.description ?? ""}
                        // onChange={(e) =>
                        //   setSubService({ ...subServ, description: e.target.value })
                        // }
                      />

                      {/* <div className="grouper"> */}
                      <TextField
                        className="!m-0 !w-full"
                        id="outlined-basic"
                        label="Price"
                        variant="outlined"
                        size="small"
                        type="number"
                        disabled={!editMode}
                        value={newPackage.price ?? ""}
                        onChange={(e) =>
                          setNewPackage({
                            ...newPackage,
                            price: e.target.value,
                          })
                        }
                      />
                      <TextField
                        className="!m-0 !w-full"
                        id="outlined-basic"
                        label="Promo Price"
                        variant="outlined"
                        size="small"
                        type="number"
                        disabled={!editMode}
                        value={ppl.promoPrice ?? ""}
                        // onChange={(e) =>
                        //   setSubService({ ...subServ, promoPrice: e.target.value })
                        // }
                      />
                      {/* </div> */}
                      <TextField
                        className="!m-0 !w-full"
                        id="outlined-basic"
                        label="Duration"
                        variant="outlined"
                        size="small"
                        type="number"
                        disabled={!editMode}
                        value={ppl.duration ?? ""}
                        // onChange={(e) =>
                        //   setSubService({ ...subServ, duration: e.target.value })
                        // }
                      />
                    </Box>
                  </div>
                </div>

                <div className="optionsPanel absolute bottom-[-7px] w-full h-[20px] flex items-start justify-center bg-gradient-to-t from-[rgba(155,155,155,0.2)] to-[rgba(255,255,255,0)] hover:bottom-[-5px] hover:cursor-pointer">
                  <div
                    className="optionsPanelContainer w-full flex items-center justify-center hover:[&_.viewBtn]:text-black"
                    onClick={() => {
                      handleToggleCard(ppl.id);
                      handleEnterEditMode(ppl);
                    }}
                  >
                    {!(openCardId === ppl.id) ? (
                      <IoMdArrowDropdown
                        className="viewBtn text-[rgba(128,128,128,0.842)] transition-colors duration-200 ease-in-out z"
                        onClick={() => {
                          handleToggleCard(ppl.id);
                        }}
                      />
                    ) : (
                      <IoMdArrowDropup
                        onClick={() => {
                          handleToggleCard(ppl.id);
                        }}
                        className="viewBtn text-[rgba(128,128,128,0.842)] transition-colors duration-200 ease-in-out z"
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Package</DialogTitle>
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
            onClick={handleConfirmDeletePackage}
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

export default SubServiceDetails;
