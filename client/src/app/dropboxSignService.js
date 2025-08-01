import { DropboxSign } from '@dropbox/sign';
import axios from 'axios';

const API_KEY = '7ef581ea1a9d91a6145fd0434527c4c574ed5d2777cbcb19acaef7b6075ea7ec';
const client = new DropboxSign({ apiKey: API_KEY });

// export const createSignatureRequest = async (data) => {
//   try {
//     const response = await client.signatureRequestCreateEmbedded({
//       title: data.title,
//       subject: data.subject,
//       message: data.message,
//       signers: data.signers,
//       files: data.files,
//       test_mode: true // Set to false for production
//     });
//     return response;
//   } catch (error) {
//     console.error('Error creating signature request:', error);
//     throw error;
//   }
// };

// export const getEmbeddedSignUrl = async (signatureId) => {
//   try {
//     const response = await client.embedded.getSignUrl(signatureId);
//     return response.embedded.sign_url;
//   } catch (error) {
//     console.error('Error getting embedded URL:', error);
//     throw error;
//   }
// };

// export const getSignatureRequest = async (requestId) => {
//   try {
//     const response = await client.signatureRequestGet(requestId);
//     return response.signatureRequest;
//   } catch (error) {
//     console.error('Error getting signature request:', error);
//     throw error;
//   }
// };

// Helper function to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};