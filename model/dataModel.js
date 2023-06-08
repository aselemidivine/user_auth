const { Schema, model } = require('mongoose');

const DataSchema = Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  url: {
    type: String,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
}, { timestamps: true});

module.exports.Data  = model('Data', DataSchema);
