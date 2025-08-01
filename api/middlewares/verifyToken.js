const jwt = require("jsonwebtoken");

// THIS IS  a midllewire
const verifyToken = (req, res, next) => {
  // in authHeader we get the token from headers section of postman

  const authHeader = req.headers.token;
  
  if (authHeader) {
    // if there is  authHeader
    const token = authHeader.split(" ")[1]; // get the token as string
    
    // we verify our token from header and the secret Key from .env file
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      // if the token not valid or wrong or expired tell us "Token not valid !"
      if (err) res.status(403).json("Token is not valid !");

      // if token is valid assign user to req.user
      
      // this "user" variable is like this
      //  {
      // id: '6711741828f088b5cf71fc89',
      // isAdmin: false,
      // iat: 1730486866,
      // exp: 1731782866
      // }
      req.user = user;
      next(); // go to next middleware
    });
  } else {
    // if there is no authHeader
    return res.status(401).json("You are not authenticated !");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // check if the user want to change his password or the admin, in this two cases we are OK
    // because the admin also can change the bassword of other user
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next(); // we go to next middleware
    } else {
      res.status(403).json("You are not allowed to do this operation !");
    }
  });
};

// exmp of use case, Only admin can add products to the store
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // verify if the user is an ADMIN because it should be admin to make some operations
    if (req.user.isAdmin) {
      // if it's an admin then GO to next
      next();
    } else {
      res.status(403).json("You are not allowed to do this operation !");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
