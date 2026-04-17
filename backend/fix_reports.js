// fix_reports.js
const mongoose = require('mongoose');
const Report = require('./models/Report');
const Internship = require('./models/Internship');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship_system';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to DB!");
    
    // Find all reports
    const reports = await Report.find().populate('internship');
    console.log(`Found ${reports.length} total reports.`);
    
    for (const report of reports) {
      console.log(`Report ID: ${report._id}`);
      console.log(`Report Title: ${report.title}`);
      console.log(`Current Internship: ${report.internship ? report.internship.company : 'null'} (ID: ${report.internship ? report.internship._id : 'null'})`);
      console.log('---');
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
