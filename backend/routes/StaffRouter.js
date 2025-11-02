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


// Staff: create a report (server side can be same as /students/:id/report/pdf)
router2.get('/students/:id/report', async (req, res) => {
    try {
        const student = await Student2.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Not found' });
        // Here staff-specific logic could be applied (comments, grade normalization, etc.)
        res.json({ generatedAt: new Date(), student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// module.exports = router2;
export default router2;