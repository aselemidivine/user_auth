const {Schema, model} = require('mongoose');

const productSchema = Schema({
    price: {
      type: Number,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    secondImageUrl: {
        type: String,
    },
    thirdImageUrl: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true});

module.exports.Product = model('Product', productSchema);

