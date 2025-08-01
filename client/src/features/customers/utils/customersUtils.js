import { Delete, Visibility } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useMemo } from "react";

export const getCustomerColumns = (
  handleEditCustomer,
  handleDeleteCustomer
) => [
  {
    field: "fullName",
    headerName: "Full Name",
    flex: 1,
    // width: 150,
    headerAlign: "center",
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    // width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "email",
    headerName: "Email",
    // width : 300,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "companyName",
    headerName: "Company Name",
    // width: 200,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "country",
    headerName: "Country",
    // width: 170,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "city",
    headerName: "City",
    // width: 200,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "actions",
    headerName: "Actions",
    // width: 200,
    flex: 1,
    // flexGrow : 3,
    sortable: false,

    headerAlign: "center",
    align: "center",

    renderCell: (params) => (
      <div className="customerActionsBtns flex items-center justify-center gap-4  h-full">
        <button
          className="viewCustomerBtn bg-[#cab06d] flex cursor-pointer px-[7px] py-[3px] border-none rounded-[10px] shadow-md  text-white"
          onClick={() => handleEditCustomer(params)}
        >
          <Visibility />
        </button>

        <button
          className="deleteCustomerBtn flex  cursor-pointer px-[7px] py-[3px] border-none rounded-[10px] shadow-md bg-[#df1a1a] text-white"
          onClick={() => handleDeleteCustomer(params)}
        >
          <Delete />
        </button>
      </div>
    ),
  },
];

export const tabListStyles = {
  minHeight: "30px",
  height: "40px",
  ".MuiTabs-list": {
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#ffe49f4f",
    borderRadius: "5px",
    padding: "6px",
    height: "100%",
  },
  ".MuiTabs-indicator": {
    display: "none",
  },
  ".MuiButtonBase-root": {
    flex: "1",
    color: "#828085",
    minHeight: "20px",
    height: "100%",
    textTransform: "initial",
    "&.Mui-selected": {
      backgroundColor: "#cab06d",
      color: "white",
      borderRadius: "3px",
    },
  },
};

export const NoteCard = ({ note }) => {
  return (
    <Box
      sx={{
        p: 1,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        bgcolor: "#f9f9f9",
        textWrap: "wrap",
        width: "100%",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        "&:hover": {
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        },
        overflow: "hidden", // Prevents content from bleeding outside
        wordBreak: "break-word", // Breaks long words
        overflowWrap: "break-word", // Alternative for older browsers
      }}
    >
      <Box
        component="div"
        sx={{
          whiteSpace: "pre-wrap", // Preserves line breaks and wraps text
          maxWidth: "100%", // Ensures text doesn't overflow horizontally
          display: "inline-block", // Better handling of text boundaries
        }}
      >
        {note.content}
      </Box>
      <Box
        component="span"
        sx={{
          fontSize: "0.8rem",
          color: "#666",
          display: "block",
          mt: 1,
        }}
      >
        {note.dateTime}
      </Box>
    </Box>
  );
};
