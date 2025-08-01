import React from "react";
import { UserAvatar } from "../../sideBarUtils";
import { TextField } from "@mui/material";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { PhoneInput } from "react-international-phone";
import "react-country-state-city/dist/react-country-state-city.css";
import "react-international-phone/style.css";

const CustomerAboutTab = () => {
  return (
    <main className="main aboutTab flex items-center w-full h-full">
      <div className="main-left flex-[2_1_0%] h-[100%] w-full">
        <div className="profileSection flex items-center w-full h-full flex-col">
          <UserAvatar
          textStyle = {{ boxSizing: "border-box", fontSize:"400%" }}
            className="!h-[100px] !w-[100px]  block mt-5 text-[20px]"
            name={"Hatim"}
            imgSrc=""
          />
        </div>
      </div>

      <div className="main-right box-border p-2 flex-[5_1_0%] flex h-full">
        <form className="formContainer flex flex-col w-full h-full box-border justify-between gap-5">
          <div className="section details flex flex-col w-full h-full ">
            <span className="sectionTitle uppercase text-[12px] font-bold text-[rgb(90, 90, 90)]">
              main details
            </span>

            <div className="sectionContent h-full flex flex-col mt-3 gap-5">
              <div className="grouper flex items-center justify-between gap-10">
                <TextField
                  className="entry w-full h-[45px] flex items-center"
                  id="standard-basic"
                  // placeholder="Full Name"
                  label="Full Name"
                  // type="text"
                  // name="fullName"
                  variant="standard"
                  // value={String(viewedCustomer.fullName)}
                  // value={"Hatim"}
                  fullWidth
                  required
                  autoComplete="new-password"
                  // onChange={(e) => {
                  //   dispatch(
                  //     setViewedCustomer({
                  //       ...viewedCustomer,
                  //       fullName: e.target.value,
                  //     })
                  //   );
                  // }}
                  // value={props.data.fullName}
                  // error={!!props.errors.fullName}
                />

                <TextField
                  className="entry w-full h-[45px] flex items-center"
                  id="standard-basic"
                  label="Company Name"
                  autoComplete="new-password"
                  type="text"
                  // value={String(viewedCustomer.companyName)}
                  name="companyName"
                  variant="standard"
                  fullWidth
                  // onChange={(e) => {
                  //   dispatch(
                  //     setViewedCustomer({
                  //       ...viewedCustomer,
                  //       companyName: e.target.value,
                  //     })
                  //   );
                  // }}
                  sx={{
                    width: "100%",
                  }}
                />
              </div>

              <div className="grouper flex items-center justify-between gap-10 ">
                <PhoneInput
                className="hover:bg-red-100 hover:border-b-2 hover:border-gray-800 text-[16px]"
                  defaultCountry="us"
                  required
                  value="+212664901123"
                  // value={viewedCustomer.phone}
                  // className={!!props.errors.phone ? "error" : ""}
                  name="phone"
                  // onChange={(e) => {
                  //   // console.log(e);
                  //   dispatch(
                  //     setViewedCustomer({
                  //       ...viewedCustomer,
                  //       phone: e,
                  //     })
                  //   );
                  // }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    height: "45px",
                    fontSize: "16px",
                    // borderBottom: "1px solid #201f1f",
                    backgroundColor: "transparent",
                    borderBottom: "1.4px solid #949494",
                    
                  }}
                  //!   react-international-phone-input
                  inputStyle={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                   
                  }}
                  //!   react-international-phone-country-selector
                  countrySelectorStyleProps={{
                    style: {
                      height: "100%",

                      //   backgroundColor: "blue",

                      // paddingLeft: "10px",
                    },
                    //! react-international-phone-country-selector-button
                    buttonStyle: {
                      height: "100%",
                      padding: "0px 10px",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                    },
                  }}
                  flagStyle={{
                    width: "30px",
                    height: "30px",
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Email"
                  type="email"
                  name="email"
                  // value={String(viewedCustomer.email)}
                  autoComplete="new-password"
                  variant="standard"
                  fullWidth
                  sx={{
                    width: "100%",
                    // backgroundColor: "blue",
                  }}

                  // onChange={(e) => {
                  //   dispatch(
                  //     setViewedCustomer({
                  //       ...viewedCustomer,
                  //       email: e.target.value,
                  //     })
                  //   );
                  // }}
                />
              </div>
            </div>
          </div>

          <div className="section address flex flex-col w-full h-full">
            <span className="sectionTitle uppercase text-[12px] font-bold text-[rgb(90, 90, 90)]">address</span>
            <div className="sectionContent h-full flex flex-col mt-3 gap-3">
              
                <div className="entry w-full h-[45px] flex items-center border-none">
                  <CountrySelect
                    containerClassName="entryContainer w-full h-full border-none"
                    inputClassName="entryInput w-full h-full border-none outline-none"
                    autoComplete="new-password"
                    name="country"
                    // defaultValue={viewedCustomer?.country}
                    // onChange={(e) => {
                    //   console.log(e);
                    //   dispatch(
                    //     setViewedCustomer({
                    //       ...viewedCustomer,
                    //       country: (({ emoji, id, name }) => ({
                    //         emoji,
                    //         id,
                    //         name,
                    //       }))(e),
                    //       state: {},
                    //     })
                    //   );
                    // }}
                    // disabled
                    placeHolder="Select Country"
                  />
                </div>
              
              
                <div className="entry w-full h-[45px] flex items-center">
                  <StateSelect
                    containerClassName="entryContainer w-full h-full"
                    inputClassName="entryInput w-full h-full border-none outline-none"
                    // countryid={viewedCustomer.country?.id}
                    autoComplete="new-password"
                    name="state"
                    // defaultValue={viewedCustomer.state}
                    // value={props.data.state}
                    // onChange={(e) => {
                    //   console.log(e);
                    //   dispatch(
                    //     setViewedCustomer({
                    //       ...viewedCustomer,
                    //       state: (({ id, name }) => ({
                    //         id,
                    //         name,
                    //       }))(e),
                    //       city: {},
                    //     })
                    //   );
                    // }}
                    placeHolder="Select State"
                  />
                
              </div>
              
                <div className="entry w-full h-[45px] flex items-center">
                  <CitySelect
                    containerClassName="entryContainer w-full h-full"
                    inputClassName="entryInput w-full h-full border-none outline-none"
                    // countryid={viewedCustomer.country?.id}
                    // defaultValue={viewedCustomer?.city}
                    // stateid={viewedCustomer.state?.id}
                    autoComplete="new-password"
                    // value={props.data.city}
                    name="city"
                    // onChange={(e) => {
                    //   console.log(e);
                    //   dispatch(
                    //     setViewedCustomer({
                    //       ...viewedCustomer,
                    //       city: (({ id, name }) => ({
                    //         id,
                    //         name,
                    //       }))(e),
                    //     })
                    //   );
                    // }}
                    placeHolder="Select City"
                  />
                </div>
              

              <div className="grouper">
                <div className="entry">
                  <TextField
                    id="standard-basic"
                    label="Address"
                    name="address"
                    // value={String(viewedCustomer.address)}
                    autoComplete="new-password"
                    type="text"
                    variant="standard"
                    fullWidth
                    // onChange={(e) => {
                    //   dispatch(
                    //     setViewedCustomer({
                    //       ...viewedCustomer,
                    //       address: e.target.value,
                    //     })
                    //   );
                    // }}
                  />
                </div>
              </div>
            </div>
          </div>

          <footer className="w-full flex items-center justify-end">
            {/* <button
              className="cancelBtn"
              onClick={(e)=>handleCancelAboutTab(e)}
            >
              Cancel
            </button> */}
            <button
              className="saveBtn cursor-pointer font-bold text-[#414141] border-none py-2 px-5 rounded-2xl mr-4 hover:bg-[#cacacabf]"
              // onClick={(e) => handleSaveAboutTab(e)}
            >
              Save
            </button>
          </footer>
        </form>
      </div>
    </main>
  );
};

export default CustomerAboutTab;
