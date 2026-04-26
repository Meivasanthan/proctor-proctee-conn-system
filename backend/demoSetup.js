// // @ts-nocheck
// import mongoose from "mongoose";
// import connectDB from "./db.js";
// import Staff from "./models/Staff.js";
// import Student from "./models/Student.js";

// const setupDemo = async () => {
//   await connectDB();

//   // Remove previous demo data
//   await Staff.deleteMany({});
//   await Student.deleteMany({});

//   // Create demo staff with ALL required fields
//   const staff = new Staff({
//     staffId: "S001",
//     name: "Dr. John Smith",
//     email: "staff1@test.com",
//     password: "password123", // Must be at least 8 characters
//     department: "CS",
//     designation: "Professor"
//   });
//   await staff.save();
//   console.log("✅ Demo staff created:", staff.email);

//   // Create demo student linked to this staff with ALL required fields
//   const student = new Student({
//     studentId: "23CS001",
//     name: "Student One",
//     email: "student1@test.com",
//     password: "password123",
//     department: "CS",
//     year: 1,
//     proctorId: staff._id,
//   });
//   await student.save();
//   console.log("✅ Demo student created:", student.email);

//   console.log("\n📌 Test Login Credentials:");
//   console.log("STAFF - Email: staff1@test.com | Password: password123 | Department: CS");
//   console.log("STUDENT - Email: student1@test.com | Register: 23CS001 | Password: password123 | Department: CS");
//   console.log("\n✅ Demo data setup complete!");
//   process.exit();
// };

// setupDemo();
