const Attendance = require('../models/Attendance');

const getMonthlyReport = async (req, res) => {
  const { studentId, teacherId, subject } = req.query;
  const query = {};
  if (studentId) query.studentId = studentId;
  if (teacherId) query.teacherId = teacherId;
  if (subject) query.subject = subject;

  try {
    const logs = await Attendance.find(query);
    const monthlyData = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { month: monthYear, Present: 0, Absent: 0, total: 0 };
      }
      
      if (log.status === 'Present') {
        monthlyData[monthYear].Present += 1;
      } else {
        monthlyData[monthYear].Absent += 1;
      }
      monthlyData[monthYear].total += 1;
    });

    const result = Object.values(monthlyData).map(m => {
      m.percentage = Math.round((m.Present / m.total) * 100);
      return m;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOverallReport = async (req, res) => {
  const { teacherId, subject } = req.query;
  const query = {};
  if (teacherId) query.teacherId = teacherId;
  if (subject) query.subject = subject;

  try {
    const logs = await Attendance.find(query).populate('studentId');
    const studentReport = {};

    logs.forEach(log => {
      if (!log.studentId) return;
      const sid = log.studentId._id.toString();
      
      if (!studentReport[sid]) {
        studentReport[sid] = {
          studentId: sid,
          name: log.studentId.name,
          email: log.studentId.email,
          department: log.studentId.department,
          year: log.studentId.year,
          total: 0,
          present: 0,
          absent: 0
        };
      }

      studentReport[sid].total += 1;
      if (log.status === 'Present') {
        studentReport[sid].present += 1;
      } else {
        studentReport[sid].absent += 1;
      }
    });

    const result = Object.values(studentReport).map(s => {
      s.attendancePercentage = Math.round((s.present / s.total) * 100);
      return s;
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMonthlyReport,
  getOverallReport
};
