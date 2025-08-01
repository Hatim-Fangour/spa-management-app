import { DataGrid } from "@mui/x-data-grid";
import {  useState } from "react";

import {  useSelector } from "react-redux";
import {  Menu, MenuItem } from "@mui/material";
import {
  DepServMenuItems,
  ExpenseCategoryMenuItems,
  IncomeCategoryMenuItems,
  IncomeEmployeeInvolvedItems,
  PayementMethodMenuItems,
  RecurringMenuItems,
  StatusMenuItems,
} from "../../../app/config";
import { getColumns } from "../utils/dashUtils";

const InOutTable = ({
  setOpenExpenseModal,
  setOpenIncomeModal,
  setIsEditMode,
  setExpenseData,
  setIncomeData,
  setDeleteDialogOpen,
}) => {




  const [statiData, setStatiData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

    const expenses = useSelector((state) => state.dashboard.expenses);
  const incomes = useSelector((state) => state.dashboard.incomes);


  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setStatiData(row);
  };

  const findValueByText = (array, text) => {
    const item = array.find((item) => item.text === text);
    return item?.value; // Returns undefined if not found
  };
  const findTextByValue = (array, value) => {
    const item = array.find((item) => item.value === value);
    return item ? item.text : ""; // Default to 'Unknown' if not found
  };

  const allExpenses = expenses?.map((expense) => ({
    ...expense,
    amount: expense.amount,
    category: findTextByValue(ExpenseCategoryMenuItems, expense.category),
    description: expense.description,
    payMethode: findTextByValue(PayementMethodMenuItems, expense.payMethode),
    depServ: findTextByValue(DepServMenuItems, expense.depServ),
    notes: expense.notes,
    responsiblePerson: expense.responsiblePerson,
    status: findTextByValue(StatusMenuItems, expense.status),
    vendorSupplier: expense.vendorSupplier,
    recurring: findTextByValue(RecurringMenuItems, expense.recurring),
  }));

  const allIncomes = incomes?.map((income) => ({
    ...income,
    amount: income.amount,

    category: findTextByValue(IncomeCategoryMenuItems, income.category),
    payMethode: findTextByValue(PayementMethodMenuItems, income.payMethode),
    employeeInvolved: findTextByValue(
      IncomeEmployeeInvolvedItems,
      income.employeeInvolved
    ),
    status: findTextByValue(StatusMenuItems, income.status),
  }));

  const handleEditStati = () => {
    setIsEditMode(true);

    if (statiData.type === "expense") {
      setOpenExpenseModal(true);
      const data = {
        ...statiData,
        // date :
        amount: statiData.amount,
        category: findValueByText(ExpenseCategoryMenuItems, statiData.category),
        description: statiData.description,
        payMethode: findValueByText(
          PayementMethodMenuItems,
          statiData.payMethode
        ),
        depServ: findValueByText(DepServMenuItems, statiData.depServ),
        notes: statiData.notes,
        responsiblePerson: statiData.responsiblePerson,
        status: findValueByText(StatusMenuItems, statiData.status),
        vendorSupplier: statiData.vendorSupplier,
        recurring: findValueByText(RecurringMenuItems, statiData.recurring),
      };
      setExpenseData(data);
    } else if (statiData.type === "income") {
      setOpenIncomeModal(true);
      const data = {
        ...statiData,
        amount: statiData.amount,
        category: findValueByText(IncomeCategoryMenuItems, statiData.category),
        payMethode: findValueByText(
          PayementMethodMenuItems,
          statiData.payMethode
        ),
        notes: statiData.notes,
        status: findValueByText(StatusMenuItems, statiData.status),
        vendorSupplier: statiData.vendorSupplier,
      };
      setIncomeData(data);
    }
    setAnchorEl(null);
  };

  const handleDeleteStati = () => {
    setDeleteDialogOpen(true);
    if (statiData.type === "expense") {
      setExpenseData(statiData);
      setIncomeData(null);
    } else if (statiData.type === "income") {
      setIncomeData(statiData);
      setExpenseData(null);
    }
    setAnchorEl(null);
  };

  return (
    <>
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
        <MenuItem onClick={handleEditStati}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteStati}>Remove</MenuItem>
      </Menu>

      <DataGrid
        // rows={allExpenses}
        rows={[...allIncomes, ...allExpenses].sort((a, b) => {
          return b.createdAt?.seconds - a.createdAt?.seconds;
        })}
        columns={getColumns(handleClick)}
        pagination={true} // Disable pagination
        autoPageSize={false}
        disableColumnMenu
        disableRowSelectionOnClick
        disableVirtualization={false} // ✅ Keep virtualization ENABLED (better performance)
        sx={{
          backgroundColor: "transparent",
          border: "none",

          
          "& .MuiDataGrid-cell": {
            // border: "none",
            // padding: "4px 4px",
            // backgroundColor: "rgba(223, 102, 102, 0.345)",
          },

          "& .type-cell, & .status-cell": {
            fontWeight: "600",
            borderRadius: "20px",
            padding: "4px 10px",
          },
          "& .income-type": {
            backgroundColor: "rgba(0, 128, 0, 0.1)",
            color: "#008000",
            border: "1px solid rgba(0, 128, 0, 0.3)",
          },
          "& .expense-type": {
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            color: "#9c0000",
            border: "1px solid rgba(255, 0, 0, 0.3)",
          },
          "& .paid-status": {
            backgroundColor: "rgba(53, 255, 103, 0.1)",
            color: "#006b09",
            border: "1px solid rgba(4, 255, 0, 0.3)",
          },
          "& .pending-status": {
            backgroundColor: "rgba(79, 219, 251, 0.1)",
            color: "#007185",
            border: "1px solid rgba(0, 255, 255, 0.3)",
          },
          "& .other-status": {
            backgroundColor: "rgba(247, 254, 105, 0.637)",
            color: "#606e00",
            border: "1px solid rgba(229, 255, 0, 0.92)",
          },
        }}
      />
    </>
  );
};

export default InOutTable;
