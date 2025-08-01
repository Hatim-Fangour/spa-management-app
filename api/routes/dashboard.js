import express from "express";
import { db } from "../config/firebase-admin.js";
import { FieldValue } from "firebase-admin/firestore";

const dashRoute = express.Router();

  const convertDateToISO = (date) => {
    if (date instanceof Date) {
      return date.toISOString(); // Convert to ISO string
    }
    return date; // Return as-is if it's not a Date
  };

dashRoute.post("/expense", async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("expenses").doc(expenseData.id.toString());
    await docRef.set(expenseData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: expenseData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add expense",
    });
  }
});



dashRoute.delete("/expense/:id", async (req, res) => {
  try {
    const expenseId = req.params.id;
    
    
    const docRef = db.collection("expenses").doc(expenseId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Expense not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      id: expenseId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete expense",
    });
  }
});



dashRoute.put("/expense/:id", async (req, res) => {
  try {
    const expenseId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("expenses").doc(expenseId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Expense not found",
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
      message: "Expense updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update Expense",
    });
  }
});



dashRoute.post("/income", async (req, res) => {
  try {
    const incomeData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("incomes").doc(incomeData.id.toString());
    await docRef.set(incomeData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: incomeData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add income",
    });
  }
});


dashRoute.delete("/income/:id", async (req, res) => {
  try {
    const incomeId = req.params.id;
    
    
    const docRef = db.collection("incomes").doc(incomeId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Income not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
      id: incomeId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete Income",
    });
  }
});



dashRoute.put("/income/:id", async (req, res) => {
  try {
    const incomeId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("incomes").doc(incomeId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Income not found",
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
      message: "Income updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update Income",
    });
  }
});









dashRoute.post("/saving", async (req, res) => {
  try {
    const savingData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("savings").doc(savingData.id.toString());
    await docRef.set(savingData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: savingData,
    });
  } catch (err) {
     // show the err if any
    res.status(500).json({
      success: false,
      error: "Failed to add saving",
    });
  }
});

dashRoute.delete("/saving/:id", async (req, res) => {
  try {
    const savingId = req.params.id;
    
    
    const docRef = db.collection("savings").doc(savingId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Saving not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Saving deleted successfully",
      id: savingId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete Saving",
    });
  }
});



dashRoute.put("/saving/:id", async (req, res) => {
  try {
    const savingId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("savings").doc(savingId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Saving not found",
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
      message: "Saving updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update Saving",
    });
  }
});

dashRoute.get("/expenses", async (req, res) => {
  const QueryExpenses = query(
    collection(db, "expenses"),
    orderBy("createdAt", "asc")
  ); // "desc" for newest first
  try {
    const querySnapshotExpenses = await getDocs(QueryExpenses);
    const expenses = querySnapshotExpenses.docs.map((doc) => ({
      ...doc.data(),
      createdAt: convertDateToISO(convertTimestamp(doc.data().createdAt)),
    }));
  } catch (error) {}
});

// of course we should export our dashRoute in order to be exported in other files
export default dashRoute; // ✅ Correct default export
