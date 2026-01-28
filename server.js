const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose"); 
const aiRoutes = require("./src/routes/ai");
const requestLogger = require("./src/middleware/requestLogger");
const aiPdfAutoConvert = require("./src/routes/aipdfAutoConvert");
const fileToPdfRoutes = require("./src/routes/fileToPdf");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(requestLogger);

// -------- STATIC FILE PREVIEW ROUTES --------
app.use("/ppt", express.static(path.join(__dirname, "uploads/ppt")));
app.use("/docx", express.static(path.join(__dirname, "uploads/docx")));
app.use("/xlsx", express.static(path.join(__dirname, "uploads/xlsx")));
app.use("/pdf-preview", express.static(path.join(__dirname, "uploads/pdf")));

// -------- ROOT ROUTE (health check) --------
app.get("/", (req, res) => {
  res.status(200).send("🚀 File Operations API is live!");
});

// -------- DATABASE CONNECT (SAFE) --------
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("⚠️ MONGO_URI not set — skipping DB connection");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection failed:", err.message);
  }
};

connectDB();

// -------- API ROUTES --------
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiPdfAutoConvert);
app.use("/api/convert", fileToPdfRoutes);

// -------- STATIC PUBLIC FILES --------
app.use(express.static(path.join(__dirname, "public")));

// -------- START SERVER --------
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});
