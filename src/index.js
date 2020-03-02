import app from './app';
import db from './db';
import dotenv from 'dotenv';
dotenv.config();

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, (err) => {
  if (err) console.error(`Index Error: ${err}`);
  
  console.log(`server is running on ${HOST}:${PORT}`);
})
