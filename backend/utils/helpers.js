import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import path from 'path';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

// Hash Password Reset Token
export const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  return {
    resetToken,
    hashedToken,
    expiresIn: Date.now() + 10 * 60 * 1000,
  };
};

// Sanitize filename to prevent path traversal and ensure safe filenames
export const sanitizeFilename = (filename) => {
  // Remove any path components
  const basename = path.basename(filename);
  
  // Replace any non-alphanumeric characters (except dots and hyphens) with underscores
  const sanitized = basename.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Ensure the filename is not too long
  return sanitized.slice(0, 255);
};

// Check if file type is allowed
export const isValidFileType = (mimeType, allowedTypes) => {
  if (!mimeType || !allowedTypes || !Array.isArray(allowedTypes)) {
    return false;
  }
  return allowedTypes.includes(mimeType.toLowerCase());
  const tokenExpires = Date.now() + 10 * 60 * 1000;

  return {
    resetToken,
    hashedToken,
    tokenExpires,
  };
};

// Format Error Messages
export const formatErrorMessage = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return `Duplicate ${field}. Please use another value.`;
  }
  return err.message;
};

// Calculate CGPA
export const calculateCGPA = (semesterGrades) => {
  const validSemesters = Object.values(semesterGrades).filter(grade => grade);
  if (validSemesters.length === 0) return 0;
  
  const total = validSemesters.reduce((sum, grade) => sum + parseFloat(grade), 0);
  return (total / validSemesters.length).toFixed(2);
};

// Generate Student ID
export const generateStudentId = async (department, currentYear) => {
  const yearPrefix = currentYear.toString().slice(-2);
  const deptCode = department.slice(0, 2).toUpperCase();
  
  // Get the last student ID for this year and department
  const lastStudent = await Student.findOne({
    studentId: new RegExp(`^${yearPrefix}${deptCode}`)
  }).sort({ studentId: -1 });

  let sequence = '001';
  if (lastStudent) {
    const lastSequence = parseInt(lastStudent.studentId.slice(-3));
    sequence = (lastSequence + 1).toString().padStart(3, '0');
  }

  return `${yearPrefix}${deptCode}${sequence}`;
};

// Generate Staff ID
export const generateStaffId = async () => {
  const lastStaff = await Staff.findOne().sort({ staffId: -1 });
  
  let sequence = 1;
  if (lastStaff) {
    sequence = parseInt(lastStaff.staffId.slice(1)) + 1;
  }

  return `S${sequence.toString().padStart(3, '0')}`;
};

// Format File Size
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

// Parse Sort Query
export const parseSortQuery = (sortQuery) => {
  if (!sortQuery) return { createdAt: -1 };
  
  return sortQuery.split(',').reduce((acc, item) => {
    const [field, order] = item.split(':');
    acc[field] = order === 'desc' ? -1 : 1;
    return acc;
  }, {});
};

// Build Pagination Response
export const buildPaginationResponse = (docs, page, limit, total) => {
  return {
    results: docs,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages: Math.ceil(total / limit),
    total
  };
};