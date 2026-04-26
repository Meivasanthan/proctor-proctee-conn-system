
import express from "express";
import Staff from "../models/Staff.js";
import Student from "../models/Student.js";

import jwt from "jsonwebtoken";

const router = express.Router();

// Staff/Student login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, role, password, department, registerNumber } = req.body;
    console.log("🔐 Login attempt:", { email, role, department, hasPassword: !!password });

    // ✅ Validate role first
    if (!role || (role !== 'student' && role !== 'staff')) {
      console.error("❌ Invalid role received:", role);
      return res.status(400).json({
        success: false,
        message: `Invalid role: '${role}'. Must be 'student' or 'staff'.`
      });
    }

    let users = null;

    if (role === 'student') {
      // Validate all required fields for student
      if (!email || !password || !department || !registerNumber) {
        return res.status(400).json({
          success: false,
          message: "Student login: email, password, department, and registerNumber are required"
        })
      }

      const student = await Student.findOne({ email: email })
      console.log("Students are first login :", student)
      if (!student) {
        return res.status(402).json({
          success: false,
          message: "Student with this email not found"
        });
      }

      // Verify credentials
      if (student.department !== department || student.password !== password) {
        return res.status(402).json({
          success: false,
          message: "Department, or Password is incorrect"
        });
      }

      console.log("✅ Student authenticated:", student.email);
      users = {
        _id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
        studentId: student.studentId
      };

    } else if (role === 'staff') {
      // Validate all required fields for staff
      if (!email || !password || !department) {
        return res.status(400).json({
          success: false,
          message: "Staff login: email, password, and department are required"
        });
      }
      const allStaff = await Staff.find();

      console.log(
        "DB Emails:",
        allStaff.map(s => ({
          email: JSON.stringify(s.email),
          length: s.email.length
        }))
      );

      console.log(
        "Login Email:",
        JSON.stringify(email.trim()),
        "Length:",
        email.trim().length
      );
      const staff = await Staff.findOne({ email: email.trim() });
      console.log("Staff are:", staff)
      console.log("🔍 Staff lookup result:", staff ? "Found" : "Not found", { email });
      if (!staff) {
        return res.status(402).json({
          success: false,
          message: "Staff with this email not found"
        });
      }

      // Verify credentials
      if (staff.department !== department || staff.password !== password) {
        return res.status(402).json({
          success: false,
          message: "Department or Password is incorrect"
        });
      }

      console.log("✅ Staff authenticated:", staff.email);
      users = {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        staffId: staff.staffId,
        section: staff.section
      };
    }

    // This should never happen now due to role validation, but keep as safety check
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed: user data not found"
      });
    }

    const token = jwt.sign({ ...users, role }, process.env.JWT_SECRET)

    console.log(token)


    // res.json({
    //   user: {
    //     _id: staff._id,
    //     email: staff.email,
    //     name: staff.name,
    //     department: staff.department,
    //     staffId: staff.staffId,
    //   }
    // });

    res.json({ success: true, message: "Login Successfull", token, user: users })
  } catch (err) {
    console.error("❌ Login error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Fetch all students assigned to a staff
router.get("/:staffId/students", async (req, res) => {
  try {
    const { staffId } = req.params;
    const students = await Student.find({ proctorId: staffId });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
