'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

users = new Schema({
  name: { type: String },
  email: {type: String},
  password: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('users', users);