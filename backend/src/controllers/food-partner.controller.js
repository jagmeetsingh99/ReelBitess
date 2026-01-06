const mongoose = require("mongoose");
const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.js");

async function getFoodPartnerById(req, res) {
  const foodPartnerId = req.params.id;

  // ✅ STEP 1: Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(foodPartnerId)) {
    return res.status(400).json({
      message: "Invalid food partner id",
    });
  }

  // ✅ STEP 2: Fetch partner
  const foodPartner = await foodPartnerModel.findById(foodPartnerId);

  if (!foodPartner) {
    return res.status(404).json({
      message: "Food Partner not found",
    });
  }

  // ✅ STEP 3: Fetch foods
  const foodItems = await foodModel.find({
    foodPartner: foodPartnerId,
  });

  // ✅ STEP 4: Response
  res.status(200).json({
    message: "Food Partner fetched successfully",
    foodPartner: {
      ...foodPartner.toObject(),
      foodItems,
    },
  });
}

module.exports = { getFoodPartnerById };
