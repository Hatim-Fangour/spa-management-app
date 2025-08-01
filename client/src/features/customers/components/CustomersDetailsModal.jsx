import { CloseOutlined } from "@mui/icons-material";
import { Box, Tab } from "@mui/material";
import React, { forwardRef, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CustomerAboutTab from "./CustomerAboutTab";
import CustomerNotesTab from "./CustomerNotesTab";
import CustomerAppointmentsTab from "./CustomerAppointmentsTab";
import CustomerServicesTab from "./CustomerServicesTab";

const CustomersDetailsModal = forwardRef((props, ref) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div
      className="absolute inset-0 m-auto rounded-[10px] box-border bg-[#f8f8f8] h-[650px] w-[800px] z-50 p-4"
      ref={ref}
    >
      <div className="customersDetailsPanelContainer flex flex-col h-full w-full">
        <div className="customersDetailsPanelHeader flex items-center justify-between w-full">
          <span className="headerTitle text-[20px] font-bold">
            Customer Details
          </span>
          <button
            className="closeCustomerBtn flex items-center gap-2 p-3 font-bold text-[rgb(46, 46, 46)] cursor-pointer border-none rounded-2xl text-[16px]"
            // onClick={() => {
            //   handleCloseModalDetails();
            // }}
          >
            <CloseOutlined className="closeCustomerIcon" />
          </button>
        </div>

        <div className="customersDetailsPanelBody flex-1 min-h-0 w-full">
          <div className="bodyContainer flex flex-col h-full w-full">
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs">
                    <Tab label="about" value="1" />
                    <Tab label="notes" value="2" />
                    <Tab label="appointments" value="3" />
                    <Tab label="services" value="4" />
                  </TabList>
                </Box>

                <TabPanel
                  value="1"
                  className=" h-auto min-h-0 box-border p-1"
                 sx={{ 
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                p: '10px',
                boxSizing: 'border-box'
              }}
                >
                  <CustomerAboutTab />
                </TabPanel>
                <TabPanel value="2"  sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  <CustomerNotesTab />
                </TabPanel>
                <TabPanel value="3"  sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  <CustomerAppointmentsTab />
                </TabPanel>
                <TabPanel value="4"  sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                  <CustomerServicesTab />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CustomersDetailsModal;
