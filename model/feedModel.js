const { Schema, model } = require('mongoose');

const feedSchema = Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
}, { timestamps: true});

module.exports.Feed  = model('Feed', feedSchema);
