const mongoose = require('mongoose')

const roundSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    opponent: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      enum: ['win', 'loss'],
      required: true,
    },

    score: {
      type: String,
      required: true,
    },

    deckColors: {
      type: [String],
      default: [],
    },

    deckName: {
      type: String,
      default: '',
    },
  },
  {
    _id: false,
  }
)

const matchSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    matchId: {
      type: String,
      required: true,
      unique: true,
    },

    game: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      enum: ['win', 'loss'],
      required: true,
    },

    score: {
      type: String,
      required: true,
    },

    deckColors: {
      type: [String],
      default: [],
    },

    deckName: {
      type: String,
      required: true,
    },

    achievement: {
      type: String,
      enum: ['winner', 'lucky-draw', null],
      default: null,
    },

    deckImage: {
      type: String,
      default: null,
    },

    rewardImage: {
      type: String,
      default: null,
    },

    rounds: {
      type: [roundSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Match', matchSchema)