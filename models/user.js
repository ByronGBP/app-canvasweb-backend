const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
  },{
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
});


UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.asData = function() {
  return {
    id: this._id,
    username: this.username,
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
