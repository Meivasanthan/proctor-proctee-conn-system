import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    required: true,
    unique: true,
    match: /^S\d{3}$/ // Format: S001, S002, etc.
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,

  },
  department: {
    type: String,
    required: true,
    enum: ['CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']
  },
  designation: {
    type: String,
    required: true,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor']
  },
  profileImage: {
    type: String,
    default: 'default-staff-profile.png'
  },
  phone: {
    type: String,
    match: /^\+?[\d\s-]{10,}$/
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});



const Staff = mongoose.model("Staff", staffSchema);
export default Staff;
