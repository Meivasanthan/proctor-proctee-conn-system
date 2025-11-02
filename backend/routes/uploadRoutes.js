// // @ts-nocheck
// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import Student from "../models/Student.js";

// const router = express.Router();

// // ✅ Ensure uploads folder exists
// const uploadFolder = "uploads";
// if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// // ✅ Multer storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadFolder),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // ✅ Upload files for a specific student
// router.post("/:studentId/upload", upload.array("files"), async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { category } = req.body; // e.g., "marksheet", "leaveLetter", "certificate"

//     if (!req.files || req.files.length === 0)
//       return res.status(400).json({ message: "No files uploaded" });

//     // ✅ Find by studentId (NOT Mongo _id)
//     const student = await Student.findOne({ studentId });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     // ✅ Add uploaded files to student's documents array
//     const uploadedFiles = req.files.map(file => ({
//       filename: file.originalname,
//       path: `/uploads/${file.filename}`,
//       category,
//       uploadedAt: new Date(),
//     }));

//     student.documents.push(...uploadedFiles);
//     await student.save();

//     res.json({ message: "Files uploaded successfully", files: uploadedFiles });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ✅ Fetch all documents of a student
// router.get("/:studentId/documents", async (req, res) => {
//   try {
//     const student = await Student.findOne({ studentId });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     res.json(student.documents);
//   } catch (err) {
//     console.error("Fetch error:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
