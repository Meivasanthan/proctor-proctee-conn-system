import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    let currentUser;
    if (decoded.role === 'student') {
      currentUser = await Student.findById(decoded._id);
    } else if (decoded.role === 'staff') {
      currentUser = await Staff.findById(decoded._id);
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.passwordChangedAt && decoded.iat < currentUser.passwordChangedAt.getTime() / 1000) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // Grant access to protected route - add role to user object
    req.user = currentUser.toObject();
    req.user.role = decoded.role;
    next();
  } catch (error) {
    next(error);
  }
};

// Restrict certain routes to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Rate limiting middleware
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Sanitize data middleware
import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Input validation rules
export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

export const studentValidation = [
  body('studentId').matches(/^\d{2}[A-Z]{2}\d{3}$/),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('department').isIn(['CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']),
  body('year').isInt({ min: 1, max: 4 }),
  body('section').isIn(['A', 'B', 'C'])
];

export const staffValidation = [
  body('staffId').matches(/^S\d{3}$/),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('department').isIn(['CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']),
  body('designation').isIn(['Professor', 'Associate Professor', 'Assistant Professor'])
];