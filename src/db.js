import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_DB_URL = process.env.DB_HOST_URL;

// MongoDB 설정
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('debug', true);

var db = mongoose.connection;
db.once('open', function () { console.log('Successfully connected to MongoDB!'); });
db.on('error', function (err) { console.log('MongoDB Error: ', err); });