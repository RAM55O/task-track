const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tasktrack';

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('✅ Successfully connected to MongoDB database');
  } catch (err) {
    console.warn('⚠️  Could not connect to external MongoDB server (Reason:', err.message, ')');
    console.warn('ℹ️  Operating in zero-setup Local Storage fallback mode.');
    isConnected = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
