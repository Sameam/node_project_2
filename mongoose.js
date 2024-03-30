const mongoose = require('mongoose')
require('dotenv').config();

const connectToMongo = async() => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri)
    console.log("Connect to MongoDB successfully"); 
  }
  catch(error) {
    console.log(`Error connecting to MongoDB: ${error}`)
  }
}


module.exports = connectToMongo; 
