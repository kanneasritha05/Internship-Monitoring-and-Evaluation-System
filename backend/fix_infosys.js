const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');
const User = require('./models/User');

dotenv.config();

async function fixInfosys() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Find all users (students)
    const reports = await Report.find().populate('student').populate('internship');
    console.log('Total Reports Found:', reports.length);

    let infosysInternships = await Internship.find({ company: { $regex: /infosys/i } });
    console.log('\n--- Infosys Internships ---');
    infosysInternships.forEach(i => {
        console.log(`ID: ${i._id}, Student: ${i.student}, Domain: ${i.domain}`);
    });

    console.log('\n--- Reviewing Candidate Reports ---');
    reports.forEach(r => {
        console.log(`Report ID: ${r._id}`);
        console.log(`Title: ${r.title}, Week: ${r.week}`);
        console.log(`Current Internship: ${r.internship ? r.internship.company : 'null'} (ID: ${r.internship ? r.internship._id : 'null'})`);
        console.log(`Student ID: ${r.student ? r.student._id : 'null'} (${r.student ? r.student.name : 'null'})`);
        console.log('---');
    });

    process.exit();
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

fixInfosys();
