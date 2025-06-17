"use strict";

const Joi = require("joi");

// --- User Schemas ---
exports.registerUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(15).required(), 
  phoneNumber: Joi.string().trim().min(10).max(15).required(),
});

exports.loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// --- Blog Schemas ---
exports.createBlogSchema = Joi.object({
  blogTitle: Joi.string().trim().min(3).max(200).required(),
  blogBody: Joi.string().min(10).required(),
  image: Joi.string().uri().optional().allow(''), // Optional and allows empty string if no file
  category: Joi.string().trim().min(2).max(50).required(),
});

exports.updateBlogSchema = Joi.object({
  blogTitle: Joi.string().trim().min(3).max(200).optional(),
  blogBody: Joi.string().min(10).optional(),
  image: Joi.string().uri().optional().allow(''),
  category: Joi.string().trim().min(2).max(50).optional(),
  
}).min(1); // At least one field must be present for an update
