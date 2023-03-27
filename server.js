// IMPORTING LIBRARIES
require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app')

// mongoose.connect("mongodb+srv://PamiciousShopApi:pamicious@cluster0.gwdmzoy.mongodb.net/PamiciousApi?retryWrites=true&w=majority" )
mongoose.connect("mongodb+srv://mern_auth:mern_auth@cluster0.gwdmzoy.mongodb.net/?retryWrites=true&w=majority")


// mongoose.connect(process.env.MONGODB_URL_LOCAL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
// })
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("Mongodb connection failed"));

const port = process.env.PORT || 1025

app.listen(port, () => {
    console.log(`server listening on port ${port}!`)
})

