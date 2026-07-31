const express = require("express");

const router = express.Router();

const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// GET all
router.get("/", getProperties);

// GET one
router.get("/:id", getProperty);

// CREATE
router.post("/", createProperty);

// UPDATE
router.put("/:id", updateProperty);

// DELETE
router.delete("/:id", deleteProperty);

module.exports = router;