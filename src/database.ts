// src/database.ts
import mongoose from 'mongoose';
import { config } from './config.js';

let dbConnection: typeof mongoose | null = null;

async function connectToDatabase() {
    if (dbConnection) {
        return dbConnection;
    }

    try {
        const db = await mongoose.connect(config.mongo_uri, {
            minPoolSize: 5,
            maxPoolSize: 50,
            writeConcern: { w: 'majority' },
        });

        db.connection.on('error', (err) => {
            console.error(`Mongoose connection error: ${err}`);
        });

        db.connection.on('disconnected', () => {
            console.warn('Mongoose connection is disconnected.');
        });

        console.log('Connected to MongoDB');
        dbConnection = db;
        return dbConnection;
    } catch (error) {
        console.warn('Unable to connect to MongoDB. Extensions and commands that require a database connection will be skipped.');
        dbConnection = null;
        return null;
    }
}

export default connectToDatabase;