'use strict'

const axios = require('axios')

axios.get(`https://www.cheapshark.com/api/1.0`)

const cleanerApi = (data) => {
    data.map((game) => {
        delete game.internalName
        delete game.metacriticLink
        delete game.dealID
        delete game.storeID
        delete game.isOnSale
        
        delete game.steamRatingCount
        delete game.releaseDate
        delete game.lastChange
        delete game.dealRating
    })
}

const onSaleGames = async (req, res) => {
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/deals?onSale=1&lowerPrice=0.1&storeID=1&steamRating=70`)
    cleanerApi(data)
    res.status(200).send({ onSaleGames: data })
}
const recentDeals = async (req, res) => {
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/deals?onSale=1&lowerPrice=0.1&sortBy=Recent&storeID=1,4,7,8,11,13,25,31`)
    cleanerApi(data)
    res.status(200).send({ RecentDeals: data })
}
const bestDeals = async (req, res) => {
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/deals?onSale=1&lowerPrice=0.1&storeID=1,4,7,8,11,13,25,31`)
    cleanerApi(data)
    res.status(200).send({ BestDeals: data })
}
const freeGames = async (req, res) => {
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/deals?&upperPrice=0&sortBy=Recent`)
    cleanerApi(data)
    res.status(200).send({ FreeGames: data })
}
const searchGames = async (req, res) => {
    const title = req.params.title
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/games?title=${title}`)

    const gameList = data.filter((game) => {
        return game.steamAppID != null
    })
    gameList.map((game) => {
        delete game.cheapest
        delete game.cheapestDealID
        delete game.internalName
        delete game.steamAppID
    })

    res.status(200).send({ SearchGames: gameList })
}
const individualGame = async (req, res) => {
    const gameId = req.params.gamesId
    const { data } = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${gameId}`)
    const storeList = []

    /* delete data.info.steamAppID */
    data.deals.map((deal) => {
        delete deal.dealID
        switch (deal.storeID) {
            case '1':
                deal.storeID = 'Steam'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/0.png'
                storeList.push(deal)
                break
            case '4':
                deal.storeID = 'Amazon'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/3.png'
                storeList.push(deal)
                break
            case '7':
                deal.storeID = 'GOG'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/6.png'
                storeList.push(deal)
                break
            case '8':
                deal.storeID = 'Origin'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/7.png'
                storeList.push(deal)
                break
            case '11':
                deal.storeID = 'Humble Store'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/10.png'
                storeList.push(deal)
                break
            case '13':
                deal.storeID = 'Uplay'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/12.png'
                storeList.push(deal)
                break
            case '25':
                deal.storeID = 'Epic Games Store'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/24.png'
                storeList.push(deal)
                break
            case '31':
                deal.storeID = 'Blizzard Shop'
                deal.storeImage = 'https://www.cheapshark.com/img/stores/logos/32.png'
                storeList.push(deal)
                break
            default:
                break
        }
    })
    data.deals = storeList

    res.status(200).send({ individualGame: data })
}

module.exports = { onSaleGames, recentDeals, bestDeals, freeGames, searchGames, individualGame }
