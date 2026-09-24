const express = require('express')
const Match = require('../models/Match')

const router = express.Router()

// =========================================================
// GET ALL MATCHES
// GET /api/matches
// =========================================================

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({
        playedAt: -1,
        id: -1,
      })

    res.status(200).json(matches)
  } catch (error) {
    console.error(
      'Error fetching matches:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch matches',
    })
  }
})

// =========================================================
// CREATE MATCH
// POST /api/matches
// =========================================================

router.post('/', async (req, res) => {
  try {
    console.log(
      'Received match:',
      req.body
    )

    const {
      game,
      date,
      time,
      playedAt,
      location,
      eventType,
      result,
      score,
      deckColors,
      deckName,
      achievement,
      rounds,
    } = req.body

    // =====================================================
    // VALIDATION
    // =====================================================

    const missingFields = []

    if (!game) {
      missingFields.push('game')
    }

    if (!date) {
      missingFields.push('date')
    }

    if (!time) {
      missingFields.push('time')
    }

    if (!playedAt) {
      missingFields.push('playedAt')
    }

    if (!location) {
      missingFields.push('location')
    }

    if (!eventType) {
      missingFields.push('eventType')
    }

    if (!result) {
      missingFields.push('result')
    }

    if (!score) {
      missingFields.push('score')
    }

    if (!deckName) {
      missingFields.push('deckName')
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message:
          `Missing fields: ${missingFields.join(', ')}`,
      })
    }

    // =====================================================
    // DECK COLOUR VALIDATION
    // =====================================================

    if (
      !Array.isArray(deckColors) ||
      deckColors.length === 0
    ) {
      return res.status(400).json({
        message:
          'Please select at least one deck colour.',
      })
    }

    // =====================================================
    // ROUND VALIDATION
    // =====================================================

    if (
      !Array.isArray(rounds) ||
      rounds.length === 0
    ) {
      return res.status(400).json({
        message:
          'Please add at least one round.',
      })
    }

    // =====================================================
    // PLAYED DATE
    // =====================================================

    const parsedPlayedAt =
      new Date(playedAt)

    if (
      Number.isNaN(
        parsedPlayedAt.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid match date or time.',
      })
    }

    // =====================================================
    // GENERATE ID
    // =====================================================

    const latestMatch =
      await Match.findOne()
        .sort({
          id: -1,
        })
        .select('id')

    const nextId =
      latestMatch
        ? latestMatch.id + 1
        : 1

    console.log(
      'Generated ID:',
      nextId
    )

    // =====================================================
    // GENERATE MATCH ID
    //
    // Example:
    // MAT-20260918-001
    // =====================================================

    const dateForId =
      date.replaceAll('-', '')

    const matchesOnDate =
      await Match.countDocuments({
        matchId: {
          $regex:
            `^MAT-${dateForId}-`,
        },
      })

    const sequence =
      String(
        matchesOnDate + 1
      ).padStart(
        3,
        '0'
      )

    const matchId =
      `MAT-${dateForId}-${sequence}`

    console.log(
      'Generated Match ID:',
      matchId
    )

    // =====================================================
    // CREATE DOCUMENT
    // =====================================================

    const newMatch =
      new Match({
        id: nextId,

        matchId: matchId,

        game: game,

        date: date,

        playedAt: parsedPlayedAt,

        location: location,

        eventType: eventType,

        result: result,

        score: score,

        deckColors: deckColors,

        deckName: deckName,

        achievement:
          achievement ?? null,

        deckImage: null,

        rewardImage: null,

        rounds: rounds,
      })

    // =====================================================
    // DEBUG
    // =====================================================

    console.log(
      'Match before save:',
      newMatch.toObject()
    )

    // =====================================================
    // SAVE
    // =====================================================

    const savedMatch =
      await newMatch.save()

    console.log(
      'Match saved successfully:',
      savedMatch.matchId
    )

    res
      .status(201)
      .json(savedMatch)

  } catch (error) {
    console.error(
      'Error creating match:',
      error
    )

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create match',
    })
  }
})

// =========================================================
// UPDATE MATCH
// PATCH /api/matches/:id
// =========================================================

router.patch('/:id', async (req, res) => {
  try {
    const matchId = Number(req.params.id)

    if (Number.isNaN(matchId)) {
      return res.status(400).json({
        message: 'Invalid match ID',
      })
    }

    const existingMatch =
      await Match.findOne({
        id: matchId,
      })

    if (!existingMatch) {
      return res.status(404).json({
        message: 'Match not found',
      })
    }

    const {
      game,
      date,
      time,
      playedAt,
      location,
      eventType,
      result,
      score,
      deckColors,
      deckName,
      achievement,
      rounds,
    } = req.body

    // ===============================================
    // VALIDATION
    // ===============================================

    if (
      !game ||
      !date ||
      !time ||
      !playedAt ||
      !location ||
      !eventType ||
      !result ||
      !score ||
      !deckName
    ) {
      return res.status(400).json({
        message: 'Missing required fields',
      })
    }

    if (
      !Array.isArray(deckColors) ||
      deckColors.length === 0
    ) {
      return res.status(400).json({
        message:
          'Please select at least one deck colour.',
      })
    }

    if (
      !Array.isArray(rounds) ||
      rounds.length === 0
    ) {
      return res.status(400).json({
        message:
          'Please add at least one round.',
      })
    }

    const parsedPlayedAt =
      new Date(playedAt)

    if (
      Number.isNaN(
        parsedPlayedAt.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid match date or time.',
      })
    }

    // ===============================================
    // UPDATE
    // ===============================================

    existingMatch.game = game
    existingMatch.date = date
    existingMatch.playedAt =
      parsedPlayedAt

    existingMatch.location =
      location

    existingMatch.eventType =
      eventType

    existingMatch.result =
      result

    existingMatch.score =
      score

    existingMatch.deckColors =
      deckColors

    existingMatch.deckName =
      deckName

    existingMatch.achievement =
      achievement ?? null

    existingMatch.rounds =
      rounds

    const updatedMatch =
      await existingMatch.save()

    console.log(
      'Match updated:',
      updatedMatch.matchId
    )

    res
      .status(200)
      .json(updatedMatch)

  } catch (error) {
    console.error(
      'Error updating match:',
      error
    )

    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update match',
    })
  }
})

module.exports = router