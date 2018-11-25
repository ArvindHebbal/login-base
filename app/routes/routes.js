'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const Users = require('../controller/users');
const app = express();
const jwt = require('jsonwebtoken');
const dbConfig = require('../../config/database.config');
const secretkey = dbConfig.secretkey;

module.exports = (app) => {

    //Fetch all users
    app.route('/users')
        .get(verifyToken, (req, res) => {
            jwt.verify(req.token, secretkey, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    Users.getUsers()
                        .then(function (result) {
                            res.send(result)
                        })
                }
            })
        })

    //Create new users
    //accepts user data in body
    app.route('/users')
        .post(function (req, res) {
            Users.createUsers(req.body)
                .then(function (result) {
                    res.send(result)
                })
        })

    //updateusers
    //accepts updated user data in body
    app.route('/users')
        .put(function (req, res) {
            jwt.verify(req.token, secretkey, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    Users.updateUser(req.body)
                        .then(function (result) {
                            res.send(result)
                        })
                }
            })
        })

    //delete users by user _id
    //accepts user _id as param
    app.route('/users/:userId')
        .delete(function (req, res) {
            jwt.verify(req.token, secretkey, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    Users.deleteUser(req.params.userId)
                        .then(function (result) {
                            res.send(result)
                        })
                }
            })
        })

    //Get login token
    app.route('/login')
        .get(function (req, res) {
            Users.login(req.params.email, req.params.password)
                .then(function (result) {
                    res.send(result)
                })
        })

    //Change password for given api
    //accepts mail and new password as params
    app.route('/resetpassword')
        .get(function (req, res) {
            jwt.verify(req.token, secretkey, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    Users.resetemail(req.params.email, req.params.newpassword)
                        .then(function (result) {
                            res.send(result)
                        })
                }
            })
        })

    // Verify Token
    function verifyToken(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            req.token = bearerHeader;
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }

    }
}