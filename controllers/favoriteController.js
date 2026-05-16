// ─────────────────────────────────────────────
//  controllers/favoriteController.js
//  Manages user favorites with polymorphic population
// ─────────────────────────────────────────────

const Favorite = require('../models/Favorite');

// ── GET /api/favorites/my/:userId
const getUserFavorites = async (req, res, next) => {
  try {
    // We get all favorites for the user
    const favorites = await Favorite.find({ user: req.params.userId }).sort({ createdAt: -1 });

    // Populate itemId dynamically based on itemType
    // Since Mongoose 5+, we can do dynamic population in an array of docs using Model.populate()
    // or by specifying the model manually. 
    // Mongoose supports dynamic refs in populate, but since we are handling different collections,
    // we use `populate` on the result.
    
    const populatedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        // Find the corresponding model dynamically based on itemType
        // Beginner-friendly architecture: All items are unified under the Vendor model!
        let Model = require('../models/Vendor');
        
        const item = await Model.findById(fav.itemId);
        // Convert mongoose doc to plain object so we can add the item
        const favObj = fav.toObject();
        favObj.item = item;
        return favObj;
      })
    );

    res.status(200).json({ success: true, count: populatedFavorites.length, data: populatedFavorites });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/favorites
const addFavorite = async (req, res, next) => {
  try {
    const { userId, itemId, itemType } = req.body;
    
    // Check if it already exists
    const existing = await Favorite.findOne({ user: userId, itemId });
    if (existing) {
      res.status(400);
      throw new Error('Item is already in your favorites');
    }

    const favorite = await Favorite.create({ user: userId, itemId, itemType });
    res.status(201).json({ success: true, message: 'Added to favorites', data: favorite });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/favorites/:id
const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) {
      res.status(404);
      throw new Error('Favorite not found');
    }
    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite,
};
