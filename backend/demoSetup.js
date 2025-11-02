// @ts-nocheck
import mongoose from "mongoose";
import connectDB from "./db.js";
import Staff from "./models/Staff.js";
import Student from "./models/Student.js";

const setupDemo = async () => {
  await connectDB();

  // Remove previous demo data
  await Staff.deleteMany({});
  await Student.deleteMany({});

  // Create demo staff
  const staff = new Staff({ name: "Staff1", email: "staff1@test.com", password: "1234" });
  await staff.save();

  // Create demo student linked to this staff
  const student = new Student({
    name: "Student1",
    email: "student1@test.com",
    password: "1234",
    proctorId: staff._id,
  });
  await student.save();

  console.log("✅ Demo staff and student created");
  process.exit();
};

setupDemo();
