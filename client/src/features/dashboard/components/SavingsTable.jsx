import {  Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {  useState } from "react";
import { useSelector } from "react-redux";
import {
  DepositMethodMenuItems,
  PayementMethodMenuItems,
  SavingCategoryMenuItems,
  SavingStatusMenuItems,
} from "../../../app/config";
import { getSavingsColumns } from "../utils/dashUtils";

const SavingsTable = ({
  setOpenSavingModal,
  setIsEditMode,
  setSavingData,
  setDeleteDialogOpen,
}) => {
  const savings = useSelector((state) => state.dashboard.savings);
  const [data, setData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const findTextByValue = (array, value) => {
    const item = array.find((item) => item.value === value);
    return item ? item.text : ""; // Default to 'Unknown' if not found
  };

  const findValueByText = (array, text) => {
    const item = array.find((item) => item.text === text);
    return item?.value; // Returns undefined if not found
  };

  const allSavings = savings?.map((saving) => ({
    ...saving,
    category: findTextByValue(SavingCategoryMenuItems, saving.category),
    payMethode: findTextByValue(PayementMethodMenuItems, saving.payMethode),
    depoMethode: findTextByValue(DepositMethodMenuItems, saving.depoMethode),
    status: findTextByValue(SavingStatusMenuItems, saving.status),
  }));

  const handleClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setData(row);
  };

  const handleEditSaving = () => {
    console.log(data);
    setIsEditMode(true);
    setOpenSavingModal(true);
    const tempData = {
      ...data,
      category: findValueByText(SavingCategoryMenuItems, data.category),
      payMethode: findValueByText(PayementMethodMenuItems, data.payMethode),
      depoMethode: findValueByText(DepositMethodMenuItems, data.depoMethode),
      status: findValueByText(SavingStatusMenuItems, data.status),
    };
    setSavingData(tempData);

    setAnchorEl(null);
  };

  const handleDeleteSaving = () => {
    setDeleteDialogOpen(true);
    setSavingData(data);

    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ height: "100%" }} className="savingTable">
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleEditSaving}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteSaving}>Remove</MenuItem>
      </Menu>

      <DataGrid
        rows={allSavings}
        columns={getSavingsColumns(handleClick)}
        pagination={true} // Disable pagination
        autoPageSize={false}
        disableColumnMenu
        disableRowSelectionOnClick
        sx={{
          backgroundColor: "transparent",
          border: "none",
        }}
      />
    </div>
  );
};

export default SavingsTable;
