// const express4 = require('express');
import express4 from 'express';
const router2 = express4.Router();
// const Student2 = require('../models/Student');
import Student2 from '../models/Student.js';



// Staff: view a student's full details
router2.get("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student2.findOne({ studentId: id });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ success: true, data: student });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({ error: "Server error while fetching student details" });
    }
});


router2.post("/students/:id/reports", async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ error: "Report content required" });
        }

        const student = await Student2.findOne({ studentId: req.params.id });
        if (!student) return res.status(404).json({ error: "Student not found" });

        const report = {
            content,
            createdAt: new Date(),
            createdBy: "Staff", // Optional: replace with real staffId
        };

        student.reports.push(report);
        await student.save({ validateBeforeSave: false });

        res.json({ message: "Report added successfully", report });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router2.get("/students/:id/reports", async (req, res) => {
    try {
        const student = await Student2.findById(req.params.id).select("name regNo reports");
        if (!student) return res.status(404).json({ error: "Student not found" });

        res.json({ studentId: student._id, name: student.name, regNo: student.regNo, reports: student.reports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



// module.exports = router2;
export default router2;