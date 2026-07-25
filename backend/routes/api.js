const express = require('express');
const router = express.Router();

const { login, faceLogin, registerStudentFace, registerTeacherFace, changeAdminPassword, deleteAdminAccount } = require('../controllers/authController');
const { getStudents, createStudent, updateStudent, deleteStudent, updateOwnProfile, getOwnProfile, changeOwnPassword, deleteOwnAccount } = require('../controllers/studentController');
const { getTeachers, createTeacher, updateTeacher, deleteTeacher, getOwnTeacherProfile, updateOwnTeacherProfile, changeOwnTeacherPassword, deleteOwnTeacherAccount } = require('../controllers/teacherController');
const { getSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { recordAttendance, getAttendance } = require('../controllers/attendanceController');
const { getMonthlyReport, getOverallReport } = require('../controllers/reportController');
const { requireAuth, checkRole } = require('../middleware/auth');

// Auth routes
router.post('/auth/login', login); // Admin standard password login
router.post('/auth/face-login', faceLogin);
router.post('/auth/register-student-face', registerStudentFace);
router.post('/auth/register-teacher-face', registerTeacherFace);

// Student self-service routes
router.get('/students/profile/me', requireAuth, checkRole(['student']), getOwnProfile);
router.put('/students/profile/update', requireAuth, checkRole(['student']), updateOwnProfile);
router.put('/students/profile/change-password', requireAuth, checkRole(['student']), changeOwnPassword);
router.delete('/students/profile/delete', requireAuth, checkRole(['student']), deleteOwnAccount);

// Teacher self-service routes
router.get('/teachers/profile/me', requireAuth, checkRole(['teacher']), getOwnTeacherProfile);
router.put('/teachers/profile/update', requireAuth, checkRole(['teacher']), updateOwnTeacherProfile);
router.put('/teachers/profile/change-password', requireAuth, checkRole(['teacher']), changeOwnTeacherPassword);
router.delete('/teachers/profile/delete', requireAuth, checkRole(['teacher']), deleteOwnTeacherAccount);

// Admin self-service routes
router.put('/admins/profile/change-password', requireAuth, checkRole(['admin']), changeAdminPassword);
router.delete('/admins/profile/delete', requireAuth, checkRole(['admin']), deleteAdminAccount);

// Student CRUD (Admin/Teacher viewable, Admin editable)
router.get('/students', requireAuth, getStudents);
router.post('/students', requireAuth, checkRole(['admin']), createStudent);
router.put('/students/:id', requireAuth, checkRole(['admin']), updateStudent);
router.delete('/students/:id', requireAuth, checkRole(['admin']), deleteStudent);

// Teacher CRUD (Admin managed)
router.get('/teachers', requireAuth, getTeachers);
router.post('/teachers', requireAuth, checkRole(['admin']), createTeacher);
router.put('/teachers/:id', requireAuth, checkRole(['admin']), updateTeacher);
router.delete('/teachers/:id', requireAuth, checkRole(['admin']), deleteTeacher);

// Subject CRUD (Admin managed, or queryable by others)
router.get('/subjects', requireAuth, getSubjects);
router.post('/subjects', requireAuth, checkRole(['admin']), createSubject);
router.put('/subjects/:id', requireAuth, checkRole(['admin', 'teacher', 'student']), updateSubject);
router.delete('/subjects/:id', requireAuth, checkRole(['admin']), deleteSubject);

// Attendance routes
router.post('/attendance', requireAuth, checkRole(['teacher', 'admin']), recordAttendance);
router.get('/attendance', requireAuth, getAttendance);

// Reports routes
router.get('/reports/monthly', requireAuth, getMonthlyReport);
router.get('/reports/overall', requireAuth, getOverallReport);

module.exports = router;
