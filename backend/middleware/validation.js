import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const userValidationRules = () => [
  check("email", "Please provide a valid Email").isEmail(),
  check("password", "Please provide a valid Password").isLength({ min: 6 }),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors
    .array()
    .map((err) => ({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

export function superAdminValidate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    if (req.user.role !== "super-admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  });
}

export function adminValidate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    if (req.user.role == "super-admin" || req.user.role == "admin") {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  });
}

export function moderatorValidate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    if (
      req.user.role == "super-admin" ||
      req.user.role == "admin" ||
      req.user.role == "moderator"
    ) {
      return next();
    }

    return res.status(403).json({ message: "Forbidden" });
  });
}

export function checkRole(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    req.user_role = "user";
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user_role = "user";
      return next();
    }

    req.user_role = "admin";
    next();
  });
}

export function userValidation(req, res, next) {
  // verify with the jwt token and check if the user is logged in
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    req.user = decoded;

    next();
  });
}

// Alias for userValidation to maintain consistency
export const userValidate = userValidation;
