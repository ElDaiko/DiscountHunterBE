'use strict'

const mysql = require('mysql2')

const createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'discounthuntersql',
        namedPlaceholders: true
    })
}
module.exports = createConnection