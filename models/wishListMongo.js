'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const wishlistSchema = Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    gameId: Number
})

module.exports = mongoose.model('wishlists', wishlistSchema)