
import express from "express";
import Staff from "../models/Staff.js";
import Student from "../models/Student.js";

import jwt from "jsonwebtoken";

const router = express.Router();

// Staff login endpoint
router.post("/login", async (req, res) => {
  try {
    console.log("uightughtugh")
    const { email, role, password, department, registerNumber } = req.body;
    console.log(email, password, department, registerNumber)
    console.log("Role:", role)

    let users = null



    if (role === 'student') {
      if (!email || !password || !department || !registerNumber) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }
      const student = await Student.findOne({ email: email })
      console.log("Stude", student)
      if (!student)
        return res.status(402).json({ success: false, message: "Student Detail not found" });

      if (student.studentId !== registerNumber || student.department !== department || student.password !== password) {
        return res.status(402).json({ success: false, message: "Register Number  or Department or Password is incorrect" });

      }

      console.log(student)
      users =
      {
        _id: student._id,
        name: student.name,
        email: student.email,
        department: student.department,
        studentId: student.studentId
      }

    }

    if (role === 'staff') {
      if (!email || !password || !department) {
        return res.status(400).json({
          success: false,
          message: "All fields are required"
        });
      }

      const staff = await Staff.findOne({ email });
      console.log("Staff:,", staff)
      if (!staff) {
        return res.status(402).json({ success: false, message: "Staff Detail Not found" });
      }
      if (staff.department !== department || staff.password !== password) {
        return res.status(402).json({ success: false, message: "Department or Password is incorrect" });
      }

      console.log(staff);
      users = {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        department: staff.department,
        staffId: staff.staffId,
        section: staff.section
      }
    }



    const token = jwt.sign(users, process.env.SecretKey)

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
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
