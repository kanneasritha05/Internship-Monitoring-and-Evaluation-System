const Report = require('../models/Report')
const Internship = require('../models/Internship')
const Student = require('../models/Student')

// ✅ CREATE REPORT
exports.createReport = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.body.internship,
      student: req.user._id,
      status: 'approved'
    });

    if (!internship) {
      return res.status(403).json({ message: 'You need an approved internship for the selected id' });
    }

    const report = await Report.create({
      ...req.body,
      student: req.user._id,
      internship: internship._id,
      documentFile: req.file ? req.file.filename : null,
    })

    res.status(201).json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ STUDENT REPORTS
exports.getReports = async (req, res) => {
  try {
    const { internshipId } = req.query;
    const filter = { student: req.user._id };
    if (internshipId) filter.internship = internshipId;

    const reports = await Report.find(filter)
      .populate('student', 'name email')
      .populate('internship')
      .sort('-createdAt')

    res.json(reports)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ✅ MENTOR REPORTS (VERY IMPORTANT)
// ✅ MENTOR REPORTS (RETRIEVE ALL OR FILTER BY STUDENT)
exports.getMentorReports = async (req, res) => {
  try {
    const { studentId, internshipId } = req.query;
    
    // Ensure the mentor is assigned to the requested student (if studentId provided)
    if (studentId) {
      const studentProfile = await Student.findOne({ user: studentId, mentor: req.user._id });
      if (!studentProfile) return res.status(403).json({ message: 'Student not assigned to you' });
      
      const filter = { student: studentId };
      if (internshipId) filter.internship = internshipId;

      const reports = await Report.find(filter)
        .populate('student', 'name email')
        .populate('internship')
        .sort('-createdAt');
      return res.json(reports);
    }

    // Default: Get all reports for all assigned students
    const students = await Student.find({ mentor: req.user._id });
    const assignedIds = students.map(s => s.user);

    const filter = { student: { $in: assignedIds } };
    if (internshipId) filter.internship = internshipId;

    const reports = await Report.find(filter)
      .populate('student', 'name email')
      .populate('internship')
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