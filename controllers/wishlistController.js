'use strict'

const mongoose = require('mongoose')
const Wishlist = require('../models/wishListMongo')
const jwt = require('jwt-simple')
const axios = require('axios')

const addToWishlist = (req, res) => {
    const newWish = new Wishlist()
    const params = req.body

    try {
        const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""), "mySecretPassword")

        newWish.user = new mongoose.Types.ObjectId(decoded.sub)
        newWish.gameId = params.gameId

        newWish.save().then(
            (savedWish) => {
                res.status(200).send({ wishCreated: savedWish })
            },
            err => {
                res.status(500).send({ message: "Could not add the game to the wishlist." })
            }
        )
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Token missing or invalid.' })
    }
}

const getWishlist = async (req, res) => {
    try {
        const decoded = jwt.decode(req.headers.authorization.replace("Bearer ", ""), "mySecretPassword")
        const wishlist = await Wishlist.find({ user: decoded.sub })


        const minimunDiscount = req.query.min
        const maximumPrice = req.query.max
        const wishlistGames = []

        Promise.all(wishlist.map(async (game) => {
            console.log(game);
            const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${game.gameId}`)

            data.info.gameId = game.gameId
            data.info.id = game._id
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

            if (minimunDiscount && data.info.deal.savings > parseInt(minimunDiscount)) {
                wishlistGames.push(data)
            } else if (maximumPrice && data.info.deal.price < parseInt(maximumPrice)) {
                wishlistGames.push(data)
            } else if (!minimunDiscount && !maximumPrice) {
                wishlistGames.push(data)
            }
        })).then(() => { res.status(200).send({ WishlistGames: wishlistGames }) })
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Token missing or invalid.' })
    }
}

const deleteFromWhislist = (req, res) => {
    const idGameWishlist = req.params._id
    Wishlist.findByIdAndDelete(idGameWishlist).then((deletedGame) => {
        res.status(200).send({ deletedGame: deletedGame })
    }).catch((err) => {
        res.status(500).send({ message: 'Could not delete the game from the wishlist.' })
    })
}

module.exports = { addToWishlist, getWishlist, deleteFromWhislist }