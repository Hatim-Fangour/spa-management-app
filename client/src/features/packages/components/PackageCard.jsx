import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const PackageCard = ({ ppl, onToggle, isOpen }) => {
  const editMode = true;
  return (
    <div
      //   className=''
      className={`relative flex flex-col justify-between w-full h-[70px] overflow-hidden box-border rounded-[10px] mr-[10px] gap-1 bg-[rgba(190,190,190,0.184)] transition-all duration-300 ease-in-out ${
        isOpen ? "view !h-[380px]" : ""
      }`}
    >
      <div
        className="packageCardContainer flex items-center w-full p-[10px] cursor-pointer justify-between"
        onDoubleClick={onToggle}
      >
        <div className="info flex items-center gap-[10px] flex-[5]">
          {/* <img
          className="w-[50px] h-[50px] rounded-full object-cover border-[0.5px] border-[rgba(94,94,94,0.121)] box-border"
            src="https://images.pexels.com/photos/6560304/pexels-photo-6560304.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt=""
          /> */}

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
              <span className="promoPrice font-bold">{ppl.promoPrice} $</span>
              <span className="price text-red-500 italic line-through text-[14px]">{`${ppl.price} $`}</span>
            </>
          ) : (
            <span className="promoPrice font-bold">{ppl.price} $</span>
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
                  //   onClick={() => handleDeletePackage(ppl)}
                >
                  Delete
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
              // onChange={(e) =>
              //   setSubService({ ...subServ, name: e.target.value })
              // }
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
                setNewPackage({ ...newPackage, price: e.target.value })
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
          onClick={onToggle}
        >
          {!isOpen ? (
            <IoMdArrowDropdown className="viewBtn text-[rgba(128,128,128,0.842)] transition-colors duration-200 ease-in-out" />
          ) : (
            <IoMdArrowDropup className="viewBtn text-[rgba(128,128,128,0.842)] transition-colors duration-200 ease-in-out" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
