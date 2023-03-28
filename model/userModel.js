const {Schema, model} = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = Schema({
    name: {
        type: String,
        // required: true,

    },
    email: {
        type: String,
        
    },
    phone: {
        type: String,
        required: true,
        
    },
    is_verified:{
        type: Boolean,
        required:false,
        default: false
    },
    password: {
        type: String,
        // required: true,
    }
}, { timestamps: true});

userSchema.methods.generateJWT = function() {
    const token = jwt.sign({
        _id: this.id,
        phone: this.phone
    }, process.env.JWT_SECRET_KEY, {expiresIn: "7d" })
}

module.exports.User = model('User', userSchema);

