const Property = require("../models/Property");

// Get all properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch properties",
    });
  }
};

// Get one property
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProperties,
  getProperty,
};