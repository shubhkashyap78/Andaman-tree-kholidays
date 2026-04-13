require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('MongoDB URI:', process.env.MONGODB_URI?.substring(0, 30) + '...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('✅ Database is working fine!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', err.message);
    console.log('\n💡 Solutions:');
    console.log('1. Check if MongoDB URI is correct in .env file');
    console.log('2. Check your internet connection');
    console.log('3. Verify MongoDB Atlas cluster is running');
    process.exit(1);
  });
