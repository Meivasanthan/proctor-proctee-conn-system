import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Student",
    required: true
  },
  fileName: { 
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: { 
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['academic', 'personal', 'achievement', 'other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastModified: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for faster queries
uploadSchema.index({ studentId: 1, category: 1 });
uploadSchema.index({ uploadedAt: -1 });

// Virtual for file URL
uploadSchema.virtual('fileUrl').get(function() {
  return `/uploads/${this.fileName}`;
});

// Method to format file size
uploadSchema.methods.formatFileSize = function() {
  const bytes = this.fileSize;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const Upload = mongoose.model("Upload", uploadSchema);
export default Upload;
