"use strict";
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const dayjs = require("dayjs");

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true,
    trim: true
  },
  blogBody: {
    type: String,
    trim: true,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  category: {
      type: String,
      trim: true,
      required: true,
      default: 'General'
  },
  
}, {
  
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id.toString(); // Convert _id to 'id' string
      delete ret.__v;
      delete ret._id;
    }
  },
  strict: false
});

// Add a text index for full-text search on blogTitle and blogBody
// This is required for the 'q' (text search) parameter in resolveRequestQueryToMongoDBQuery
blogSchema.index({ blogTitle: 'text', blogBody: 'text' });

blogSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Blog", blogSchema);
