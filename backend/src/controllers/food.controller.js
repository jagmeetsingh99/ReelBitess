const foodModel = require("../models/food");
const likeModel = require("../models/likemodel");
const saveModel = require("../models/savemodel");
const storageService = require("../services/storage.service");

async function createFood(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    // Upload video to Cloudinary (STREAM)
    const uploadResult = await storageService.uploadVideo(req.file.buffer);

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: uploadResult.url,
      thumbnail: uploadResult.thumbnailUrl,
      foodPartner: req.foodPartner._id,
      likeCount: 0,
      savesCount: 0,
    });

    res.status(201).json({
      message: "Food created successfully",
      food: foodItem,
    });

  } catch (error) {
    console.error("Create food error:", error);
    res.status(500).json({
      message: "Failed to create food item",
      error: error.message,
    });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel.find({}).populate("foodPartner");

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });

  } catch (error) {
    console.error("Get food error:", error);
    res.status(500).json({
      message: "Failed to fetch food",
      error: error.message,
    });
  }
}

async function likeFood(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Please login first" });
    }

    const { foodId } = req.body;
    const userId = req.user._id;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID required" });
    }

    const existingLike = await likeModel.findOne({
      user: userId,
      food: foodId,
    });

    if (existingLike) {
      await likeModel.deleteOne({ _id: existingLike._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: -1 } });

      return res.status(200).json({ message: "Unliked successfully" });
    }

    await likeModel.create({ user: userId, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { likeCount: 1 } });

    res.status(201).json({ message: "Liked successfully" });

  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({
      message: "Failed to like",
      error: error.message,
    });
  }
}

async function saveFood(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Please login first" });
    }

    const { foodId } = req.body;
    const userId = req.user._id;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID required" });
    }

    const existingSave = await saveModel.findOne({
      user: userId,
      food: foodId,
    });

    if (existingSave) {
      await saveModel.deleteOne({ _id: existingSave._id });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: -1 } });

      return res.status(200).json({ message: "Unsaved successfully" });
    }

    await saveModel.create({ user: userId, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { savesCount: 1 } });

    res.status(201).json({ message: "Saved successfully" });

  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({
      message: "Failed to save",
      error: error.message,
    });
  }
}

async function getSaveFood(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Please login first" });
    }

    const savedItems = await saveModel
      .find({ user: req.user._id })
      .populate("food");

    res.status(200).json({
      message: "Saved items fetched",
      savedFoods: savedItems,
    });

  } catch (error) {
    console.error("Get saved error:", error);
    res.status(500).json({
      message: "Failed to get saved",
      error: error.message,
    });
  }
}

module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSaveFood,
};
