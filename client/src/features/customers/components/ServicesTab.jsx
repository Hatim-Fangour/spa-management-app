import {
  Delete,
  ExpandLess,
  ExpandMore,
  Info,
  KeyboardDoubleArrowRight,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomerContext } from "../../pages/Customers";
import { updateCustomer } from "../thunks/customersThunks";
import { notifySuccess } from "../../utils/toastNotify";

const ServicesTab = () => {
  const { customer, onClose } = useContext(CustomerContext);

  const services = useSelector((state) => state.services.services);

  const [selectedSubService, setSelectedSubService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [packagesToDelete, setPackagesToDelete] = useState([]);
  const [customerData, setCustomerData] = useState(customer);
  const [openSubItems, setOpenSubItems] = useState({});
  const [editMode, setEditMode] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const totalPrice = cartItems?.reduce(
      (sum, item) =>
        sum + (parseInt(item.promoPrice, 10) || parseInt(item.price, 10)),
      0
    );

    setTotal(totalPrice || 0);
    setCustomerData((prev) => ({
      ...prev, // ← Always gets the latest state
      services: cartItems,
      servicesTotal: total,
    }));

    setCartItems(customer.services || []);
  }, [customer, customerData, cartItems, total]);

  const handleUpdateCustomerServices = () => {
    if (customerData.fullName && customerData.phone) {
      // Filter cartItems to exclude items marked for deletion
      const updatedServices = cartItems.filter(
        (item) => !packagesToDelete.includes(item.id)
      );

      try {
        dispatch(
          updateCustomer({
            ...customerData,
            services: updatedServices,
            id: customerData.id,
          })
        );

        setCartItems(updatedServices);
        notifySuccess("Services", "updated");

        // Clear the packagesToDelete after successful update
        setPackagesToDelete([]);

        onClose();
      } catch (error) {
      }
    }
  };

  const handleClickSubService = useCallback((cntnt) => {
    // setOpenSubItems((prev) => ({ ...prev, [id]: !prev[id] }));
    setSelectedSubService({
      id: cntnt.id,
      title: cntnt.title,
    });
    // setSelectedSubServiceId(cntnt.id);

    //! this function close other tabs and keep just one opened.
    setOpenSubItems((prev) => ({
      [cntnt.id]: !prev[cntnt.id], // Toggle the specific item's state
    }));
  }, []);

  const handleClickService = useCallback((service) => {
    setSelectedService({
      id: service.id,
      title: service.title,
    });

    setOpenItems((prev) => ({
      [service.id]: !prev[service.id], // Toggle the specific item's state
    }));
  }, []);

  const handleSelectPackage = useCallback(
    (item) => {
      const today = new Date();
      const expiredAt = new Date();
      expiredAt.setDate(today.getDate() + 90);

      // ! expression to calculat how many days the package still useable

      if (!cartItems.some((itm) => itm.id.toString() === item.id.toString())) {
        setCartItems((prev) => [
          ...prev,
          {
            ...item,
            serviceId: selectedService.title,
            subServiceId: selectedSubService.title,
            createdAt: today.toLocaleDateString(),
            expiredAt: expiredAt.toLocaleDateString(),
          },
        ]);
      }
    },
    [selectedService, selectedSubService, cartItems]
  );

  const handleRemovePackage = useCallback((itemId) => {
    setPackagesToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        // If exists, remove it
        return prev.filter((id) => id !== itemId);
      } else {
        // If doesn't exist, add it
        return [...prev, itemId];
      }
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Grid
        container
        direction={"column"}
        height={"100%"}
        sx={{
          flex: 1,
        }}
      >
        <Grid size={12} sx={{ height: 40 }}>
          <div className="total-content flex gap-3 items-center p-2">
            <span>
              <ShoppingCart />
            </span>
            <span>{`$ ${total}`}</span>
          </div>
        </Grid>

        <Grid
          size={12}
          fullWidth
          sx={{ height: 60, flex: 1, overflow: "hidden" }}
        >
          <Stack spacing={2} direction="row">
            <div className="flex-1 overflow-auto box-border h-[320px] border-2 border-[#cab06d] rounded-md p-2 pr-0">
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                sx={{
                  // flex: 1, // Take remaining space
                  overflow: "auto", // Enable scrolling
                  // minHeight: 0, // Crucial for flex scrolling
                  height: "100%",
                  // Optional: Custom scrollbar styling
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#888",
                    borderRadius: "3px",
                  },
                }}
              >
                {services.map((service) => (
                  <div key={service.id} className="pr-2">
                    <ListItemButton
                      sx={{
                        paddingTop: "6px",
                        paddingBottom: "6px",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "#ffe49f4f",
                        },

                        ".MuiSvgIcon-root": {
                          fontSize: "16px",
                        },
                      }}
                      onClick={() => {
                        handleClickService(service);
                      }}
                    >
                      <ListItemText
                        primary={service.title}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          ...(selectedService?.id === service.id && {
                            borderLeft: "2px solid #cab06d",
                            paddingLeft: "5px",
                          }),

                          ".MuiTypography-root": {
                            whiteSpace:
                              "nowrap" /* Prevent text from wrapping */,
                            overflow: "hidden" /* Hide overflowing text */,
                            textOverflow: "ellipsis" /* Add "..." at the end */,
                            maxWidth: "300px",
                          },
                        }}
                      />
                      {openItems[service.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse
                      className="collapseService"
                      in={openItems[service.id] && editMode}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                      >
                        {service.content?.map((cntnt) => (
                          <div key={cntnt.id}>
                            <ListItemButton
                              key={cntnt.id}
                              sx={{
                                paddingLeft: "35px",
                                paddingTop: "6px",
                                paddingBottom: "6px",
                                borderRadius: "8px",

                                "&:hover": {
                                  backgroundColor: "#ffe49f4f",
                                },
                                ".MuiSvgIcon-root": {
                                  fontSize: "16px",
                                },
                              }}
                              onClick={() => {
                                handleClickSubService(cntnt);
                              }}
                            >
                              <ListItemText
                                primary={cntnt.title}
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                  ...(selectedSubService?.id === cntnt.id && {
                                    borderLeft: "2px solid #cab06d",
                                    paddingLeft: "5px",
                                  }),

                                  ".MuiTypography-root": {
                                    whiteSpace:
                                      "nowrap" /* Prevent text from wrapping */,
                                    overflow:
                                      "hidden" /* Hide overflowing text */,
                                    textOverflow:
                                      "ellipsis" /* Add "..." at the end */,
                                    maxWidth: "300px",
                                  },
                                }}
                              />
                              {openSubItems[cntnt.id] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>

                            <Collapse
                              in={openSubItems[cntnt.id]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List
                                sx={{
                                  width: "100%",
                                }}
                                component="nav"
                                aria-labelledby="nested-list-subheader"
                              >
                                {cntnt.pricingPlan?.map((pp) => (
                                  <div key={pp.id}>
                                    <ListItemButton
                                      key={pp.id}
                                      sx={{
                                        paddingLeft: "75px",
                                        paddingTop: "6px",
                                        paddingBottom: "6px",
                                        borderRadius: "8px",

                                        "&:hover": {
                                          backgroundColor: "#ffe49f4f",
                                        },
                                        ".MuiSvgIcon-root": {
                                          fontSize: "16px",
                                          // color: "red"
                                        },
                                      }}
                                      onClick={() => handleSelectPackage(pp)}
                                    >
                                      <ListItemText
                                        primary={pp.name}
                                        secondary={`$ ${
                                          pp.promoPrice
                                            ? pp.promoPrice
                                            : pp.price
                                        }`}
                                        sx={{
                                          fontWeight: "bold",
                                          fontSize: "20px",

                                          ":hover": {
                                            borderLeft: "2px solid #cab06d",
                                            paddingLeft: "5px",
                                          },

                                          ".MuiTypography-root": {
                                            whiteSpace:
                                              "nowrap" /* Prevent text from wrapping */,
                                            overflow:
                                              "hidden" /* Hide overflowing text */,
                                            textOverflow:
                                              "ellipsis" /* Add "..." at the end */,
                                            maxWidth: "300px",
                                          },
                                        }}
                                      />
                                      <KeyboardDoubleArrowRight />
                                    </ListItemButton>
                                  </div>
                                ))}
                              </List>
                            </Collapse>
                          </div>
                        ))}
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </div>

            <div className="cartServicesContainer flex-1 flex flex-col p-2 h-[320px]">
              <h3 className="title">Your Services:</h3>
              <div className="shoppingCartList flex flex-col mt-5 overflow-y-auto ">
                {cartItems?.length === 0 ? (
                  <p className="emptyCartText">
                    You don't have any service yet
                  </p>
                ) : (
                  cartItems?.map((item) => {
                    const isMarkedForDeletion = packagesToDelete.includes(
                      item.id
                    );

                    return (
                      <Button
                        key={item.id}
                        variant="outlined"
                        sx={{
                          borderColor: isMarkedForDeletion
                            ? "#ff0000"
                            : "#cab06d",
                          color: isMarkedForDeletion ? "#ff0000" : "#cab06d",
                          backgroundColor: isMarkedForDeletion
                            ? "#ffebee"
                            : "inherit",
                          "&:hover": {
                            backgroundColor: isMarkedForDeletion
                              ? "#ffcdd2"
                              : "#ffe49f4f",
                          },
                        }}
                        style={{
                          margin: "2px",
                          cursor: "default",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textDecoration: isMarkedForDeletion
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <div className="addedItemInfo flex flex-col  items-start">
                          <span className="itemName text-nowrap overflow-hidden text-ellipsis max-w-[240px] transform-none text-[#cab06d]">
                            {item.name}
                          </span>
                          <span className="itemPrice text-[#8b7641]">
                            $ {item.promoPrice ? item.promoPrice : item.price}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          <Delete
                            className={
                              "removeCartItemBtn text-red-700 cursor-pointer"
                            }
                            onClick={() => handleRemovePackage(item.id)}
                          />

                          <Tooltip
                            title={
                              <span style={{ whiteSpace: "pre-line" }}>
                                {`in ${item.subServiceId}\nin ${item.serviceId}`}
                              </span>
                            }
                          >
                            <Info />
                          </Tooltip>
                        </div>
                      </Button>
                    );
                  })
                )}
              </div>
            </div>
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 3,
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
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
          onClick={handleUpdateCustomerServices}
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
          UPDATE
        </Button>
      </Box>
    </Box>
  );
};

export default ServicesTab;
