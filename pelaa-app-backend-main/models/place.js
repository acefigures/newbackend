
import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  emoji: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create 2dsphere index for geospatial queries
placeSchema.index({ location: '2dsphere' });

const Place = mongoose.model('Place', placeSchema);

export default Place;
