const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Internship = require('./models/Internship');
const Report = require('./models/Report');

dotenv.config();

async function migrateReports() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database. Searching for Infosys internship...');

    // 1. Find the Infosys internship
    const infosys = await Internship.findOne({ company: { $regex: /infosys/i } });
    
    if (!infosys) {
      console.log('Could not find an internship with the company name "Infosys".');
      process.exit();
    }

    console.log(`Found Infosys Internship ID: ${infosys._id} for Student: ${infosys.student}`);

    // 2. Find the 2 most recently submitted reports by this student that are NOT assigned to Infosys currently
    const reports = await Report.find({ 
        student: infosys.student, 
        internship: { $ne: infosys._id } 
    }).sort('-createdAt').limit(2);

    if (reports.length === 0) {
        console.log("No mismatched reports found. They might have already been moved!");
        process.exit();
    }

    console.log(`Found ${reports.length} report(s) incorrectly assigned to the first internship.`);

    // 3. Move them to Infosys!
    for (const report of reports) {
        const oldInternshipId = report.internship;
        report.internship = infosys._id;
        await report.save();
        console.log(`✅ Successfully moved report "${report.title}" from ${oldInternshipId} to Infosys!`);
    }

    console.log('Migration complete. You can safely close this terminal and check your dashboard!');
    process.exit();
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

migrateReports();
