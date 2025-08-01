const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || '12wer45ty6u7i8o9p0'; // Replace with your actual secret key

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },          // Payload (data to encode)
    secret,                 // Secret key
    { expiresIn: '1d' }     // Token expires in 1 day
  );
};

module.exports = generateToken;