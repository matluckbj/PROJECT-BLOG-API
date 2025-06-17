"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For password reset tokens

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true // Added trim
  },
  lastName: {
    type: String,
    required: true,
    trim: true // Added trim
  },
  email: {
    type: String,
    required: true,
    unique: true, // Corrected 'Unique' to 'unique'
    trim: true, // Added trim
    lowercase: true // Added lowercase for consistency
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Corrected 'Unique' to 'unique'
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Use minlength for Mongoose schema validation
    maxlength: 15 // Use maxlength for Mongoose schema validation
  },
  // Fields for password reset (from our earlier discussion)
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true, // Added timestamps from boilerplate style for createdAt/updatedAt
  toJSON: { // Added toJSON transform from boilerplate
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      delete ret._id;
      delete ret.password; // Never return password in response
    }
  }
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if password was modified
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to generate a reset token (from our earlier discussion)
userSchema.methods.createResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  // Store the hashed token in DB, but send the plain token via email
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour (3600000 ms)
  return resetToken; // Return the plain token for the email
};


module.exports = mongoose.model('User', userSchema);