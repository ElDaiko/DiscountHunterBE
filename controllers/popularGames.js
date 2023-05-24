'use strict'

const sql = require('../helpers/sqlConnection')
const axios = require('axios')

const connection = sql()

const setPopularGames = (req, res) => {

  const params = req.body

  connection.query(`SELECT * FROM popular_games WHERE gameId = ${params.gameId}`, (err, result) => {

    if (!result[0]) {

      const query = "INSERT INTO popular_games SET gameId=:gameId, follows = 1"

      connection.query(query, params, (err, response) => {
        if (err) {
          res.status(500).send({ message: 'An error ocurred while trying to connect to DB.' })
          return
        }

        const newEntry = { ...params, id: response.insertId, follows: 1 }
        res.status(200).send({ newPopularGame: newEntry })
      })

    } else {

      const updatedFollows = result[0].follows + 1
      const query = `UPDATE popular_games SET follows = ${updatedFollows} WHERE gameId = ${params.gameId}`

      connection.query(query, (err, response) => {
        if (err) {
          res.status(500).send({ message: 'An error ocurred while trying to connect to DB.' })
          return
        }

        const newEntry = { ...params, id: result[0].id, follows: updatedFollows }
        res.status(200).send({ newPopularGame: newEntry })

      })

    }
  })
}

const getPopularGames = async (req, res) => {
  connection.query("SELECT * FROM popular_games", (err, result) => {
    console.log(result)
    const popularGames = []
    Promise.all(result.map(async (game) => {
      const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${game.gameId}`)

      data.info.gameId = game.gameId
      data.info.follows = game.follows
      delete data.info.steamAppID

      var stop = false

      data.deals.map((deal) => {
          delete deal.dealID
          if (stop) return
          switch (deal.storeID) {
              case '1':
                  deal.storeID = 'Steam'
                  data.info.deal = deal
                  stop = true
                  break
              case '4':
                  deal.storeID = 'Amazon'
                  data.info.deal = deal
                  stop = true
                  break
              case '7':
                  deal.storeID = 'GOG'
                  data.info.deal = deal
                  stop = true
                  break
              case '8':
                  deal.storeID = 'Origin'
                  data.info.deal = deal
                  stop = true
                  break
              case '11':
                  deal.storeID = 'Humble Store'
                  data.info.deal = deal
                  stop = true
                  break
              case '13':
                  deal.storeID = 'Uplay'
                  data.info.deal = deal
                  stop = true
                  break
              case '25':
                  deal.storeID = 'Epic Games Store'
                  data.info.deal = deal
                  stop = true
                  break
              case '31':
                  deal.storeID = 'Blizzard Shop'
                  data.info.deal = deal
                  stop = true
                  break
              default:
                  deal.storeID = ''
                  break
          }
      })
      delete data.deals
      popularGames.push(data)
  })).then(() => { res.status(200).send({ popularGames: popularGames }) })
  })
}

const updatePopularGame = async (req, res) => {

  const params = req.body

  connection.query(`SELECT * FROM popular_games WHERE gameId = ${params.gameId}`, (err, result) => {

    if (result[0].follows == 1) {

      const query = "DELETE FROM popular_games WHERE gameId=:gameId"

      connection.query(query, params, (err, response) => {
        if (err) {
          res.status(500).send({ message: 'An error ocurred while trying to connect to DB.' })
          return
        }
        res.status(200).send({ message: 'The game has been removed from Popular Games List.' })
      })
    } else {
      const updatedFollows = result[0].follows - 1
      const query = `UPDATE popular_games SET follows = ${updatedFollows} WHERE gameId = ${params.gameId}`

      connection.query(query, (err, response) => {
        if (err) {
          res.status(500).send({ message: 'An error ocurred while trying to connect to DB.' })
          return
        }
        const newEntry = { ...params, id: result[0].id, follows: updatedFollows }
        res.status(200).send({ newPopularGame: newEntry })
      })
    }
  })
}

module.exports = { getPopularGames, setPopularGames, updatePopularGame }