const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const users = await User.find();
    console.log('Users Count:', users.length);
    users.forEach(u => {
      console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });

    process.exit();
  } catch (err) {
    console.error('DEBUG ERROR:', err);
    process.exit(1);
  }
}

debug();
