const express = require("express");
const userController = require("../controller/user.controller");
const authenticate = require("../middleware/tokenMiddleware/verifyToken");
const {
  signupValidation,
  loginValidation,
} = require("../validation/auth/auth.validation");
const router = express.Router();

// Add a new user
router.post("/users", [signupValidation], userController.signIn);

// for login user
router.post("/login", [loginValidation], userController.logIn);

//  Retrieve all users from the database.
router.get("/users", [authenticate], userController.getAllUsers);
// Retrieve a specific user by their ID.
router.get("/users/:id", [authenticate], userController.specific_user);

// Update a specific user's information (name, email, age) by their ID.
router.put("/users/:id", authenticate, userController.updateUser);

//Delete a user from the database by their ID.

router.delete("/users/:id", [authenticate], userController.delete);
// Ensure proper error handling and validation for these endpoints.

module.exports = router;
