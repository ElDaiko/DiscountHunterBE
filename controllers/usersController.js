'use strict'

const Users = require('../models/usersMongo');
const token = require('../helpers/token');
const bcrypt = require('bcryptjs')

const test = (req, resp) => {
    resp.status(200).send({message: "User is Logged in"});
}

function registerUser(req, resp){
    const newUser = new Users()
    const params = req.body

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(params.password, salt)

    newUser.username = params.username
    newUser.email = params.email
    newUser.password = hash

    newUser.save().then(
        (savedUser) => {
            resp.status(200).send({userCreated: savedUser})
        },
        err => {
            resp.status(500).send({message: "Could not create the User"})
        }
    )
}

function signInUser(req, resp){
    const params = req.body

    const sentEmail = params.email
    const sentPassword = params.password

    Users.findOne({email:sentEmail}).then(
        (foundUser) => {
            if(foundUser == null){
                resp.status(403).send({message: "User doesnt exist."})
            }
            else{
                if(bcrypt.compareSync(sentPassword, foundUser.password)){
                    resp.status(200).send({message: "User Authenticated.", token: token.getUserToken(foundUser) })
                }
                else{
                    resp.status(403).send({message: "Invalid Password."})
                }
            }
        },
        err => {
            resp.status(500).send({message: "Could not found User."})
        }
    )
}

module.exports={
    test, registerUser, signInUser
}
