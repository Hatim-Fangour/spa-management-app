import { Box } from "@mui/material";
import { Ellipsis } from "lucide-react";
import { AiOutlineShopping } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { GiExpense, GiProfit } from "react-icons/gi";

export const cardsInfo = [
  {
    acro: "TMI",
    title: "Monthly Income",
    total: 0,
    comparison: 0,
    icon: <GiProfit />,
    style: "bg-gradient-to-br from-[#a1309fdc] to-[#5362edf6]",
    type: "income",
  },
  {
    acro: "TME",
    title: "Monthly Expenses",
    total: 0,
    comparison: 0,
    icon: <GiExpense />,
    style: "from-[#C90E94] to-[#FF78A7]",
    type: "expense",
  },
  {
    acro: "TDI",
    title: "Daily Income",
    total: 0,
    comparison: 0,
    icon: <AiOutlineShopping />,
    style: "from-[#5A86C3] to-[#46C7EE]",
    type: "income",
  },
  {
    acro: "TDE",
    title: "Daily Expense",
    total: 0,
    comparison: 0,
    icon: <FiShoppingCart />,
    style: "from-[#FB7D53] to-[#FEB42B]",
    type: "expense",
  },
];

export const abrv = ["TMI", "TME", "TDI", "TDE"];

export const getColumns = (handleClick) => [
  {
    field: "date",
    headerName: "Date",
    // flex: 1,
    // flexGrow: 1,
    width: 120,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "category",
    headerName: "Category",
    // flex: 1,
    // flexGrow: 1,
    width: 150,

    headerAlign: "center",
    align: "center",
  },
  {
    field: "vendorSupplier",
    headerName: "Vendor/Supplier",
    width: 120,
    // flex: 1,
    // flexGrow: 1,
    // width:150,

    headerAlign: "center",
    align: "center",
  },
  {
    field: "notes",
    headerName: "Description",
    // description: "This column has a value getter and is not sortable.",
    sortable: false,
    // width:180,
    flex: 1,
    // width: 300,
    // flexGrow: 1,

    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",
    // flex: 1,
    // flexGrow: 1,
    width: 140,

    headerAlign: "center",
    align: "center",
  },

  {
    field: "type",
    headerName: "Type",
    // flex: 1,
    headerAlign: "center",
    align: "center",
    // width: 130,
    flex: 1,
    renderCell: (params) => {
      const typeClass =
        {
          income: "income-type",
          expense: "expense-type",
          // Add more type mappings as needed
        }[params.value] || "other-type";

      return <span className={`type-cell ${typeClass}`}>{params.value}</span>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    // flex: 1,
    flex: 1,
    headerAlign: "center",
    align: "center",
    // width: 130,
    renderCell: (params) => {
      const typeClass =
        {
          Pending: "pending-status",
          Paid: "paid-status",
          // Add more type mappings as needed
        }[params.value] || "other-status";

      return <span className={`status-cell ${typeClass}`}>{params.value}</span>;
    },
  },
  {
    field: "action",
    headerName: "",
    // flex: 1,
    sortable: false,
    headerAlign: "center",
    align: "center",

    width: 30,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <button
          onClick={(e) => {
            // console.log(params.row);
            handleClick(e, params.row);
          }}
        >
          <Ellipsis size={20} />
        </button>
      </Box>
    ),
  },
];

export const getSavingsColumns = (handleClick) => [
  {
    field: "date",
    headerName: "Date",
    // flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "amount",
    headerName: "Amount",
    // description: "This column has a value getter and is not sortable.",
    sortable: true,
    flex: 1,
    // minWidth: 140,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "action",
    headerName: "",
    // flex: 1,
    sortable: false,
    headerAlign: "center",
    align: "center",

    width: 30,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <button
          onClick={(e) => {
            // console.log(params.row);
            handleClick(e, params.row);
          }}
        >
          <Ellipsis size={20} />
        </button>
      </Box>
    ),
  },
];
