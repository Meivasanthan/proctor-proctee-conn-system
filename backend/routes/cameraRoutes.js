import express from "express";
import axios from "axios";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Python camera service URL
const CAMERA_SERVICE_URL = process.env.CAMERA_SERVICE_URL || "http://localhost:5001";

// Start camera monitoring
router.post("/camera/start", protect, restrictTo("proctor", "staff"), async (req, res) => {
    try {
        console.log("📹 Starting camera monitoring...");
        const response = await axios.post(`${CAMERA_SERVICE_URL}/api/monitoring/start`, {});
        res.json(response.data);
    } catch (error) {
        // If monitoring is already active, treat as success
        if (error.response?.data?.error === "Monitoring already active" || error.response?.status === 200) {
            return res.json({ status: "monitoring_already_active" });
        }
        console.error("Camera service error:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to start camera monitoring", details: error.response?.data });
    }
})

// Stop camera monitoring
router.post("/camera/stop", protect, restrictTo("proctor", "staff"), async (req, res) => {
    try {
        console.log("📹 Stopping camera monitoring...");
        const response = await axios.post(`${CAMERA_SERVICE_URL}/api/monitoring/stop`, {});
        res.json(response.data);
    } catch (error) {
        console.error("Camera service error:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to stop camera monitoring", details: error.response?.data });
    }
});

// Get monitoring status
router.get("/camera/status", protect, restrictTo("proctor", "staff"), async (req, res) => {
    try {
        console.log("📹 Getting camera status...");
        const response = await axios.get(`${CAMERA_SERVICE_URL}/api/monitoring/status`);
        res.json(response.data);
    } catch (error) {
        console.error("Camera service error:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get camera status", details: error.response?.data });
    }
});

// Get current frame
router.get("/camera/frame", protect, restrictTo("proctor", "staff"), async (req, res) => {
    try {
        const response = await axios.get(`${CAMERA_SERVICE_URL}/api/monitoring/frame`);
        res.json(response.data);
    } catch (error) {
        console.error("Camera service error:", error.response?.status, error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to get frame", details: error.response?.data });
    }
});

// Get alerts
router.get("/camera/alerts", protect, restrictTo("proctor", "staff"), async (req, res) => {
    try {
        const response = await axios.get(`${CAMERA_SERVICE_URL}/api/monitoring/alerts`);
        res.json(response.data);
    } catch (error) {
        console.error("Camera service error:", error.response?.status, error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get alerts", details: error.response?.data });
    }
});

// Health check for camera service
router.get("/camera/health", async (req, res) => {
    try {
        const response = await axios.get(`${CAMERA_SERVICE_URL}/api/health`);
        res.json(response.data);
    } catch (error) {
        console.error("Camera service error:", error.message);
        res.status(503).json({ error: "Camera service unavailable", status: "offline" });
    }
});

export default router;
