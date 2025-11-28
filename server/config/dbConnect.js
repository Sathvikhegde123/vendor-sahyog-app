import mongoose from "mongoose";

async function connectDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        throw err;
    }
}

// Connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', mongoose.connection.host);
});
mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected');
});


process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;