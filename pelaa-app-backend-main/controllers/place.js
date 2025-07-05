
import Place from '../models/place.js';

/**
 * Get all playgrounds/sports places
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllGrounds = async (req, res) => {
  try {
    const places = await Place.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: places.length,
      data: places
    });
  } catch (error) {
    console.error('Error fetching all grounds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch playgrounds',
      error: error.message
    });
  }
};

/**
 * Search playgrounds with optional filters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const searchGrounds = async (req, res) => {
  try {
    const { name, area, type } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    
    if (area) {
      filter.area = { $regex: area, $options: 'i' }; // Case-insensitive search
    }
    
    if (type) {
      filter.type = { $regex: type, $options: 'i' }; // Case-insensitive search
    }
    
    const places = await Place.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
      filters: { name, area, type }
    });
  } catch (error) {
    console.error('Error searching grounds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search playgrounds',
      error: error.message
    });
  }
};

/**
 * Get nearby places using geospatial queries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getNearbyPlace = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // Default 5km radius
    
    // Validate required parameters
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistanceMeters = parseInt(maxDistance);
    
    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }
    
    // Use MongoDB's $geoNear aggregation for distance-based search
    const places = await Place.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude] // GeoJSON format: [lng, lat]
          },
          distanceField: 'distance',
          maxDistance: maxDistanceMeters,
          spherical: true
        }
      },
      {
        $sort: { distance: 1 } // Sort by closest first
      }
    ]);
    
    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
      center: { latitude, longitude },
      maxDistance: maxDistanceMeters
    });
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby places',
      error: error.message
    });
  }
};
