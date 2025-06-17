"use strict";

const express = require("express");
const router = express.Router();
const blogController = require("../app/controller/blogController");
const { authenticateUser } = require("../app/middleware/authMiddleware");
const upload = require("../app/utils/imageUploader");
const validate = require("../app/middleware/validationMiddleware");
const { createBlogSchema, updateBlogSchema } = require("../app/validators/schemas");

const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err.message);
        return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
        console.error('Unknown File Upload Error:', err);
        return res.status(400).json({ message: `An unexpected file upload error occurred: ${err.message}` });
    }
    next();
};

// POST /v1/blog/create-blog
router.post(
    "/create-blog",
    authenticateUser,
   upload.single("image"),
    uploadErrorHandler,
    validate(createBlogSchema),
    blogController.createBlog
);

// GET /v1/blog/
router.get("/", blogController.getAllBlogs);

// GET /v1/blog/:id
router.get("/:id", blogController.getBlogPostById);

// GET /v1/blog/author/author:id
router.get("/author/:authorId", blogController.getBlogsByAuthorId);

// PUT /v1/blog/:id
router.put( "/:id",
    authenticateUser,      
    upload.single("image"),
    uploadErrorHandler,
    validate(updateBlogSchema),
    blogController.updateBlogPost
);

// DELETE /v1/blog/:id
router.delete(
    "/:id",
    authenticateUser,
    blogController.deleteBlogPost
);

module.exports = router;
