export const ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin'
};

export const DEPARTMENTS = {
  CS: 'CS',
  IT: 'IT',
  ECE: 'ECE',
  EEE: 'EEE',
  MECH: 'MECH',
  CIVIL: 'CIVIL'
};

export const FILE_CATEGORIES = {
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ],
  IMAGE: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  CATEGORIES: {
    ACADEMIC: 'academic',
    PERSONAL: 'personal',
    ACHIEVEMENT: 'achievement',
    OTHER: 'other'
  }
};

export const ALLOWED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/jpg'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  NOT_AUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Something went wrong',
  VALIDATION_ERROR: 'Invalid input data',
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  CREATE_SUCCESS: 'Created successfully',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  UPLOAD_SUCCESS: 'File uploaded successfully'
};