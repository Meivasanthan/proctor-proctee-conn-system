import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function FileUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("document");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      navigate("/login");
    }
  }, [navigate]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!files || files.length === 0) {
      setMessage("Please select files to upload");
      return;
    }

    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      setMessage("Please login first");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("category", category);

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/students/${studentId}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true
      });
      setMessage("✅ Files uploaded successfully!");
      setFiles(null);
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setMessage(`❌ Upload failed: ${err.response?.data?.message || err.message || "Please try again"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <form onSubmit={handleUpload} className="bg-white p-6 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Documents</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">General Document</SelectItem>
                <SelectItem value="marksheet">Mark Sheet</SelectItem>
                <SelectItem value="certificate">Certificate</SelectItem>
                <SelectItem value="leaveLetter">Leave Letter</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Select Files</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Files"}
          </Button>

          {message && (
            <div className={`mt-3 text-center text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
