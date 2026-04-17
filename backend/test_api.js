const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const User = require('./models/User');

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Simulate getAllInternships logic
    console.log('Testing Internship Population...');
    const internships = await Internship.find()
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort('-createdAt');
    
    console.log('Fetched', internships.length, 'internships successfully');
    
    // Simulate getMentors logic
    console.log('Testing Mentor Fetch...');
    const mentors = await User.find({ role: 'mentor' }).select('name email role');
    console.log('Fetched', mentors.length, 'mentors successfully');

    process.exit();
  } catch (err) {
    console.error('TEST FAILED:', err);
    process.exit(1);
  }
}

test();
