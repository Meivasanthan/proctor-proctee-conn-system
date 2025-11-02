// @ts-nocheck
import React, { useState } from "react";
import { registerStudent } from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerStudent(form);
    alert(result.message || "Registered!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3 font-bold">Student Registration</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-64">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
