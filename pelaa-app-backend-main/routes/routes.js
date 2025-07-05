
import express from 'express';
import { getAllGrounds, searchGrounds, getNearbyPlace } from '../controllers/place.js';

const router = express.Router();

/**
 * @route   GET /api/grounds
 * @desc    Get all playgrounds/sports places
 * @access  Public
 */
router.get('/grounds', getAllGrounds);

/**
 * @route   GET /api/grounds/search
 * @desc    Search playgrounds with optional filters (name, area, type)
 * @access  Public
 * @params  ?name=basketball&area=downtown&type=court
 */
router.get('/grounds/search', searchGrounds);

/**
 * @route   GET /api/nearby
 * @desc    Get nearby places by user location
 * @access  Public
 * @params  ?lat=40.7128&lng=-74.0060&maxDistance=5000
 */
router.get('/nearby', getNearbyPlace);

export default router;
