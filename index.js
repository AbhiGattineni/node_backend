const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const winstonMongoDB = require('winston-mongodb');

const status = require('./routes/status');
const question = require('./routes/question');

require("dotenv").config();   //dotenv configured


const app = express();

const logger = winston.createLogger({
    transports: [
        new winston.transports.MongoDB({
            db: process.env.MONGO_ATLAS_URL, // Your MongoDB connection URL
            level: 'silly', // Set the log level as needed
        }),
    ],
});

// Example log statement
logger.info('This is an example log message.');


mongoose.connect(process.env.MONGO_ATLAS_URL).then(() => console.log("connected")).catch((e) => console.log("issue", e)) // Add your connection string here

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000' // Only allow requests from this origin
}));


process.on('uncaughtException', (ex) => {
    console.error('An uncaught exception occurred:', ex);
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    console.error('An unhandled rejection occurred:', ex);
    process.exit(1);
});

app.use('/api/status', status);
app.use('/api/questions', question);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));