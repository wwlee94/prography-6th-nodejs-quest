import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let MONGO_DB_URL = process.env.DB_HOST_URL;

// MongoDB 설정
mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === "test") {
    console.log('NODE_ENV: test');
    MONGO_DB_URL = process.env.TEST_DB_HOST_URL;
}
mongoose.connect(MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('debug', true);

var db = mongoose.connection;
db.once('open', () => { console.log('Successfully connected to MongoDB!'); });
db.on('error', err => { console.log('MongoDB Error: ', err); });

export default db;