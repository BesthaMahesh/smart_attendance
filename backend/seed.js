const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Subject = require('./models/Subject');
const Attendance = require('./models/Attendance');

// Helper to generate mock 128-dimensional face embedding
const generateMockEmbedding = () => {
  return Array.from({ length: 128 }, () => Math.random() - 0.5);
};

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared.');

    // 1. Create Admin
    console.log('Creating Admin...');
    const adminUser = new User({
      email: 'maheshbabu02456@gmail.com',
      password: '1234567',
      role: 'admin',
      name: 'System Admin'
    });
    await adminUser.save();
    console.log('Admin created.');

    // 2. Create Teachers
    console.log('Creating Teachers...');
    const teachersData = [
      { name: 'Dr. Sarah Connor', email: 'sarah.connor@institution.edu', employeeId: 'EMP-001', department: 'Computer Science', subject: 'Artificial Intelligence', faceEmbedding: generateMockEmbedding() },
      { name: 'Prof. Charles Xavier', email: 'charles.xavier@institution.edu', employeeId: 'EMP-002', department: 'Neuroscience', subject: 'Computational Neuroscience', faceEmbedding: generateMockEmbedding() },
      { name: 'Dr. Alan Turing', email: 'alan.turing@institution.edu', employeeId: 'EMP-003', department: 'Computer Science', subject: 'Theory of Computation', faceEmbedding: generateMockEmbedding() }
    ];

    const teachers = [];
    for (const t of teachersData) {
      const teacher = new Teacher(t);
      await teacher.save();
      
      const teacherUser = new User({
        email: t.email,
        password: Math.random().toString(36),
        role: 'teacher',
        name: t.name,
        teacherRef: teacher._id
      });
      await teacherUser.save();
      teachers.push(teacher);
    }
    console.log('Teachers created.');

    // 3. Create Students
    console.log('Creating Students...');
    const studentsData = [
      { name: 'Peter Parker', email: 'peter.parker@student.edu', rollNumber: 'CS-2101', department: 'Computer Science', year: '3rd Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Tony Stark', email: 'tony.stark@student.edu', rollNumber: 'ME-2001', department: 'Mechanical Engineering', year: '4th Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Bruce Banner', email: 'bruce.banner@student.edu', rollNumber: 'BP-2005', department: 'Bio-Physics', year: '4th Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Diana Prince', email: 'diana.prince@student.edu', rollNumber: 'HA-2209', department: 'History & Archeology', year: '2nd Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Clark Kent', email: 'clark.kent@student.edu', rollNumber: 'JR-2303', department: 'Journalism', year: '1st Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Barry Allen', email: 'barry.allen@student.edu', rollNumber: 'CH-2212', department: 'Chemistry', year: '2nd Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Bruce Wayne', email: 'bruce.wayne@student.edu', rollNumber: 'BM-2104', department: 'Business Management', year: '3rd Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Selina Kyle', email: 'selina.kyle@student.edu', rollNumber: 'CR-2315', department: 'Criminology', year: '1st Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Wanda Maximoff', email: 'wanda.maximoff@student.edu', rollNumber: 'PS-2208', department: 'Psychology', year: '2nd Year', faceEmbedding: generateMockEmbedding() },
      { name: 'Steve Rogers', email: 'steve.rogers@student.edu', rollNumber: 'HI-2004', department: 'History', year: '4th Year', faceEmbedding: generateMockEmbedding() }
    ];

    const students = [];
    for (const s of studentsData) {
      const student = new Student(s);
      await student.save();

      const studentUser = new User({
        email: s.email,
        password: Math.random().toString(36),
        role: 'student',
        name: s.name,
        studentRef: student._id
      });
      await studentUser.save();
      students.push(student);
    }
    console.log('Students created.');

    // 4. Create Subjects & Enroll Students
    console.log('Creating Subjects & Enrolling...');
    const subjectsData = [
      {
        subjectCode: 'CS-401',
        name: 'Artificial Intelligence',
        section: 'A',
        teacher: teachers[0]._id,
        students: [students[0]._id, students[1]._id, students[2]._id, students[6]._id, students[8]._id]
      },
      {
        subjectCode: 'BIO-302',
        name: 'Computational Neuroscience',
        section: 'B',
        teacher: teachers[1]._id,
        students: [students[2]._id, students[5]._id, students[8]._id, students[9]._id]
      },
      {
        subjectCode: 'CS-302',
        name: 'Theory of Computation',
        section: 'A',
        teacher: teachers[2]._id,
        students: [students[0]._id, students[1]._id, students[3]._id, students[4]._id, students[7]._id]
      }
    ];

    const subjects = [];
    for (const sub of subjectsData) {
      const subject = new Subject(sub);
      await subject.save();
      subjects.push(subject);
    }
    console.log('Subjects created.');

    // 5. Generate Attendance History (Last 30 Days)
    console.log('Generating Attendance logs (Last 30 Days)...');
    const logs = [];
    const now = new Date();
    
    const dates = [];
    let dayCursor = new Date(now);
    dayCursor.setDate(now.getDate() - 30);
    
    while (dayCursor <= now) {
      const dayOfWeek = dayCursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(dayCursor));
      }
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    for (const subject of subjects) {
      for (const d of dates) {
        const teacherId = subject.teacher;
        for (const studentId of subject.students) {
          const rand = Math.random();
          const status = rand > 0.15 ? 'Present' : 'Absent';
          
          logs.push({
            studentId,
            teacherId,
            subject: subject.name,
            date: new Date(d),
            status
          });
        }
      }
    }

    await Attendance.insertMany(logs);
    console.log(`Generated ${logs.length} logs.`);

    // 6. Recalculate Student Attendance Percentages
    console.log('Updating student overall percentages...');
    for (const student of students) {
      const totalLogs = await Attendance.countDocuments({ studentId: student._id });
      const presentLogs = await Attendance.countDocuments({ studentId: student._id, status: 'Present' });
      const percentage = totalLogs > 0 ? Math.round((presentLogs / totalLogs) * 100) : 100;
      
      student.attendancePercentage = percentage;
      await student.save();
    }
    console.log('Percentages updated.');

    console.log('=========================================');
    console.log('DATABASE SEEDED SUCCESSFULLY!');
    console.log('Admin login: admin@attendance.pro / admin123');
    console.log('Teacher face login profile active for: sarah.connor@institution.edu');
    console.log('Student face login profile active for: peter.parker@student.edu');
    console.log('=========================================');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
