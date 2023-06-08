// IMPORTING LIBRARIES
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const userRouter = require('./Routers/userRouter');
const feedRouter = require('./Routers/feedRouter');
require('dotenv/config');

const app = express();
//connect mongoose to mongodb
mongoose.connect(process.env.MONGODB_URL_LOCAL, {

})
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log("Mongodb connection failed"));

app.use(cors())
app.use(express.json());
app.use('/api', userRouter);
app.use('/user', feedRouter);

module.exports = app;
