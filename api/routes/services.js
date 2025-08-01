import express from "express";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase-admin.js";
// import { db } from "../config/firebase-admin";
// import { exportedContacts } from "./../minifier.js";

const servicesRoute = express.Router();

servicesRoute.post("/service", async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = db.collection("services").doc(serviceData.id.toString());
    await docRef.set(serviceData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: serviceData,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to add service",
    });
  }
});

servicesRoute.delete("/service/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    const docRef = db.collection("services").doc(serviceId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      });
    }

    // Delete the note
    await docRef.delete();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      id: serviceId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete service",
    });
  }
});

servicesRoute.put("/service/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const updates = req.body;
    const docRef = db.collection("services").doc(serviceId);

    // Check if the note exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
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
      message: "Service updated successfully",
      data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update service",
    });
  }
});

// add subservice (add elmnt in content)
servicesRoute.post("/subservice", async (req, res) => {
  try {


    const {serviceID, ...rest} = req.body
    const subserviceData = {
      ...rest,
    //   createdAt: FieldValue.serverTimestamp(),
    };

    
    const docRef = db.collection("services").doc(serviceID.toString()).update({
        content: FieldValue.arrayUnion(subserviceData)
    })
    // Check if the note exists
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Service not found",
    //   });
    // }
    
       // Update the note with the new data
    // await docRef.update({
    //   ...updates,
    //   updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    // });

    //   await docRef.set(subserviceData);

    // 5. Return user data
    res.status(201).json({
      success: true,
      data: subserviceData,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to add sub-service",
    });
  }
});

servicesRoute.delete("/subservice", async (req, res) => {
  try {
    const { serviceID, id } = req.query;
    
    // const docRef = db.collection("services").doc(serviceID);

    const docRef = db.collection("services").doc(serviceID);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Service not found" });
    }
    
    const subserviceToDelete = doc.data().content.find(
      item => item.id === id
    );

    if (!subserviceToDelete) {
      return res.status(404).json({ error: "Subservice not found" });
    }
    
    await docRef.update({
      content: FieldValue.arrayRemove(subserviceToDelete)
    });

    res.status(200).json({
      success: true,
      message: "Sub-service deleted successfully",
    //   id: serviceId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete sub-service",
    });
  }
});


servicesRoute.put("/subservice/:id", async (req, res) => {
  try {
    const subServiceId = req.params.id;
    const {serviceID, ...updates} = req.body;
    const docRef = db.collection("services").doc(serviceID);

    await db.runTransaction(async (transaction) => {
      // 1. Get the current document
      const doc = await transaction.get(docRef);
      if (!doc.exists) throw new Error("Service not found");
      
      // 2. Get the content array and find the index
      const content = doc.data().content || [];
      const subserviceIndex = content.findIndex(item => item.id === subServiceId);
      
      if (subserviceIndex === -1) {
        throw new Error("Subservice not found");
      }
      
      // 3. Create a new array with updated title
      const updatedContent = [...content];
      updatedContent[subserviceIndex] = {
        ...updatedContent[subserviceIndex],
        ...updates
      };
      
      // 4. Update the document
      transaction.update(docRef, { content: updatedContent });
    });
    // const docRef = db.collection("services").doc(serviceID);

    // Check if the note exists
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Service not found",
    //   });
    // }
    
    // Update the note with the new data
    // await docRef.update({
    //   ...updates,
    //   updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    // });

    // Get the updated note to return
    // const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
    //   data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update service",
    });
  }
});

// add subservice (add elmnt in content)
servicesRoute.post("/package", async (req, res) => {
  try {

    
    const {serviceID,subServiceID, ...rest} = req.body
    // const subserviceData = {
    //   ...rest,
    // //   createdAt: FieldValue.serverTimestamp(),
    // };

    const docRef = db.collection("services").doc(serviceID);
      await db.runTransaction(async (transaction) => {

    const doc = await transaction.get(docRef);
    if (!doc.exists) throw new Error("Service not found");
    
    // Find the subservice and update its pricingPlan
    const updatedContent = doc.data().content.map(subservice => {
      if (subservice.id === subServiceID) {
        return {
          ...subservice,
          pricingPlan: [
            ...(subservice.pricingPlan || []),
            {
              ...rest,
            //   id: Date.now() // Generate unique ID
            }
          ]
        };
      }
      return subservice;
    });
    
    transaction.update(docRef, { content: updatedContent });
  });
    
    // const docRef = db.collection("services").doc(serviceID.toString()).update({
    //     content: FieldValue.arrayUnion(subserviceData)
    // })
    // Check if the note exists
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Service not found",
    //   });
    // }
    
       // Update the note with the new data
    // await docRef.update({
    //   ...updates,
    //   updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    // });

    //   await docRef.set(subserviceData);

    // 5. Return user data
    res.status(201).json({
      success: true,
    //   data: subserviceData,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to add sub-service",
    });
  }
});

servicesRoute.delete("/package", async (req, res) => {
  try {
    const { serviceID,subserviceID, id } = req.query;
    
    // const docRef = db.collection("services").doc(serviceID);

const docRef = db.collection("services").doc(serviceID);
    await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    if (!doc.exists) throw new Error("Service not found");
    
    const updatedContent = doc.data().content.map(subservice => {
      if (subservice.id === subserviceID) {
        return {
          ...subservice,
          pricingPlan: subservice.pricingPlan.filter(
            pkg => pkg.id !== id
          )
        };
      }
      return subservice;
    });
    
    transaction.update(docRef, { content: updatedContent });
  });

    res.status(200).json({
      success: true,
      message: "Sub-service deleted successfully",
    //   id: serviceId,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to delete sub-service",
    });
  }
});


servicesRoute.put("/package", async (req, res) => {
  try {
    const { serviceiD,subserviceiD, id } = req.query;
    const {serviceID,subServiceID, ...updates} = req.body;
    
    const docRef = db.collection("services").doc(serviceID);

      await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    if (!doc.exists) throw new Error("Service not found");
    
    const updatedContent = doc.data().content.map(subservice => {
      if (subservice.id === subServiceID) {
        return {
          ...subservice,
          pricingPlan: subservice.pricingPlan.map(pkg => 
            pkg.id === id ? { ...pkg, ...updates } : pkg
          )
        };
      }
      return subservice;
    });
    
    transaction.update(docRef, { content: updatedContent });
  });
    // const docRef = db.collection("services").doc(serviceID);

    // Check if the note exists
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Service not found",
    //   });
    // }
    
    // Update the note with the new data
    // await docRef.update({
    //   ...updates,
    //   updatedAt: FieldValue.serverTimestamp(), // Add update timestamp
    // });

    // Get the updated note to return
    // const updatedDoc = await docRef.get();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
    //   data: updatedDoc.data(),
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to update service",
    });
  }
});



servicesRoute.get("/", async (req, res) => {
  try {
    // 1. Get all customers from Firestore
    const snapshot = await db.collection("services").get();
    
    // 2. Format the data
    const services = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the rest of the data
    }));
    

    res.status(200).json({
      success: true,
      message: "Services loaded successfully",
      data: services,
    });
  } catch (err) {
    
    res.status(500).json({
      success: false,
      error: "Failed to loaded services",
    });
  }
});

export default servicesRoute; // ✅ Correct default export
