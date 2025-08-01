import crypto from "crypto";
import { admin, auth } from "../config/firebase-admin.js";
// utils/roleCodes.js (Keep this secret on backend)
export const ROLE_CODES = {
  // SUPER_ADMIN: 926, // Full system access
  ADMIN: 705, // Organization-level admin
  MANAGER: 531, // Department manager
  NURSE: 324, // Medical staff
  RECEPTIONIST: 187, // Front desk
  USER: 111, // Front desk
};

export const assignUserRole = async (uid, roleName) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ROLE_CODES[roleName]) {
        throw new Error(`Invalid role name: ${roleName}`);
      }


      

      // Set custom claims
      // await auth.setCustomUserClaims(uid, {
      //   role: ROLE_CODES[roleName],
      //   lastRoleUpdate: admin.firestore.FieldValue.serverTimestamp(),

      //   securityStamp: crypto.randomInt(1000, 9999),
      // }, { merge: true });

      // Force token refresh
      await auth.revokeRefreshTokens(uid);

      // console.log(`Role ${roleName} assigned to ${uid}`);
      resolve(true);
    } catch (error) {
      // console.error("Error assigning role:", error);
      reject(error);
    }
  });
};
