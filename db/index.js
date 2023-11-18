const mongoose = require('mongoose');


const MONGODB_URI = process.env.PORT || 'mongodb://127.0.0.1:27017/cinema-app';

mongoose.connect(MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo.Database name:${x.connections[0].name}`))
    .catch((err) => console.log(`Error while connecting to Mongo: ${err}`));