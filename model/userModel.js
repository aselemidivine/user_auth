const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

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

// hash the password before saving the user
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    next();
  });
  
  // compare password method
  userSchema.methods.comparePassword = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
  };



// userSchema.methods.generateJWT = function() {
//     const token = jwt.sign({
//         _id: this.id,
//         phone: this.phone
//     }, process.env.JWT_SECRET_KEY, {expiresIn: "7d" })
// }

module.exports.User = model('User', userSchema);

