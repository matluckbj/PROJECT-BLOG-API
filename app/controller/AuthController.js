"use strict";
const { StatusCodes } = require("http-status-codes");
const authService = require("../services/AuthService");
const response = require("../utils/responses");


exports.createUser = async (req, res) => {
  const { error, data, statusCode } = await authService.createUser(req.body);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};


exports.login = async (req, res) => {
  const { error, data, statusCode } = await authService.loginUser(req.body);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};


exports.logout = async (req, res) => {
  try {
    return response.success(res, { message: "Logout successful." }, StatusCodes.OK);
  } catch (err) {
    console.error("Logout Error:", err);
    return response.error(res, "Server Error", StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
