import express from "express";
import {
  adminValidate,
  checkRole,
  superAdminValidate,
  userValidationRules,
  validate,
} from "../middleware/validation.js";
import {
  userSignIn,
  userLogIn,
  findOneUser,
  checkUserExistsByEmail,
} from "../controller/auth/authController.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Authentication routes
router.post(
  "/user/signup",
  userValidationRules(),
  validate,
  checkRole,
  userSignIn
);

router.post("/user/login", userValidationRules(), validate, userLogIn);

// User routes
router.get("/users/:id", (req, res) => {
  findOneUser(req, res, req.params.id);
});

// Retrieve user by email using query parameter
// e.g., GET /users?email=example@example.com
router.get("/users", adminValidate, checkUserExistsByEmail);

// ADMIN ROUTES
import {
  createAdmin,
  getAdmins,
  adminLogin,
  getAdminById,
  deleteAdmin,
  validateAdmin,
} from "../controller/auth/adminController.js";

// this is creating a new admin which can only be done by super-admin
router.post("/admin/signup", superAdminValidate, createAdmin);

router.post("/admin/login", adminLogin);

router.post("/admin/validate", validateAdmin);

router.get("/admins", superAdminValidate, getAdmins);

router.get("/admins/:id", superAdminValidate, getAdminById);

router.delete("/admins/:username", superAdminValidate, deleteAdmin);

export default router;
