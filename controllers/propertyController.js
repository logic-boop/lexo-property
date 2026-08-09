const Property = require("../models/Property");
const fs = require("fs");
const path = require("path");

// ==========================
// GET ALL PROPERTIES
// ==========================

const getProperties = async (req, res) => {
  try {
    const query = {};

    // Featured properties
    if (req.query.featured === "true") {
      query.featured = true;
    }

    // Location search
    if (req.query.location) {
      query.location = {
        $regex: req.query.location,
        $options: "i",
      };
    }

    // Property type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Bedrooms
    if (req.query.bedrooms) {
      query.bedrooms = Number(req.query.bedrooms);
    }

    // Minimum price
    if (req.query.price) {
      query.price = {
        $gte: Number(req.query.price),
      };
    }

    const properties = await Property.find(query).sort({
      createdAt: -1,
    });

    res.json(properties);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// GET SINGLE PROPERTY
// ==========================

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    res.json(property);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// CREATE PROPERTY
// ==========================

const createProperty = async (req, res) => {
  try {
    // Image is required when creating a property
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a property image.",
      });
    }

    const property = await Property.create({
      title: req.body.title,
      price: req.body.price,
      location: req.body.location,
      type: req.body.type,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      description: req.body.description,
      status: req.body.status,
      featured: req.body.featured === "true",
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// UPDATE PROPERTY
// ==========================

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    property.title = req.body.title;
    property.price = req.body.price;
    property.location = req.body.location;
    property.type = req.body.type;
    property.bedrooms = req.body.bedrooms;
    property.bathrooms = req.body.bathrooms;
    property.description = req.body.description;
    property.status = req.body.status;
    property.featured = req.body.featured === "true";

    // Replace image only if a new one was uploaded
    if (req.file) {
      // Delete old image
      if (property.image) {
        const oldImagePath = path.join(__dirname, "..", property.image);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      property.image = `/uploads/${req.file.filename}`;
    }

    await property.save();

    res.json({
      message: "Property updated successfully.",
      property,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// DELETE PROPERTY
// ==========================

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found.",
      });
    }

    // Delete image from uploads folder
    if (property.image) {
      const imagePath = path.join(__dirname, "..", property.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Property deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// EXPORT CONTROLLERS
// ==========================

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
