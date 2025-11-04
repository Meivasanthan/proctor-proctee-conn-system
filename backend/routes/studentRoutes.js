import express from 'express'
const router = express.Router();
// const Student = require('../models/Student');
import Student from '../models/Student.js';
// const upload = require('../middleware/upload');
import upload from '../middleware/upload.js';
// const path = require('path');
import path from 'path';
// const fs = require('fs');
import fs from 'fs';
// const PDFDocument = require('pdfkit');
import PDFDocument from 'pdfkit';


// Create or update student profile
router.post("/student", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if student already exists
    let student = await Student.findOne({ email });

    if (student) {
      // 🔁 Update existing student
      student = await Student.findOneAndUpdate(
        { email },
        { $set: req.body },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Profile updated successfully",
        student,
      });
    } else {
      // 🆕 Create new student
      const newStudent = new Student(req.body);
      await newStudent.save();
      return res.json({
        success: true,
        message: "Profile created successfully",
        student: newStudent,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});



// Get all students (staff view)
router.get('/get-student', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get single student
router.get('/student/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

// Upload marksheet for a semester
// === Save Marks & Marksheet ===
router.post("/student/marks", upload.single("marksheet"), async (req, res) => {
  try {
    const { email, semester, cgpa, gpa } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    const existingSem = student.marks.find(
      (m) => Number(m.semester) === Number(semester)
    );

    if (existingSem) {
      existingSem.cgpa = cgpa;
      existingSem.gpa = gpa;
      if (fileUrl) existingSem.marksheetUrl = fileUrl;
    } else {
      student.marks.push({
        semester: Number(semester),
        cgpa,
        gpa,
        marksheetUrl: fileUrl,
      });
    }

    // 👇 Skip validation on unrelated fields like password
    await student.save({ validateBeforeSave: false });

    return res.json({ success: true, message: "Marks updated successfully", student });
  } catch (err) {
    console.error("Error saving marks:", err);
    res.status(500).json({ error: "Server error while saving marks" });
  }
});



// Add arrear course to a semester
// Add arrears for a semester by email
router.post("/student/arrears", async (req, res) => {
  try {
    const { email, semester, courses } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Find or create arrear for this semester
    let sem = student.arrears.find(a => Number(a.semester) === Number(semester));

    if (sem) {
      sem.courses = courses;
    } else {
      student.arrears.push({ semester: Number(semester), courses });
    }

    // ✅ Save arrears only, bypassing validation
    await student.save({ validateBeforeSave: false });

    res.json({ success: true, message: "Arrear details saved successfully", student });
  } catch (err) {
    console.error("Error saving arrear:", err);
    res.status(500).json({ error: "Server error while saving arrear" });
  }
});


router.post("/student/achievements", upload.array("files", 10), async (req, res) => {
  try {
    const { email, type, details } = req.body;
    console.log("📩 Incoming upload request:");
    console.log("Email:", email);
    console.log("Type:", type);
    console.log("Details:", details);
    console.log("Files:", req.files);

    const student = await Student.findOne({ email });
    if (!student) {
      console.log("❌ Student not found for email:", email);
      return res.status(404).json({ error: "Student not found" });
    }

    if (!req.files || req.files.length === 0) {
      console.log("⚠️ No files received");
      return res.status(400).json({ error: "No files uploaded" });
    }

    req.files.forEach((f) => {
      student.achievements.push({
        type,
        details,
        fileUrl: "/uploads/" + f.filename,
      });
    });

    console.log("🧾 Before saving:", student.achievements);

    await student.save({ validateBeforeSave: false });

    console.log("✅ Saved successfully");

    res.json({ message: "Achievements uploaded successfully", student });
  } catch (err) {
    console.error("❌ Error uploading:", err);
    res.status(500).json({ error: err.message });
  }
});



// Additional documents upload
router.post('/student/documents', upload.array('files', 10), async (req, res) => {
  try {
    const { email } = req.body;

    const files = req.files || [];
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    files.forEach(f => student.additionalDocuments.push('/uploads/' + f.filename));
    await student.save({ validateBeforeSave: false });
    return res.json({ message: "Upload Success", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Leave application
router.post('/student/leaves', upload.fields([{ name: 'letter', maxCount: 1 }, { name: 'medical', maxCount: 1 }]), async (req, res) => {
  try {
    const { email, type, from, to, reason } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const letter = req.files && req.files.letter ? '/uploads/' + req.files.letter[0].filename : null;
    const medical = req.files && req.files.medical ? '/uploads/' + req.files.medical[0].filename : null;
    student.leaves.push({ type, from: from ? new Date(from) : null, to: to ? new Date(to) : null, reason, letterUrl: letter, medicalCertUrl: medical });
    await student.save({ validateBeforeSave: false });
    return res.json({ message: "Upload Success", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OnDuty application
router.post('/student/onduty', upload.single('odLetter'), async (req, res) => {
  try {
    const { email, eventName, collegeName, from, to } = req.body;
    const odUrl = req.file ? '/uploads/' + req.file.filename : null;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    student.onDuties.push({ eventName, collegeName, from: from ? new Date(from) : null, to: to ? new Date(to) : null, odLetterUrl: odUrl });
    await student.save({ validateBeforeSave: false });
    return res.json({ message: "Data saved Success", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/student/:id/report/pdf", async (req, res) => {
  try {
    const student = await Student.findOne({studentId :req.params.id});
    if (!student) return res.status(404).json({ error: "Student not found" });

    // ✅ Set PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report-${student.name || student._id}.pdf"`
    );

    // ✅ Create PDF document
    const doc = new PDFDocument();
    doc.pipe(res);

    // === PDF Content ===
    doc.fontSize(20).text("Student Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${student.name || ""}`);
    doc.text(`Register Number: ${student.regNo || ""}`);
    doc.text(`CGPA: ${student.cgpa || "N/A"}`);
    doc.text(`Arrears: ${student.arrears?.total ?? 0}`);
    doc.moveDown();

    // ✅ Achievements
    doc.fontSize(16).text("Achievements:", { underline: true });
    if (student.achievements?.length > 0) {
      student.achievements.forEach((a, i) => {
        doc.fontSize(12).text(`${i + 1}. ${a.type} - ${a.details}`);
      });
    } else {
      doc.fontSize(12).text("No achievements available");
    }

    doc.moveDown();

    // ✅ Reports
    doc.fontSize(16).text("Reports:", { underline: true });
    if (student.reports?.length > 0) {
      student.reports.forEach((r, i) => {
        doc.fontSize(12).text(`${i + 1}. ${r.content}`);
        doc.fontSize(10).text(
          `Created at: ${new Date(r.createdAt).toLocaleString()}`
        );
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(12).text("No reports available");
    }

    doc.end(); // finalize
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

export default router;