"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../app/controller/AuthController");
const validate = require("../app/middleware/validationMiddleware");
const { registerUserSchema, loginUserSchema } = require("../app/validators/schemas");

// POST /v1/users/register
router.post("/register", validate(registerUserSchema), authController.createUser);

// POST /v1/users/login
router.post("/login", validate(loginUserSchema), authController.login);

// POST /v1/users/logout
router.post("/logout", authController.logout);

module.exports = router;
