const {Schema, model} = require('mongoose');

const categorySchema = Schema({
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
}, { timestamps: true});

module.exports.Category = model('Category', categorySchema);
