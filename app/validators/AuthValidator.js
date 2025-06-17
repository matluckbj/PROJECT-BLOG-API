"use strict";
const { validate } = require("../utils/helpers");
const { registerUserSchema, loginUserSchema } = require("./schemas");

exports.createUser = async (body) => {
  return validate(registerUserSchema, body);
};

exports.loginUser = async (body) => {
  return validate(loginUserSchema, body);
};
