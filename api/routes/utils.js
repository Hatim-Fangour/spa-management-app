import express from "express";
import { db } from "../config/firebase-admin.js";
import { FieldValue } from "firebase-admin/firestore";

const utilsRoute = express.Router();

utilsRoute.post("/note", async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("notes").doc(noteData.id.toString());
    await docRef.set(noteData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: noteData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add note",
    });
  }
});

utilsRoute.get("/notes", async (req, res) => {
  const QueryNotes = query(
    collection(db, "notes"),
    orderBy("createdAt", "asc")
  ); // "desc" for newest first
  try {
    const querySnapshotNotes = await getDocs(QueryNotes);
    const notes = querySnapshotNotes.docs.map((doc) => ({
      ...doc.data(),
      // createdAt: convertDateToISO(convertTimestamp(doc.data().createdAt)),
    }));
  } catch (error) {}
});

utilsRoute.delete("/note/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    
    
    const docRef = db.collection("notes").doc(noteId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      id: noteId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete note",
    });
  }
});

utilsRoute.put("/note/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("notes").doc(noteId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }
     // Check if status is correct
    // Update the note with the new data
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    });

    // Get the updated note to return
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update note",
    });
  }
});

utilsRoute.post("/need", async (req, res) => {
  try {
    const needData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("needs").doc(needData.id.toString());
    await docRef.set(needData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: needData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add need",
    });
  }
});

utilsRoute.delete("/need/:id", async (req, res) => {
  try {
    const needId = req.params.id;
    
    
    const docRef = db.collection("needs").doc(needId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Need not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Need deleted successfully",
      id: needId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete need",
    });
  }
});

utilsRoute.put("/need/:id", async (req, res) => {
  try {
    const needId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("needs").doc(needId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Need not found",
      });
    }
     // Check if status is correct
    // Update the note with the new data
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    });

    // Get the updated note to return
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Need updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update need",
    });
  }
});

utilsRoute.get("/needs", async (req, res) => {
  const QueryExpenses = query(
    collection(db, "needs"),
    orderBy("createdAt", "asc")
  ); // "desc" for newest first
  try {
    const querySnapshotNeeds = await getDocs(QueryExpenses);
    const needs = querySnapshotNeeds.docs.map((doc) => ({
      ...doc.data(),
      // createdAt: convertDateToISO(convertTimestamp(doc.data().createdAt)),
    }));
  } catch (error) {}
});

// utilsRoute.post("/sendemail", async (req, res) => {
//   try {
//     // Create a transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or any other service
//       auth: {
//         user: "hatimfangour87@gmail.com",
//         pass: "Hatiming99@@",
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: "hatimfangour87@gmail.com",
//       to: "hatimfangour22@gmail.com",
//       subject: "Your Subject Here",
//       text: "Plain text content",
//       html: "<p>HTML content</p>", // optional HTML version
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//       } else {
//       }
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       error: "Failed to send email",
//     });
//   }
// });

// of course we should export our dashRoute in order to be exported in other files
export default utilsRoute; // ✅ Correct default export
