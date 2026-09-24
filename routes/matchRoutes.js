const express = require('express')
const Match = require('../models/Match')

const router = express.Router()

// =========================================================
// GET ALL MATCHES
// GET /api/matches
// =========================================================

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({
      date: -1,
      createdAt: -1,
    })

    res.status(200).json(matches)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to get matches',
    })
  }
})

// =========================================================
// CREATE MATCH
// POST /api/matches
// =========================================================

router.post('/', async (req, res) => {
  try {
    console.log('Received match:')
    console.log(req.body)

    const match = new Match(req.body)

    const savedMatch = await match.save()

    res.status(201).json({
      message: 'Match created successfully',
      match: savedMatch,
    })
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Failed to create match',
      error: error.message,
    })
  }
})

module.exports = router