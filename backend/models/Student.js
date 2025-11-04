import mongoose from "mongoose"
import { type } from "os";
import { ref } from "process";


const ParentSchema = new mongoose.Schema({
  name: { type: String },
  occupation: { type: String },
  phone: { type: String }
}, { _id: false });


const SchoolSchema = new mongoose.Schema({
  tenth: { name: String, mark: String, percentage: String },
  twelfth: { name: String, mark: String, percentage: String }
}, { _id: false });


const MarkSchema = new mongoose.Schema({
  semester: Number,
  cgpa: String,
  gpa: String,
  marksheetUrl: String
}, { _id: false });


const ArrearSchema = new mongoose.Schema({
  semester: Number,
  courses: [{ courseName: String, courseCode: String }]
}, { _id: false });


const AchievementSchema = new mongoose.Schema({
  type: String, // e.g., internship, nptel, online-course, event
  fileUrl: String,
  details: String
}, { _id: false });


const LeaveSchema = new mongoose.Schema({
  type: String,
  from: Date,
  to: Date,
  reason: String,
  letterUrl: String,
  medicalCertUrl: String
}, { _id: false });


const OnDutySchema = new mongoose.Schema({
  eventName: String,
  collegeName: String,
  from: Date,
  to: Date,
  odLetterUrl: String
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String }, // Optional: staff ID or name
}, { _id: false });



const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{2}[A-Z]{2}\d{3}$/ // Format: 23CS001
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

    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: {
    type: String,
    // required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    // select: false // Don't include password in queries by default
  },
  department: {
    type: String,
    // required: true,
    // enum: ['CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']
  },
  year: {
    type: Number,
    // required: true,
    min: 1,
    max: 4
  },
  section: {
    type: String,
    // required: true,
    enum: ['A', 'B', 'C']
  },
  proctorId: {
    type: String, ref: 'Staff'
  },
  basic: {
    name: String,
    dob: Date,
    bloodGroup: String,
    community: String,
    religion: String,
    nationality: String,
    permanentAddress: String,
    temporaryAddress: String,
    phoneNumber: String,
    aadharNumber: String,
    panNumber: String,
    aaparId: String,
    seatType: String,
    busType: String,
    busNumber: String,
    busRoute: String,
  },
  father: ParentSchema,
  mother: ParentSchema,
  school: SchoolSchema,
  marks: [MarkSchema],
  arrears: [ArrearSchema],
  achievements: [AchievementSchema],
  additionalDocuments: [String], // array of file URLs
  leaves: [LeaveSchema],
  onDuties: [OnDutySchema],
  reports: [ReportSchema],

  createdAt: { type: Date, default: Date.now }
})


const Student = mongoose.model('Student', StudentSchema);

export default Student