import { forwardRef, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import "react-country-state-city/dist/react-country-state-city.css";

import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

import { Close } from "@mui/icons-material";
import { Avatar, Button, styled, TextField } from "@mui/material";

// import myImage from "../../blankAvatar.jpg";





const NewCustomerModal = forwardRef((props, ref) => {
    const [phone, setPhone] = useState("");
      const [countryid, setCountryid] = useState(0);
      const [stateid, setstateid] = useState(0);
    
      const handleClientDataChange = (e) => {
        props.setData({ ...props.data, [e.target.name]: e.target.value });
        // Remove error only for the field being updated
        props.setErrors((prevErrors) => ({
          ...prevErrors,
    
          [e.target.name]: "", // Clear only the error for the field being updated
        }));
        // console.log(props.errors);
      };
    
      const UserAvatar = ({ name, imgSrc }) => {
        // Function to get the first letter of the name
        const getInitials = (name) => {
          return name ? name.charAt(0).toUpperCase() : "?";
        };
    
        return (
          <Avatar
            alt={name}
            src={imgSrc}
            sx={{ width: 100, height: 100 }}
            className="avatar"
          >
            {!imgSrc && getInitials(name)} {/* Show first letter if no image */}
          </Avatar>
        );
      };
    
  return (
    <div className="newCustomerModal" ref={ref}>
      <div className="container">
        <header>
          <div className="winTitle">Add Customer</div>
          <span className="closeIconContainer">
            <Close className="closeIcon" onClick={props.handleClose} />
          </span>
        </header>

        <main>
          <div className="modal-left">
            <div className="profileSection">
              <UserAvatar
                name={props.data.fullName ? props.data.fullName : ""}
                imgSrc={!props.data.fullName ? "./blankAvatar.jpg" : ""}
              />
            </div>
          </div>

          <div className="modal-right">
            <form>
              <div className="section details">
                <span className="sectionTitle">main details</span>

                <div className="sectionContent">
                  <div className="grouper">
                    <div className="entry">
                      <TextField
                        id="standard-basic"
                        label="Full Name"
                        type="text"
                        name="fullName"
                        variant="standard"
                        value={props.data.fullName}
                        error={!!props.errors.fullName}
                        fullWidth
                        required
                        autoComplete="new-password"
                        onChange={handleClientDataChange}
                      />
                    </div>

                    <div className="entry">
                      <TextField
                        id="standard-basic"
                        label="Company Name"
                        autoComplete="new-password"
                        type="text"
                        value={props.data.companyName}
                        name="companyName"
                        variant="standard"
                        fullWidth
                        onChange={handleClientDataChange}
                      />
                    </div>
                  </div>

                  <div className="grouper">
                    <div className="entry">
                      <PhoneInput
                        defaultCountry="us"
                        value={props.data.phone}
                        required
                        className={!!props.errors.phone ? "error" : ""}
                        name="phone"
                        onChange={(e) => {
                          props.setData({ ...props.data, phone: e });
                          props.setErrors((prevErrors) => ({
                            ...prevErrors,

                            phone: "", // Clear only the error for the field being updated
                          }));
                        }}
                      />
                    </div>

                    <div className="entry">
                      <TextField
                        id="standard-basic"
                        label="Email"
                        type="email"
                        name="email"
                        value={props.data.email}
                        autoComplete="new-password"
                        variant="standard"
                        fullWidth
                        onChange={handleClientDataChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="section address">
                <span className="sectionTitle">address</span>
                <div className="sectionContent">
                  <div className="grouper">
                    <div className="entry">
                      <CountrySelect
                        // name="country"
                        containerClassName="entryContainer"
                        autoComplete="new-password"
                        name="country"
                        value={props.data.country}
                        onChange={(e) => {
                          console.log({
                            ...props.data,
                            country: (({ emoji, id, name }) => ({
                              emoji,
                              id,
                              name,
                            }))(e),
                          });
                          props.setData({
                            ...props.data,
                            country: (({ emoji, id, name }) => ({
                              emoji,
                              id,
                              name,
                            }))(e),
                          });
                          setCountryid(e.id);
                        }}
                        placeHolder="Select Country"
                      />
                    </div>
                  </div>
                  <div className="grouper">
                    <div className="entry">
                      <StateSelect
                        containerClassName="entryContainer"
                        countryid={countryid}
                        autoComplete="new-password"
                        name="state"
                        value={props.data.state}
                        onChange={(e) => {
                          props.setData({ ...props.data, state: e });
                          setstateid(e.id);
                        }}
                        placeHolder="Select State"
                      />
                    </div>
                  </div>
                  <div className="grouper">
                    <div className="entry">
                      <CitySelect
                        containerClassName="entryContainer"
                        countryid={countryid}
                        stateid={stateid}
                        autoComplete="new-password"
                        value={props.data.city}
                        name="city"
                        onChange={(e) => {
                          props.setData({ ...props.data, city: e });
                        }}
                        placeHolder="Select City"
                      />
                    </div>
                  </div>

                  <div className="grouper">
                    <div className="entry">
                      <TextField
                        id="standard-basic"
                        label="Address"
                        name="address"
                        value={props.data.address}
                        autoComplete="new-password"
                        type="text"
                        variant="standard"
                        fullWidth
                        onChange={handleClientDataChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <footer>
                <button className="cancelBtn" onClick={props.handleClose}>
                  Cancel
                </button>
                <button className="saveBtn" onClick={props.handleSubmit}>
                  Save
                </button>
              </footer>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
})

export default NewCustomerModal