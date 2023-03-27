// IMPORTING LIBRARIES
require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app')



mongoose.connect(process.env.MONGODB_URL_LOCAL, {

})
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("Mongodb connection failed"));

const port = process.env.PORT || 1025

app.listen(port, () => {
    console.log(`server listening on port ${port}!`)
})

