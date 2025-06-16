// // server/middleware/authMiddleware.js
// const admin = require('../firebaseAdmin'); // Import the initialized admin object
//
// const verifyIdToken = async (req, res, next) => {
//   // 1. Get the ID token from the Authorization header
//   const authHeader = req.headers.authorization;
//   const idToken = authHeader?.split('Bearer ')[1];
//
//   // 2. If no token is present, return a 401 Unauthorized response.
//   if (!idToken) {
//     return res.status(401).json({ error: 'No authentication token provided.' });
//   }
//
//   try {
//     // 3. Verify the ID token using the Firebase Admin SDK
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log("Decoded Token:", decodedToken);
//
//     // 4. If the token is valid, attach the decoded token to the request object
//     req.user = decodedToken;
//
//     // 5. Call next() to proceed to the next middleware or route handler
//     next();
//
//   } catch (error) {
//     console.error('Error verifying Firebase ID token:', error.message);
//     // Handle various errors:
//     // - Token expired: 'auth/id-token-expired'
//     // - Invalid token: 'auth/argument-error'
//     // - Malformed token: 'auth/argument-error'
//     if (error.code === 'auth/id-token-expired') {
//       return res.status(401).json({ error: 'Authentication token expired. Please re-authenticate.' });
//     }
//     // 4. If the token is invalid, return a 403 Forbidden response
//     return res.status(403).json({ error: 'Unauthorized: Invalid authentication token.' });
//   }
// };
//
// module.exports = verifyIdToken;