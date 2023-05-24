'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const sql = require('./helpers/sqlConnection')

const connection = sql()

mongoose.connect('mongodb://127.0.0.1:27017/DiscountHunterDB')
    .then(
        () => {
             connection.connect( (err) => {
                if (err) {
                    console.log(err)
                    return
                }
             })
        })
    .then(
        () => {
            console.log("Succesful connection with DB.")
            app.listen(8698, function () {
                console.log("Server has been Initilized.")
            })
        })
    .catch((err) => {
        console.log("Failed to connect to DB.")
        console.log(err)
    })