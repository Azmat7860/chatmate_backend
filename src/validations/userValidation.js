import { check, validationResult } from "express-validator";

export const validateRegistration = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateLogin = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

export const updateUserValidation = [
  check("name")
    .optional()
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters long"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
