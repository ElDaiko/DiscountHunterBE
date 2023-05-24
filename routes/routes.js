'use strict'

const popularGamesController = require('../controllers/popularGames')
const usersController = require('../controllers/usersController')
const wishlistController = require('../controllers/wishlistController')
const cheapSharkController = require('../controllers/cheapSharkApiController')
const token = require('../helpers/token')

const express = require('express') 
const app = express.Router()

//Popular Games Controller
app.get('/getPopularGames', popularGamesController.getPopularGames)
app.post('/setPopularGames', popularGamesController.setPopularGames)
app.post('/updatePopularGames', popularGamesController.updatePopularGame)

//Users Controller
app.post('/registerUser', usersController.registerUser)
app.post('/signInUser', usersController.signInUser)
app.get('/test', token.validateUserToken, usersController.test)

//Wishlist Controller
app.post('/addToWishlist', token.validateUserToken, wishlistController.addToWishlist)
app.get('/getWishlist', token.validateUserToken, wishlistController.getWishlist)
app.delete('/deleteWishlist/:_id', token.validateUserToken, wishlistController.deleteFromWhislist)

//CheapSharp API Controller
app.get('/getOnSaleGames', cheapSharkController.onSaleGames)
app.get('/getRecentDeals', cheapSharkController.recentDeals)
app.get('/getBestDeals', cheapSharkController.bestDeals)
app.get('/getFreeGames', cheapSharkController.freeGames)
app.get('/getSearchGames/:title', cheapSharkController.searchGames)
app.get('/getIndividualGames/:gamesId', cheapSharkController.individualGame)

module.exports = app