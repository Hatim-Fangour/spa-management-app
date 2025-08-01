import express from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase-admin.js";
// import { db } from "../config/firebase-admin";

const appointmentsRoute = express.Router();

appointmentsRoute.post("/appointment", async (req, res) => {
  try {
    
    const appointmentData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    
    const docRef = db.collection("appointments").doc(appointmentData.id.toString());
    await docRef.set(appointmentData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: appointmentData,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to add appointment",
    });
  }
});


appointmentsRoute.delete("/appointment/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    
    const docRef = db.collection("appointments").doc(appointmentId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      id: appointmentId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete appointment",
    });
  }
});


appointmentsRoute.put("/appointment/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const updates = req.body;

    const docRef = db.collection("appointments").doc(appointmentId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      });
    }
    
    // Update the note with the new data
    await docRef.update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    });

    // Get the updated note to return
    const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update appointment",
    });
  }
});


appointmentsRoute.get("/", async (req, res) => {
  try {
    // 1. Get all customers from Firestore
    const snapshot = await db.collection("appointments").get();
    
    // 2. Format the data
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the rest of the data
    }));
    

    res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      data: appointments,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to loaded appointments",
    });
  }
});

export default appointmentsRoute; // ✅ Correct default export
