const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================
// STATIC FILES
// ==========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

// ==========================
// HOME ROUTE
// ==========================

app.get("/", (req, res) => {
  res.send("🚀 Lexo Property Backend is Running...");
});

// ==========================
// API ROUTES
// ==========================

// Property Routes
app.use("/api/properties", propertyRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});