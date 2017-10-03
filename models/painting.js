const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paintingSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  },{
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
});

paintingSchema.methods.asData = function() {
  return {
    id: this._id,
    code: this.code,
    ownerId: this.ownerId
  };
};

const Painting = mongoose.model('Painting', paintingSchema);

module.exports = {
  Painting
};
