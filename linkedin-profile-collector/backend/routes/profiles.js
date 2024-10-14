// routes/profiles.js
const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// POST /api/profiles
router.post('/', async (req, res) => {
  const { name, url, about, bio, location, followerCount, connectionCount, bioLine } = req.body;

  // Basic validation
  if (!name || !url) {
    return res.status(400).json({ error: 'Name and URL are required.' });
  }

  try {
    // Create or update the profile based on URL uniqueness
    const [profile, created] = await Profile.upsert(
      { name, url, about, bio, location, followerCount, connectionCount, bioLine },
      { where: { url } }
    );

    res.status(created ? 201 : 200).json(profile);
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
