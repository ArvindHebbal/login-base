var mongoose = require('mongoose'),
    Users = require('../model/users'),
    Q = require('q')
const dbConfig = require('../../config/database.config');
const jwt = require('jsonwebtoken');

const secretkey = dbConfig.secretkey;

/**
 * @function createUsers
 * @param data data for new user
 * @returns newly created user
 */
var createUsers = exports.createUsers = function (data) {
    var deferred = Q.defer();
    console.log('createUsers', data)
    var user = new Users(data);
    user.save(async (err, result) => {
        if (err) {
            deferred.reject(err)
        } else {
            console.log('saved', result);
            deferred.resolve(result);
        }
    })
    return deferred.promise;
}

/**
 * @function updateUser
 * @param user user updated details
 * @returns updated user details
 */
var updateUser = exports.updateUser = function (user) {
    var deferred = Q.defer();
    console.log('updateAnnouncement', announcement)
    Users.findOneAndUpdate({ _id: user._id }, user, { new: true })
        .exec((err, result) => {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        });
    return deferred.promise;
}

/**
 * @function getAnnouncement
 * @returns all the announcements
 */
var getUsers = exports.getUsers = function () {
    var deferred = Q.defer();
    Users.find({})
        .exec((err, result) => {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(result);
            }
        })
    return deferred.promise;
}

/**
 * @function deleteUser
 * @param userId _id of user
 * @description deletes user by _id
 * @returns deletion status 
 */
exports.deleteUser = function (userId) {
    var deferred = Q.defer()
    console.log('\ndelete User By Id\n')
    Users.remove({ _id: userId }, async function (err, result) {
        if (err) {
            deferred.reject(err)
        } else {
            deferred.resolve(result);
        }
    })
    return deferred.promise;
}

exports.login = function (email, password) {
    var deferred = Q.defer();
    Users.findOne({ 'email': email, 'password': password })
        .exec((err, result) => {
            if (err) {
                deferred.reject(err)
            } else {
                jwt.sign(result, secretkey, (err, token) => {
                    console.log('login', token, result)
                    deferred.resolve(token);
                })
            }
        })
    return deferred.promise;
}

var getUserByEmail = function (email) {
    var deferred = Q.defer();
    Users.findOne({ 'email': email })
        .exec((err, result) => {
            if (err) {
                deferred.reject(err)
            } else {
                deferred.resolve(token);
            }
        })
    return deferred.promise;
}

exports.resetemail = async function (email, new_password) {
    var userOfGivenEmail = await getUserByEmail(email);
    userOfGivenEmail['password'] = new_password;
    userOfGivenEmail = await updateUser(userOfGivenEmail);
    return userOfGivenEmail;
}