// controllers/houseController.js

const House = require('../models/House.model');

exports.createHouseListing = async (req, res) => {
  // Destructure the new phoneNumber field from req.body
  const { address, city, bedrooms, rentAmount, description, phoneNumber } = req.body;

  try {
    const newHouse = new House({
      owner: req.user.id,
      address,
      city,
      bedrooms,
      rentAmount,
      description,
      // Add the new phoneNumber to the object being saved
      phoneNumber,
    });
    const house = await newHouse.save();
    res.status(201).json(house);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// No changes needed for searchHouses
exports.searchHouses = async (req, res) => {
  try {
    const query = { isAvailable: true }; 

    if (req.query.city) {
      query.city = new RegExp(req.query.city, 'i');
    }
    if (req.query.bedrooms) {
      query.bedrooms = req.query.bedrooms;
    }
    if (req.query.maxRent) {
      query.rentAmount = { $lte: req.query.maxRent };
    }
    // We don't need to populate the owner here for the cards
    const houses = await House.find(query);
    res.json(houses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};