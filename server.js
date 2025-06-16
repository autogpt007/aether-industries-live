const express = require('express');
const cors = require('cors'); // Import the cors middleware
const verifyIdToken = require('./server/middleware/authMiddleware'); // Import the authentication middleware

const app = express(); // Initialize an Express application
const port = process.env.PORT || 3001; // Define the port for the server (use 3001 to avoid conflict with Next.js)

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing (CORS)
// Configure the origin to match your client-side application's URL
// In production, replace '*' with your actual client domain for security
app.use(cors({ origin: 'http://localhost:3000' }));

// Define a public root route
app.get('/', (req, res) => {
  res.send('Firebase Admin SDK server is running!');
});

// Define a protected route that requires authentication
// The verifyIdToken middleware will run before the route handler
app.get('/api/protected-data', verifyIdToken, (req, res) => {
  // If the middleware successfully verified the token, req.user will contain the decoded token payload
  console.log('Accessing protected data for user:', req.user.uid);

  // Send a success response with user information from the decoded token
  res.status(200).json({
    message: 'This is protected data!',
    userId: req.user.uid,
    email: req.user.email,
    name: req.user.name || 'User', // Provide a fallback if name is not in the token
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});