import { Button, Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { servicesData } from "../../../../Services";
import { useState } from "react";
import {
  Close,
  ExpandLess,
  ExpandMore,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const CustomerServicesTab = () => {
  const [editMode, setEditMode] = useState(true);
  const [openItems, setOpenItems] = useState({});
  const [openSubItems, setOpenSubItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSubServiceId, setSelectedSubServiceId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "simple-popover" : undefined;

  const handleToggleServiceTab = (item) => {
    //! this function can keep all tabps apoened in the same time.
    // setOpenItems((prev) => ({
    //   ...prev,
    //   [item]: !prev[item], // Toggle the specific item's state
    // }));

    console.log(item);
    //! this function close other tabs and keep just one opened.
    setOpenItems((prev) => ({
      [item]: !prev[item], // Toggle the specific item's state
    }));

    setOpenSubItems((prev) => ({
      [id]: !prev[id], // Toggle the specific item's state
    }));
  };

  const handleToggleSubContent = (id) => {
    // setOpenSubItems((prev) => ({ ...prev, [id]: !prev[id] }));

    //! this function close other tabs and keep just one opened.
    setOpenSubItems((prev) => ({
      [id]: !prev[id], // Toggle the specific item's state
    }));
  };

    const handleSelect = (item) => {
    const today = new Date();
    const expiredAt = new Date();
    expiredAt.setDate(today.getDate() + 90);

// ! expression to calculat how many days the package still useable
    // console.log((expiredAt - today)/ (1000 * 3600 * 24))

    if (!cartItems.some((itm) => itm.id === item.id)) {
      setCartItems((prev) => [
        ...prev,
        {
          ...item,
          createdAt: today.toLocaleDateString(),
          expiredAt: expiredAt.toLocaleDateString(),
        },
      ]);
    }
  };

    const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.promoPrice ?? item.price),
    0
  );

  console.log(cartItems);
  // console.log(openItems);

  return (
    <div className="main servicesTab flex flex-col h-full overflow-hidden">
      <div className="servicesTab-header h-14 flex items-center justify-between">
        <div className="total-content flex items-center gap-6 border-2 py-1 px-5 border-red-900 border-solid  rounded-lg">
          <span>Total :</span>
          <span>{`$ ${totalPrice}`}</span>
          {/* <span>{`$ 236`}</span> */}
        </div>
        <button
          className={`
            py-3 px-4 border-none cursor-pointer rounded-lg bg-[#d4d4d4ac] text-[rgb(0,0,0)] w-32
            ${
              !editMode
                ? "getServ hover:font-bold"
                : "save hover:bg-black hover:text-white"
            }
          `}
          // onClick={() => {
          //   handleSaveCustomerService();
          // }}
        >
          {!editMode ? "Edit" : "Save"}
        </button>
      </div>

      <div className="body h-full flex gap-5 mt-3 pt-4 border-t-2">
        <div className="h-full flex-[1_1_0%]  overflow-auto">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className="h-full !pt-0"
          >
            {servicesData.map((service) => (
              <div
                key={service.id}
                className={`${
                  openItems[service.id] ? "btnAsServiceSection" : ""
                }`}
              >
                <ListItemButton
                  className={`!py-[2px] !rounded-md
                    ${openItems[service.id] ? "btnAsServiceTitleActive" : ""}`}
                  onClick={() => {
                    setSelectedSubServiceId(service.id);
                    handleToggleServiceTab(service.id);
                    //   dispatch(setSubServices(service));
                  }}
                >
                  <ListItemText
                    primary={service.title}
                    sx={{
                      "& .MuiTypography-root": {
                        fontSize: "14px",
                        fontStyle: "bold",
                      },
                    }}
                  />
                  {openItems[service.id] ? (
                    <ExpandLess
                      onClick={() => handleToggleServiceTab(service.id)}
                    />
                  ) : (
                    <ExpandMore
                      onClick={() => handleToggleServiceTab(service.id)}
                    />
                  )}
                </ListItemButton>

                <Collapse
                  className="collapseService"
                  in={openItems[service.id] && editMode}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="nav" aria-labelledby="nested-list-subheader">
                    {service.content?.map((cntnt) => (
                      <div
                        key={cntnt.id}
                        className={`${
                          openSubItems[cntnt.id]
                            ? "btnAsSubServiceSection"
                            : "btnAsSubServiceSection closed"
                        }`}
                      >
                        <ListItemButton
                          className={`!py-1 !rounded-md ${
                            openSubItems[cntnt.id]
                              ? "btnAsSubServiceTitleActive"
                              : ""
                          }`}
                          key={cntnt.id}
                          sx={{
                            pl: 5,
                            "& .MuiTypography-root": {
                              fontSize: "14px",
                            },
                          }}
                          onClick={() => {
                            handleToggleSubContent(cntnt.id);
                          }}
                        >
                          <ListItemText primary={cntnt.title} />
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
                          className={`${
                            cntnt.pricingPlan.length > 6
                              ? "collapseSubService scrlbl"
                              : "collapseSubService"
                          }`}
                        >
                          <List
                            sx={{
                              width: "100%",
                              paddingTop:"2px",
                              paddingBottom:"2px",
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                          >
                            {cntnt.pricingPlan?.map((pp) => (
                              <div
                                key={pp.id}
                                className={`${
                                  openSubItems[pp.id]
                                    ? "btnAsSubServiceSection"
                                    : ""
                                }`}
                              >
                                <ListItemButton
                                  key={pp.id}
                                  className="!rounded-md"
                                  sx={{ pl: 10,pt:"2px", pb:"2px"}}
                                  onClick={() => handleSelect(pp)}
                                >
                                  <ListItemText
                                  className="!m-0"
                                    primary={pp.name}
                                    secondary={`$ ${
                                      pp.promoPrice ? pp.promoPrice : pp.price
                                    }`}
                                    sx={{
                                      "& .MuiTypography-root": {
                                        fontSize: "14px",
                                        fontStyle: "bold",
                                      },
                                      
                                      "& .MuiListItemText-root":{
                                        margin:"0 !important"
                                        
                                      }
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

        <div className="cartServicesContainer h-full flex-[1_1_0%] flex flex-col items-center gap-5">
          <h3 className="title">Your Services</h3>
          <div className="shoppingCartList h-[80%] overflow-auto w-[95%] gap-2 flex flex-col px-2">
            {cartItems?.length === 0 ? (
                    <p className="emptyCartText text-[20px] text-[#39393990] mt-10">
                      You don't have any service yet
                    </p>
                  ) : (
                    cartItems?.map((item) => (
                      <Button
                        disabled={!editMode}
                        className="addedItemBtn w-full cursor-default flex items-center justify-between"
                        key={item.id}
                        variant="outlined"
                        style={{ margin: "2px", display:"flex", alignItems:"center", justifyContent:"space-between" }}
                      >
                        {/* <div className="addedItemInfo flex-[2_1_0%] flex items-start gap-6"> */}
                          <span className="itemName w-[60%] text-left overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]">{item.name} </span>
                          <span className="itemPrice w-[30%]">
                            $ {item.promoPrice ? item.promoPrice : item.price}
                          </span>
                        {/* </div> */}

                        <Close
                          className={"removeCartItemBtn flex-[1_1_0%] text-red-800"}
                          // onClick={() => handleRemove(item)}
                        />
                      </Button>
                    ))
                  )}
          </div>
        </div>

        {/* <GetServicesPanel editMode={editMode} /> */}
      </div>
    </div>
  );
};

export default CustomerServicesTab;
