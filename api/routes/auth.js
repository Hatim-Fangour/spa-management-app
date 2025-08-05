import express from "express";
// const bcrypt = require("bcrypt");
import { admin, db } from "../config/firebase-admin.js";
import { assignUserRole, ROLE_CODES } from "../utils/roleCodes.js";
// const generateToken = require("../utils/jwt");
// in this file we create all routes for Authentification (registration and login in this case)

const storeUserInDb = async (collectionName = "users", uid, data) => {
  if (!data?.role) {
    throw new Error(`Invalid role name: ${data?.role}`);
  }

  
  await db
    .collection(collectionName)
    .doc(uid)
    .set({ ...data, role: data?.role });
};

const storeEmployeeInDb = async (collectionName = "employees", uid, data) => {
  if (data?.role) {
    throw new Error(`Invalid role name: ${data?.role}`);
  }

  
  await db
    .collection(collectionName)
    .doc(uid)
    .set({ ...data, role: data?.role });
};

const authRoute = express.Router(); // Example route setup

// Create New User (Register)
// ? await axios.post("/auth/register", userToRegister)  here we user POST method as mentioned in the route
// above en axmpl of use this route, as you see
// * "/auth/register" in the beginning taped '/auth' in order to specifie each router we should use
// because we have also users and posts
// ! that userToRegister is the body inside req exactly

authRoute.post("/register", async (req, res) => {
  try {
    const { token, userData } = req.body;
    

    // 1. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    const uid = decodedToken.uid;

    
    // 3. Create user profile in database
    const userProfile = {
      uid,
      role: userData?.role,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const employeeProfile = {
      uid,
      certifications: {},
      details: {
        email: userData?.email || "",
        phone: "",
        status: userData?.role || 111,
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
      },
      createdAt: userProfile?.createdAt,
      updatedAt: userProfile?.updatedAt,
    };

    
    

    storeUserInDb("users", uid, userProfile);
    storeEmployeeInDb("employees", uid, employeeProfile);
    // storeUserInDb()

    // assignUserRole(uid, userData.role); // Assign role to user

    // we create a salt like seed in random (salt here = 10 comes from .env file)
    // const salt = await bcrypt.genSalt(parseInt(process.env.SALT))

    // we hash our password to be  not readable
    // hashedPassword =  await bcrypt.hash(req.body.password,  salt)

    // 5. Return user data
    res.status(200).json(userProfile);
  } catch (err) {
     // show the err if any
  }
});

// Log In with user
//means that we execute this line of codes inside if we try to access http://localhost/api/auth/login path
authRoute.post("/login", async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Token is valid and not expired

    // 2. Get complete user record from Firebase Auth
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    try {
      const userDoc = await db.collection("users").doc(decodedToken.uid).get();
      const storedUserData = userDoc.data();


      
      
      
      res.status(200).json({ ...userRecord, ...storedUserData });
    } catch (error) {
      
      res.status(404).json("User not found in db !");
    }
  } catch (err) {
        if (err.code === "auth/id-token-expired") {
          }
    res.status(500).json(err);
  }
});

authRoute.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 1. Get all customers from Firestore
    const docRef = await db.collection("users").doc(userId);

    // Check if the user exists
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const userDoc = await docRef.get();

    

    res.status(200).json({
      success: true,
      message: "User loaded successfully",
      data: user,
    });
  } catch (err) {
        res.status(500).json({
      success: false,
      error: "Failed to loaded user",
    });
  }
});

// Add new Google authentication endpoint
authRoute.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Verify Firebase token from Google sign-in
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;
    
    // const uid = decodedToken.uid;
    // const email = decodedToken.email;
    // const displayName = decodedToken.name || '';

    // 2. Check if user exists in your database
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    
    

    if (!userDoc.exists) {
      const defaultRole = 111; // Or whatever default you want
      const nameParts = name.split(" "); // ["Hatim", "Fangour"]
      const userProfile = {
        uid,
        role: defaultRole,
        firstName: nameParts[0], // "Hatim",
        lastName: nameParts[1], // "Fangour"
        provider: "google",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const employeeProfile = {
        uid,
        certifications: {},
        details: {
          email: email || "",
          phone: "",
          status: defaultRole,
          firstName: userProfile?.firstName || "",
          lastName: userProfile?.lastName || "",
        },
        createdAt: userProfile?.createdAt,
        updatedAt: userProfile?.updatedAt,
      };

      storeUserInDb("users", uid, userProfile);
      storeEmployeeInDb("employees", uid, employeeProfile);
      res.status(200).json(userProfile);
    } else {
      const userRecord = await admin.auth().getUser(uid);
      const userDoc = await db.collection("users").doc(uid).get();
      const storedUserData = userDoc.data();
      
      
      res.status(200).json({ ...userRecord, ...storedUserData });
    }



  } catch (err) {
    console.error("Google authentication error:", err);

    // Handle specific errors
    if (err.code === "auth/id-token-expired") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (err.code === "auth/invalid-id-token") {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.status(500).json({
      error: "Google authentication failed",
      code: err.code,
    });
  }
});

authRoute.post("/verify-token", async (req, res) => {
  try {
    const { token } = req.body;
    // if (!token) {
    //   return res.status(400).json({ error: "Token is required" });
    // }

    // if (typeof token !== "string") {
    //   return res.status(400).json({ error: "Invalid token format" });
    // }

    
    // Verify using Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    // const userRecord = await admin.auth().getUser(decodedToken.uid);

    // 3. Verify custom claims exist
    // if (!userRecord.customClaims || !userRecord.customClaims.role) {
    //   return res.status(403).json({ error: "No roles assigned" });
    // }

    // Return additional verified claims
    res.status(200).json({
      valid: true,
      claims: decodedToken.claims || {}, // Custom claims are in the decodedToken token
      expiresIn: decodedToken.exp - Math.floor(Date.now() / 1000), // Seconds remaining
    });
  } catch (error) {
        res.status(401).json({
      error: "Token verification failed",
      code: error.code,
    });
  }
});

// of course we should export our router in order to be exported in other files
export default authRoute; // ✅ Correct default export
