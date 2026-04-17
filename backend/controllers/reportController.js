const Report = require('../models/Report')
const Internship = require('../models/Internship')
const Student = require('../models/Student')

// ✅ CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const internship = await Internship.findOne({ student: req.user._id });
    if (!internship || internship.status !== 'approved') {
      return res.status(400).json({
        message: "Internship not approved yet"});
}

    if (!internship) {
      return res.status(403).json({ message: 'You need approved internship' })
    }
    console.log("MENTOR ID:", internship.mentor);
    const report = await Report.create({
      student: req.user._id,
      mentor: Internship.mentor, 
      week: req.body.week,
      title: req.body.title,
      summary: req.body.summary,
      link: req.body.link,
      file: req.file ? req.file.filename : null,
    })

    res.status(201).json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ STUDENT REPORTS
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ student: req.user._id })
      .populate('student', 'name email')
      .sort('-createdAt')

    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getMentorReports = async (req, res) => {
  try {
    const reports = await Report.find({
      mentor: req.user._id   // ✅ ONLY THIS
    })
      .populate('student', 'name email')
      .sort('-createdAt');

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ EVALUATE REPORT
exports.evaluateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        feedback: req.body.feedback,
        score: req.body.score,
        status: 'evaluated',
        evaluatedBy: req.user._id
      },
      { new: true }
    ).populate('student', 'name email')

    if (!report) return res.status(404).json({ message: 'Report not found' })

    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}