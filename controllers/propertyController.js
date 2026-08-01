const Property = require("../models/Property");

// GET all properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET single property
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

// CREATE PROPERTY
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

      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE property
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE property
const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Property deleted successfully",
    });
  } catch (error) {
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
