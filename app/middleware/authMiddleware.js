"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const response = require("../utils/responses");


exports.authenticateUser = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.error(res, "Token is missing or invalid.", StatusCodes.UNAUTHORIZED);
  }

  token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);

    if (!payload || !payload.userId) {
      return response.error(res, "Token payload is invalid.", StatusCodes.UNAUTHORIZED);
    }

    req.user = await User.findById(payload.userId).select('-password');

    if (!req.user) {
        return response.error(res, "Not authorized, user from token not found.", StatusCodes.UNAUTHORIZED);
    }
    next();
  } catch (error) {
    console.error("Authentication Error:", error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return response.error(res, "Token has expired.", StatusCodes.UNAUTHORIZED);
    }
    return response.error(res, "Token is invalid or has expired.", StatusCodes.UNAUTHORIZED);
  }
};
