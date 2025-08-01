import express from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase-admin.js";
// import { db } from "../config/firebase-admin";
// import { exportedContacts } from "./../minifier.js";

const customersRoute = express.Router();

customersRoute.post("/customer", async (req, res) => {
  try {
    const customerData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("customers").doc(customerData.id.toString());
    await docRef.set(customerData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: customerData,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to add customer",
    });
  }
});

customersRoute.delete("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    
    
    const docRef = db.collection("customers").doc(customerId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      id: customerId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete customer",
    });
  }
});

customersRoute.put("/customer/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("customers").doc(customerId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
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
      message: "Customer updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update customer",
    });
  }
});

customersRoute.get("/", async (req, res) => {
  try {
    // 1. Get all customers from Firestore
    const snapshot = await db.collection("customers").get();
    
    // 2. Format the data
    const customers = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the rest of the data
    }));
    

    res.status(200).json({
      success: true,
      message: "Customer loaded successfully",
      data: customers,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to loaded customer",
    });
  }
});

export default customersRoute; // ✅ Correct default export
