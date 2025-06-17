"use strict";
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const authValidator = require("../validators/AuthValidator");
const jwt = require("jsonwebtoken"); 

exports.createUser = async(body) => {
  try {
    const validatorError = await authValidator.createUser(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.BAD_REQUEST
      };
    }

    const { email } = body;
    const alreadyExist = await User.findOne({ email });

    if (alreadyExist) {
      return {
        error: "User with this email already exists",
        statusCode: StatusCodes.CONFLICT
      };
    }

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      email,
      password: body.password
    });

    return {
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userId: user._id,
        }
      },
      statusCode: StatusCodes.CREATED 
    };

  } catch (e) {
    console.error("AuthService createUser error:", e); 
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};

exports.loginUser = async (body) => { 
  try {
    const validatorError = await authValidator.loginUser(body);

    if (validatorError) {
      return {
        error: validatorError,
        statusCode: StatusCodes.BAD_REQUEST
      };
    }

    const { email, password } = body;
    const user = await User.findOne({ email });

    if (!user) {
      return {
        error: "Invalid credentials", 
        statusCode: StatusCodes.UNAUTHORIZED
      };
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return {
        error: "Invalid credentials",
        statusCode: StatusCodes.UNAUTHORIZED
      };
    }

      const token = jwt.sign(
      { userId: user._id },
      process.env.SECRETKEY,
      { expiresIn: process.env.JWT_LIFETIME || "1h" }
    );

    return {
      data: {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      },
      statusCode: StatusCodes.OK,
    };

  } catch (e) {
    console.error("AuthService loginUser error:", e);
    return {
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};
