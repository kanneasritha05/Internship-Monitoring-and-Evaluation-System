const Internship = require('../models/Internship');
const Student = require('../models/Student');


// ✅ 1. SUBMIT INTERNSHIP
exports.submitInternship = async (req, res) => {
  try {
     console.log("BODY:", req.body);
console.log("FILE:", req.file);
console.log("USER:", req.user);
    const { company, domain, location, duration } = req.body;

    if (!company || !domain || !location || !duration) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await Internship.findOne({ student: req.user._id });

    if (existing && existing.status !== 'rejected') {
      return res.status(400).json({
        message: `Already submitted. Status: ${existing.status}`
      });
    }

    let internship;

    if (existing && existing.status === 'rejected') {
      internship = await Internship.findByIdAndUpdate(
        existing._id,
        {
          company,
          domain,
          location,
          duration,
          status: 'pending',
          adminFeedback: '',
          offerLetter: req.file ? req.file.filename : existing.offerLetter
        },
        { new: true }
      );
    } else {
      internship = await Internship.create({
        student: req.user._id,
        company,
        domain,
        location,
        duration,
        status: 'pending',
        adminFeedback: '',
        offerLetter: req.file ? req.file.filename : null
      });
    }

    res.status(201).json(internship);

  } catch (err) {
    console.log("SUBMIT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 2. GET MY INTERNSHIP
exports.getMyInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({ student: req.user._id })
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    res.json(internship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 3. GET ALL INTERNSHIPS (ADMIN)
exports.getAllInternships = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const internships = await Internship.find(filter)
      .populate('student', 'name email')
      .populate('mentor', 'name email')
      .sort('-createdAt');

    res.json(internships);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 4. APPROVE INTERNSHIP
exports.approveInternship = async (req, res) => {
  try {
    const { mentorId, feedback } = req.body;

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    internship.status = 'approved';
    internship.adminFeedback = feedback || 'Approved successfully';

    if (mentorId) {
      internship.mentor = mentorId;
    }

    await internship.save();

    // sync Student collection
    let student = await Student.findOne({ user: internship.student });

    if (!student) {
      student = await Student.create({
        user: internship.student,
        mentor: internship.mentor,
        internshipDomain: internship.domain,
        college: 'Not Provided',
        status: 'approved',
        enrollmentNumber: Date.now().toString(),
      });
    } else {
      student.mentor = internship.mentor || student.mentor;
      student.internshipDomain = internship.domain;
      student.status = 'approved';
      await student.save();
    }

    res.json(internship);

  } catch (err) {
    console.log("APPROVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 5. REJECT INTERNSHIP
exports.rejectInternship = async (req, res) => {
  try {
    const { feedback } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminFeedback: feedback || 'Rejected by admin'
      },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.json(internship);

  } catch (err) {
    console.log("REJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ 6. OPTIONAL: ALLOT MENTOR
exports.allotMentor = async (req, res) => {
  try {
    const { mentorId } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      { mentor: mentorId },
      { new: true }
    ).populate('mentor', 'name email');

    res.json(internship);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 7. GET APPROVED STUDENTS (FIX FOR YOUR UI)
exports.getApprovedStudents = async (req, res) => {
  try {
    const data = await Internship.find({ status: 'approved' })
      .populate('student', 'name email')
      .populate('mentor', 'name email');

    const formatted = data.map(i => ({
      _id: i._id,
      user: i.student,
      internshipDomain: i.domain,
      mentor: i.mentor,
      status: i.status
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 8. ADMIN ALLOT MENTOR (FOR YOUR FRONTEND)
exports.adminAllotMentor = async (req, res) => {
  try {
    const { studentId, mentorId } = req.body;

    const internship = await Internship.findByIdAndUpdate(
      studentId,
      { mentor: mentorId },
      { new: true }
    )
    .populate('student', 'name email')
    .populate('mentor', 'name email');

    const formatted = {
      _id: internship._id,
      user: internship.student,
      internshipDomain: internship.domain,
      mentor: internship.mentor,
      status: internship.status
    };

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ 9. DELETE STUDENT (FROM INTERNSHIP)
exports.deleteStudentInternship = async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};