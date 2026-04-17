const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  submitInternship,
  getMyInternship,
  getAllInternships,
  approveInternship,
  rejectInternship,
  allotMentor
} = require('../controllers/internshipController');

const multer = require('multer');
const path = require('path');

// 📁 FILE UPLOAD SETUP
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// 🔐 PROTECTED ROUTES
router.use(protect);

// ✅ STUDENT
router.post('/', authorize('student'), upload.single('offerLetter'), submitInternship);
router.get('/my', authorize('student'), getMyInternship);

// ✅ ADMIN / MENTOR
router.get('/', authorize('admin', 'mentor'), getAllInternships);

router.put('/:id/approve', authorize('admin'), approveInternship);
router.put('/:id/reject', authorize('admin'), rejectInternship);
router.put('/:id/mentor', authorize('admin'), allotMentor);

module.exports = router;