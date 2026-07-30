const express = require("express");
const router = express.Router();

const {
  getProperties,
  getProperty,
} = require("../controllers/propertyController");

// GET all properties
router.get("/", getProperties);

// GET single property
router.get("/:id", getProperty);

module.exports = router;