const {Schema, model} = require('mongoose');


module.exports.Otp = model('Otp', Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    phone: {
        type: String,
        // required: true
    },
    email: {
        type: String,    
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: 300 }
    }
// Expires after 5 minutes and deleted automatically from the database
}, { timestamps: true }))
