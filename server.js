const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userSchema = require('./models/userSchema');

const register = require('./endpoints/register');
const signIn = require('./endpoints/signIn');
const {handleAPICall, increaseEntries} = require("./endpoints/image");

const PORT = process.env.PORT || 8081;
const api = express();

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ulokc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const collectionName = `${process.env.COLLECTION_NAME}`

// Connecting to db
mongoose.connect(dbUrl)
  .then(() => console.log("Connected to DB.."))
  .catch(() => console.log("Error in DB connection.."))

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

const usersConnection = mongoose.model(collectionName, userSchema);

// Allow CORS
api.use(cors());

// Using middleware, for parsing body
api.use(express.json());

api.get('/', ((req, res) => {
  res.status(400).send("Not allowed.")
}))

api.post('/api/v1/register', (req, res) => {
  register(req, res, usersConnection);
})

api.post('/api/v1/signIn', (req, res) => {
  signIn(req, res, usersConnection);
})

api.post('/api/v1/imageURL', ((req, res) => {
  handleAPICall(req, res);
}))

api.put('/api/v1/increaseEntries', (req, res) => {
  increaseEntries(req, res, usersConnection);
})

api.listen(PORT, () => console.log(`Server is running at ${PORT}...`));
