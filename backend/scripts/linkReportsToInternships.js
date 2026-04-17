const mongoose = require('mongoose');
const Report = require('../models/Report');
const Internship = require('../models/Internship');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:2017/internship-monitoring');
    console.log('Connected to DB');

    const reports = await Report.find({ internship: { $exists: false } });
    console.log(`Found ${reports.length} reports to migrate`);

    for (const report of reports) {
      const internship = await Internship.findOne({
        student: report.student,
        status: 'approved'
      });

      if (internship) {
        report.internship = internship._id;
        await report.save();
        console.log(`Linked report ${report._id} to internship ${internship._id}`);
      } else {
        console.log(`No approved internship found for student ${report.student} (Report: ${report._id})`);
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
