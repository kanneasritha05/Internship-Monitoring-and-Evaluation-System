const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./backend/models/Internship');
const User = require('./backend/models/User');

dotenv.config({ path: './backend/.env' });

async function debug() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const internships = await Internship.find().populate('student').populate('mentor');
  console.log('Internships Count:', internships.length);
  internships.forEach(i => {
    console.log(`ID: ${i._id}, Status: ${i.status}, Student: ${i.student?.name || 'NOT FOUND'}, Mentor: ${i.mentor?.name || 'NONE'}`);
  });

  const mentors = await User.find({ role: 'mentor' });
  console.log('Mentors Count:', mentors.length);

  process.exit();
}

debug().catch(err => {
  console.error(err);
  process.exit(1);
});
