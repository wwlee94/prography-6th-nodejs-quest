import db from './db'; // 먼저 호출 되어야함
import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, () => {
    console.log(`server is running on ${HOST}:${PORT}`);
})
