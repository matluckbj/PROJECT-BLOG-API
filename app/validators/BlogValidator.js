"use strict";
const { validate } = require("../utils/helpers");
const { createBlogSchema, updateBlogSchema } = require("./schemas");

exports.createBlog = async (body) => {
  return validate(createBlogSchema, body);
};

exports.updateBlog = async (body) => {
  return validate(updateBlogSchema, body);
};
