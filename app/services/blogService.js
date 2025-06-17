"use strict";
const Blog = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");
const blogValidator = require("../validators/BlogValidator");
const { resolveRequestQueryToMongoDBQuery } = require('../utils/helpers');

exports.createBlog = async (body, req) => {
  try {
    const validatorError = await blogValidator.createBlog(body);
    if (validatorError) {
      return { error: validatorError, statusCode: StatusCodes.BAD_REQUEST };
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (body.image) {
      imageUrl = body.image;
    } else {
      return { error: "Image is required for the blog post.", statusCode: StatusCodes.BAD_REQUEST };
    }

    const authorId = req.user._id;

    const createBlog = await Blog.create({
      blogTitle: body.blogTitle,
      blogBody: body.blogBody,
      author: authorId,
      image: imageUrl,
      category: body.category,
    });

    await createBlog.populate('author', 'firstName lastName');

    return { data: createBlog, statusCode: StatusCodes.CREATED };

  } catch (e) {
    console.error("BlogService createBlog error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

exports.getAllBlogs = async (requestQuery) => {
  try {
    const { page, limit, filter, sort } = resolveRequestQueryToMongoDBQuery(requestQuery);

    console.log('getAllBlogs - Filter:', JSON.stringify(filter, null, 2));
    console.log('getAllBlogs - Page:', page, 'Limit:', limit, 'Sort:', JSON.stringify(sort, null, 2));

    const options = {
      page: page,
      limit: limit,
      sort: sort,
      populate: { path: 'author', select: 'firstName lastName' }
    };

    const queryFilter = filter || {};

    // This will now call mongoose-paginate
    const result = await Blog.paginate(queryFilter, options);

    return { data: result, statusCode: StatusCodes.OK };

  } catch (e) {
    console.error("BlogService getAllBlogs error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

exports.getBlogById = async (id) => {
  try {
    const blog = await Blog.findById(id)
      .populate('author', 'firstName lastName')
      .lean();

    if (!blog) { return { error: "Blog post not found", statusCode: StatusCodes.NOT_FOUND }; }
    return { data: blog, statusCode: StatusCodes.OK };
  } catch (e) {
    console.error("BlogService getBlogById error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

exports.updateBlog = async (id, body, req) => {
  try {
    const validatorError = await blogValidator.updateBlog(body);
    if (validatorError) { return { error: validatorError, statusCode: StatusCodes.BAD_REQUEST }; }

    const blog = await Blog.findById(id);
    if (!blog) { return { error: "Blog post not found", statusCode: StatusCodes.NOT_FOUND }; }

    if (req.file) { body.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; }

    delete body.author;
    delete body.createdAt;
    delete body.updatedAt;

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true })
      .populate('author', 'firstName lastName')
      .lean();

    return { data: updatedBlog, statusCode: StatusCodes.OK };
  } catch (e) {
    console.error("BlogService updateBlog error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

exports.deleteBlog = async (id, req) => {
  try {
    const blog = await Blog.findById(id);
    if (!blog) { return { error: "Blog post not found", statusCode: StatusCodes.NOT_FOUND }; }

    await Blog.findByIdAndDelete(id);
    return { data: { message: "Blog post deleted successfully" }, statusCode: StatusCodes.OK };
  } catch (e) {
    console.error("BlogService deleteBlog error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

exports.getBlogsByAuthorId = async (authorId, requestQuery) => {
  try {
    const { page, limit, sort } = resolveRequestQueryToMongoDBQuery(requestQuery);
    const filter = { author: authorId };

    console.log('getBlogsByAuthorId - Filter:', JSON.stringify(filter, null, 2));
    console.log('getBlogsByAuthorId - Page:', page, 'Limit:', limit, 'Sort:', JSON.stringify(sort, null, 2));

    const options = {
        page: page,
        limit: limit,
        sort: sort,
        populate: { path: 'author', select: 'firstName lastName' },
    };

    const result = await Blog.paginate(filter, options);

    return { data: result, statusCode: StatusCodes.OK };
  } catch (e) {
    console.error("BlogService getBlogsByAuthorId error:", e);
    return { error: e.message, statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};
