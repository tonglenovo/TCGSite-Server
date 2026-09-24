const mongoose = require('mongoose')
require('dotenv').config()

const Match = require('../models/Match')

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    const matches = await Match.find({
      playedAt: null,
    })

    console.log(`Found ${matches.length} matches to migrate`)

    for (const match of matches) {
      if (!match.date) {
        console.log(`Skipping ${match.matchId}: no date`)
        continue
      }

      // Existing dates are YYYY-MM-DD.
      // Use midnight Singapore time when old records have no time.
      match.playedAt = new Date(`${match.date}T00:00:00+08:00`)

      await match.save()

      console.log(
        `Updated ${match.matchId}: ${match.date} -> ${match.playedAt}`
      )
    }

    console.log('Migration complete')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  }
}

migrate()