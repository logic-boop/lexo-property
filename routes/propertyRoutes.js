const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// GET all properties
router.get("/", getProperties);

// GET single property
router.get("/:id", getProperty);

// CREATE property
router.post("/", upload.single("image"), createProperty);

// UPDATE property
router.put("/:id", upload.single("image"), updateProperty);

// DELETE property
router.delete("/:id", deleteProperty);

module.exports = router;
