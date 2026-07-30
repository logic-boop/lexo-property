const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Property = require("../models/Property");

connectDB();

const properties = [
  {
    title: "Modern Family House",
    location: "Ibadan, Oyo State",
    price: 85000000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    image: "images/properties/house1.jpg",
    description:
      "A spacious modern family house located in a peaceful neighborhood with excellent road access.",
    featured: true,
  },

  {
    title: "Luxury Duplex",
    location: "Lekki, Lagos",
    price: 185000000,
    type: "Duplex",
    bedrooms: 5,
    bathrooms: 6,
    image: "images/properties/house2.jpg",
    description:
      "A luxury duplex with premium finishing, swimming pool, ample parking space and modern security.",
    featured: true,
  },

  {
    title: "Residential Estate",
    location: "Maitama, Abuja",
    price: 250000000,
    type: "Villa",
    bedrooms: 6,
    bathrooms: 7,
    image: "images/properties/house3.jpg",
    description:
      "An elegant luxury villa located in one of Abuja's most prestigious neighborhoods.",
    featured: true,
  },
];

const importData = async () => {
  try {
    await Property.deleteMany();

    await Property.insertMany(properties);

    console.log("✅ Properties Added Successfully");

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();