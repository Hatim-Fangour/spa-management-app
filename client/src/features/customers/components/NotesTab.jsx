import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import  { useContext, useState } from "react";
import { updateCustomer } from "../thunks/customersThunks";
import { useDispatch } from "react-redux";
import { CustomerContext } from "../../pages/Customers";
import { notifySuccess } from "../../utils/toastNotify";
import { NoteCard } from "../utils/customersUtils";



const NotesTab = () => {
  const { customer, onClose } = useContext(CustomerContext);
  const [notes, setNotes] = useState(customer.notes); // State to store all notes
  const [text, setText] = useState(""); // State to store the textfield value

  const dispatch = useDispatch();

  const handleSaveCustomerNote = () => {
    if (text.trim() === "") return; // Don't add empty notes

    const newNote = {
      id: Date.now(), // Unique ID (using timestamp)
      content: text,
      dateTime: new Date().toLocaleString(), // Current date and time
    };

    setNotes([newNote, ...notes]); // <-- This puts newest first
    setText(""); // Clear the textfield
    try {
      dispatch(
        updateCustomer({
          notes: [newNote, ...customer.notes],
          id: customer.id,
        })
      );
      onClose();
      notifySuccess("Note", "added");
    } catch (error) {
      
    }
  };

  // const handleUpdateCustomerNotes = () => {
  //   // try {
  //   //   const { isValid, errors } = validateCustomer(customerData);

  //   //   if (!isValid) {
  //   //     throw {
  //   //       code: 400,
  //   //       message: "Validation failed",
  //   //       details: errors,
  //   //     };
  //   //   }
  //   // } catch (error) {
  //   //   setErrors(error);
  //   //   return;
  //   // }
  //   if (customerData.fullName && customerData.phone) {

  //     try {
  //       dispatch(
  //         updateCustomer({
  //           ...customerData,
  //           id: customerData.id,
  //         })
  //       );
  //       notifySuccess("Customer", "updated");
  //     } catch (error) {

  //     }
  //   }
  // };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2} direction={"column"}>
        <Grid size={4} width={"100%"}>
          <div className="notes-body mb-2">
            <TextField
              className=""
              name="note"
              rows={3}
              multiline
              fullWidth
              cols="30"
              value={text}
              placeholder="Notes ..."
              onChange={(e) => setText(e.target.value)}
            ></TextField>
          </div>

          <div className="notes-controls flex items-center justify-end">
            {/* <button className="cancel">cancel</button> */}
            <Button
              variant="contained"
              fullWidth
              disabled={text.trim().length < 10} // Disable if empty
              // className={`${
              //   !(text.trim().length < 15) ? "readyToSave" : "notReadyToSave"
              // }`}
              onClick={() => handleSaveCustomerNote()}
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
              ADD
            </Button>
          </div>
        </Grid>

        <Grid size={4} width={"100%"}>
          <div className="notes-history">
            <div className="title mb-3">Notes</div>

            <Box
              sx={{
                width: "100%",
                maxHeight: "250px", // Fixed height
                overflowY: "auto", // Vertical scroll
                pr: 1, // Add padding to prevent scrollbar overlap
              }}
            >
              {notes.length === 0 ? (
                <p className="emptyCartText">You don't have any notes</p>
              ) : (
                <Stack spacing={2} p={1}>
                  {notes
                    // .sort((a, b) => new Date(b.id) - new Date(a.id)) // Sort by ID (timestamp)
                    .map((note) => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                </Stack>
              )}
            </Box>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotesTab;
