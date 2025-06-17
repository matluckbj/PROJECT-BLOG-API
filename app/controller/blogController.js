"use strict";
const blogService = require("../services/blogService");
const response = require("../utils/responses");

exports.createBlog = async (req, res) => {
  
  const { error, data, statusCode } = await blogService.createBlog(req.body, req);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.getAllBlogs = async (req, res) => {
  
  const { error, data, statusCode } = await blogService.getAllBlogs(req.query);

  if (error) return response.error(res, error, statusCode);

  return response.paginated(res, data, "Blogs retrieved successfully", statusCode);
};

exports.getBlogPostById = async (req, res) => {
  const { error, data, statusCode } = await blogService.getBlogById(req.params.id);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.updateBlogPost = async (req, res) => {
  
  const { error, data, statusCode } = await blogService.updateBlog(req.params.id, req.body, req);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.deleteBlogPost = async (req, res) => {
  
  const { error, data, statusCode } = await blogService.deleteBlog(req.params.id, req);

  if (error) return response.error(res, error, statusCode);

  return response.success(res, data, statusCode);
};

exports.getBlogsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params; // Get authorId from URL parameters
    const { error, data, statusCode } = await blogService.getBlogsByAuthorId(authorId, req.query); // Pass query for pagination/sorting

    if (error) return response.error(res, error, statusCode);

    return response.paginated(res, data, "Author's blogs retrieved successfully", statusCode);
  } catch (error) {
    console.error('Error getting blogs by author ID:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error', error: error.message });
  }
};
