import express from "express";
import { FieldValue } from "firebase-admin/firestore";
import { admin, db } from "../config/firebase-admin.js";
// import { db } from "../config/firebase-admin";
// import { exportedContacts } from "./../minifier.js";

const employeesRoute = express.Router();

employeesRoute.post("/employee", async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("employees").doc(employeeData.id.toString());
    await docRef.set(employeeData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: employeeData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add employee",
    });
  }
});

employeesRoute.delete("/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    
    
    const docRefEmp = db.collection("employees").doc(employeeId);
    const docRefUser = db.collection("users").doc(employeeId);

    // Check if the note exists
    const docEmp = await docRefEmp.get();
    const docUser = await docRefUser.get();
    if (!docEmp.exists) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }
    if (!docUser.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Delete the note
    await docRefEmp.delete();
    await docRefUser.delete();

    // Delete the authentication user first
    try {
      await admin.auth().deleteUser(employeeId);
    } catch (authError) {
      // Handle case where user might not exist in auth but exists in Firestore
      if (authError.code === 'auth/user-not-found') {
        
      } else {
        throw authError; // Re-throw other auth errors
      }
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      id: employeeId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete Employee",
    });
  }
});

employeesRoute.put("/employee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updates = req.body;
    const docRefEmp = db.collection("employees").doc(employeeId);
    const docRefUser = db.collection("users").doc(employeeId);

    // Check if the note exists
    const docEmp = await docRefEmp.get();
    const docUser = await docRefUser.get();

    if (!docEmp.exists || !docUser.exists) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

     // Check if status is correct
    // Update the note with the new data
    await docRefEmp.update({
      ...updates,
      details: {
        ...updates?.details, // Preserve existing details if they exist
        role: updates?.details?.status === 111 ? 111 : updates?.details?.role,
      },
      // role : updates?.details.status === 111 ? 111 : updates?.details.role,
      updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    });

    await docRefUser.update({
      role: updates?.details.status === 111 ? 111 : updates?.details.role,
      updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    });

    

    // Get the updated note to return
    const updatedDocEmp = await docRefEmp.get();
    const updatedDocUser = await docRefUser.get();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: { ...updatedDocEmp.data(), ...updatedDocUser.data() },
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update employee",
    });
  }
});

employeesRoute.get("/", async (req, res) => {
  try {
    // 1. Get all customers from Firestore
    const snapshot = await db.collection("employees").get();

    // 2. Format the data
    const employee = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the rest of the data
    }));


    res.status(200).json({
      success: true,
      message: "Employees loaded successfully",
      data: employee,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to loaded employees",
    });
  }
});

export default employeesRoute; // ✅ Correct default export
