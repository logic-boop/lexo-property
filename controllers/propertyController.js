const Property = require("../models/Property");
const fs = require("fs");
const path = require("path");

// ==========================
// GET ALL
// ==========================

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// GET ONE
// ==========================

const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// CREATE
// ==========================

const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      title: req.body.title,
      price: req.body.price,
      location: req.body.location,
      type: req.body.type,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      description: req.body.description,
      status: req.body.status,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(property);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// UPDATE
// ==========================

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
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

    // Update image only if a new one is uploaded
    if (req.file) {
      // Delete old image
      if (property.image) {
        const oldImage = path.join(__dirname, "..", property.image);

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      // Save new image
      property.image = `/uploads/${req.file.filename}`;
    }

    await property.save();

    res.json(property);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// DELETE
// ==========================

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
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

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
};
