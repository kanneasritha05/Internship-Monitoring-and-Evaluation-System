const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('../models/Internship');
const User = require('../models/User');

dotenv.config();

async function normalize() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Normalize Internship Statuses
    const internships = await Internship.find();
    console.log(`Checking ${internships.length} internships...`);
    
    for (const i of internships) {
      let updated = false;
      
      // Clean up variations of "In Progress" or "Approved"
      if (i.status === 'In Progress') {
        i.status = 'pending'; // Map "In Progress" to "pending" or keep as "In Progress" if newly supported
        updated = true;
      } else if (i.status === 'Approved') {
        i.status = 'approved';
        updated = true;
      }
      
      if (updated) {
        await i.save();
        console.log(`Updated Internship ${i._id} status to ${i.status}`);
      }
    }

    // Normalize User Roles
    const users = await User.find();
    console.log(`Checking ${users.length} users...`);
    for (const u of users) {
      if (u.role === 'Faculty' || u.role === 'faculty') {
        u.role = 'faculty'; // Standardize to lowercase if not already
        await u.save();
        console.log(`Standardized user ${u.email} role to faculty`);
      }
    }

    console.log('Normalization complete!');
    process.exit();
  } catch (err) {
    console.error('NORMALIZATION ERROR:', err);
    process.exit(1);
  }
}

normalize();
