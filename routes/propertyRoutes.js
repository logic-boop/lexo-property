const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// PUBLIC
router.get("/", getProperties);
router.get("/:id", getProperty);

// PROTECTED — ADMIN ONLY
router.post("/", protect, upload.single("image"), createProperty);
router.put("/:id", protect, upload.single("image"), updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;