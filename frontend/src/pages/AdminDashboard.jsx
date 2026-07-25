import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';
import { 
  Users, UserCheck, Monitor, GraduationCap, LayoutDashboard, Plus, Edit2, Trash2, 
  Settings, LogOut, Search, UserPlus, X, HelpCircle, BarChart3, ChevronRight, BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSettings from './admin/AdminSettings';

// Premium Modal Wrapper Component
function Modal({ isOpen, onClose, title, children, isDarkMode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay background with backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slateCustom-955/65 backdrop-blur-xs"
      />
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className={`relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl z-10 border ${
          isDarkMode 
            ? 'bg-slateCustom-900 border-slateCustom-800 text-white' 
            : 'bg-white border-slateCustom-200 text-slateCustom-900'
        }`}
      >
        <div className="p-6 border-b border-slateCustom-200/50 dark:border-slateCustom-800/80 flex justify-between items-center bg-slateCustom-50 dark:bg-slateCustom-950/40">
          <h3 className="text-lg font-black font-display tracking-tight text-slateCustom-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all ${
              isDarkMode 
                ? 'hover:bg-slateCustom-805 text-slateCustom-400 hover:text-white' 
                : 'hover:bg-slateCustom-150 text-slateCustom-500 hover:text-slateCustom-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'teachers', 'subjects', 'settings'
  const [activeModal, setActiveModal] = useState(null); // null, 'students', 'teachers', 'subjects', 'settings'
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data states
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    avgAttendance: 0
  });

  // Search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // stores item being edited

  // Form states
  const [studentForm, setStudentForm] = useState({ name: '', email: '', department: 'Computer Science', year: '1st Year' });
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', subject: 'Computer Science' });
  const [subjectForm, setSubjectForm] = useState({ subjectCode: '', name: '', section: 'A', teacherId: '' });

  // Enrollment management
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [enrollStudentId, setEnrollStudentId] = useState('');

  // Load dashboard data
  const loadData = async () => {
    try {
      const [sRes, tRes, subRes] = await Promise.all([
        api.get('/students'),
        api.get('/teachers'),
        api.get('/subjects')
      ]);

      setStudents(sRes.data);
      setTeachers(tRes.data);
      setSubjects(subRes.data);

      // Compute statistics
      const totalS = sRes.data.length;
      const totalT = tRes.data.length;
      const totalC = subRes.data.length;
      
      const sumPercentage = sRes.data.reduce((acc, curr) => acc + (curr.attendancePercentage || 0), 0);
      const avgA = totalS > 0 ? Math.round(sumPercentage / totalS) : 100;

      setStats({
        totalStudents: totalS,
        totalTeachers: totalT,
        totalClasses: totalC,
        avgAttendance: avgA
      });
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // CRUD actions for Students
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/students/${editingItem._id}`, studentForm);
      } else {
        await api.post('/students', studentForm);
      }
      setShowStudentModal(false);
      setEditingItem(null);
      setStudentForm({ name: '', email: '', department: 'Computer Science', year: '1st Year' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit student form.');
    }
  };

  const handleEditStudent = (student) => {
    setEditingItem(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year
    });
    setShowStudentModal(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student profile and associated user credentials?')) {
      try {
        await api.delete(`/students/${id}`);
        loadData();
      } catch (err) {
        alert('Failed to delete student.');
      }
    }
  };

  // CRUD actions for Teachers
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/teachers/${editingItem._id}`, teacherForm);
      } else {
        await api.post('/teachers', teacherForm);
      }
      setShowTeacherModal(false);
      setEditingItem(null);
      setTeacherForm({ name: '', email: '', subject: 'Computer Science' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit teacher form.');
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingItem(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject
    });
    setShowTeacherModal(true);
  };

  const handleDeleteTeacher = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher profile and associated user credentials?')) {
      try {
        await api.delete(`/teachers/${id}`);
        loadData();
      } catch (err) {
        alert('Failed to delete teacher.');
      }
    }
  };

  // CRUD actions for Subjects
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', subjectForm);
      setShowSubjectModal(false);
      setSubjectForm({ subjectCode: '', name: '', section: 'A', teacherId: '' });
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create subject.');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        loadData();
      } catch (err) {
        alert('Failed to delete subject.');
      }
    }
  };

  // Student enrollment in subject
  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    if (!enrollStudentId || !selectedSubject) return;
    try {
      await api.put(`/subjects/${selectedSubject._id}`, {
        action: 'enroll',
        studentId: enrollStudentId
      });
      setEnrollStudentId('');
      loadData();
      // Refresh current subject view details
      const updated = subjects.find(sub => sub._id === selectedSubject._id);
      if (updated) {
        setTimeout(async () => {
          const fresh = await api.get('/subjects');
          const freshSub = fresh.data.find(s => s._id === selectedSubject._id);
          setSelectedSubject(freshSub);
        }, 100);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to enroll student.');
    }
  };

  const handleUnenrollStudent = async (studentId) => {
    if (!selectedSubject) return;
    try {
      await api.put(`/subjects/${selectedSubject._id}`, {
        action: 'unenroll',
        studentId
      });
      loadData();
      setTimeout(async () => {
        const fresh = await api.get('/subjects');
        const freshSub = fresh.data.find(s => s._id === selectedSubject._id);
        setSelectedSubject(freshSub);
      }, 100);
    } catch (err) {
      alert('Failed to unenroll student.');
    }
  };

  // Filter lists
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.department.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredSubjects = subjects.filter(sub => 
    sub.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
    sub.subjectCode.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Mock monthly compliance chart data
  const chartData = [
    { name: 'Jan', Rate: 88 },
    { name: 'Feb', Rate: 92 },
    { name: 'Mar', Rate: 90 },
    { name: 'Apr', Rate: stats.avgAttendance || 94 },
    { name: 'May', Rate: 95 },
    { name: 'Jun', Rate: 93 }
  ];

  // Local components variables definitions
  const studentsListContent = (
    <div className={`border rounded-3xl overflow-hidden shadow-sm text-slateCustom-900 ${
      isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
    }`}>
      <div className={`p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${
        isDarkMode ? 'border-slateCustom-850' : 'border-slateCustom-200'
      }`}>
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slateCustom-450">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
              isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
            }`}
          />
        </div>
        <button
          onClick={() => { setEditingItem(null); setStudentForm({ name: '', email: '', department: 'Computer Science', year: '1st Year' }); setShowStudentModal(true); }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Student
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'bg-slateCustom-950/40 border-slateCustom-855 text-slateCustom-400' : 'bg-slateCustom-50 border-slateCustom-200 text-slateCustom-400'
            }`}>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Dept / Year</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${
            isDarkMode ? 'divide-slateCustom-850 text-slateCustom-300' : 'divide-slateCustom-100 text-slateCustom-700'
          }`}>
            {filteredStudents.map((student) => (
              <tr key={student._id} className={isDarkMode ? 'hover:bg-slateCustom-800/30' : 'hover:bg-slateCustom-50/50'}>
                <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{student.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{student.email}</td>
                <td className="px-6 py-4 text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-600'}`}>{student.department}</span>
                  <div className="text-[10px] text-slateCustom-450">{student.year}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold ${
                      student.attendancePercentage >= 85 ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {student.attendancePercentage}%
                    </span>
                    <div className={`w-16 h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slateCustom-800' : 'bg-slateCustom-100'}`}>
                      <div 
                        className={`h-full ${student.attendancePercentage >= 85 ? 'bg-green-500' : 'bg-red-400'}`} 
                        style={{ width: `${student.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEditStudent(student)} className={`p-1.5 rounded-lg hover:text-primary ${isDarkMode ? 'text-slateCustom-500 hover:bg-slateCustom-800/60' : 'text-slateCustom-400 hover:bg-slateCustom-55'}`} title="Edit">
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                  <button onClick={() => handleDeleteStudent(student._id)} className={`p-1.5 rounded-lg hover:text-red-650 ${isDarkMode ? 'text-slateCustom-505 hover:bg-red-950/30' : 'text-slateCustom-400 hover:bg-red-50'}`} title="Delete">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slateCustom-450">No student profiles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const teachersListContent = (
    <div className={`border rounded-3xl overflow-hidden shadow-sm text-slateCustom-900 ${
      isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
    }`}>
      <div className={`p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${
        isDarkMode ? 'border-slateCustom-850' : 'border-slateCustom-200'
      }`}>
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slateCustom-450">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search teachers..."
            value={teacherSearch}
            onChange={(e) => setTeacherSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
              isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
            }`}
          />
        </div>
        <button
          onClick={() => { setEditingItem(null); setTeacherForm({ name: '', email: '', subject: 'Computer Science' }); setShowTeacherModal(true); }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Teacher
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
              isDarkMode ? 'bg-slateCustom-950/40 border-slateCustom-850 text-slateCustom-400' : 'bg-slateCustom-50 border-slateCustom-200 text-slateCustom-400'
            }`}>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Default Subject</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-sm ${
            isDarkMode ? 'divide-slateCustom-850 text-slateCustom-300' : 'divide-slateCustom-100 text-slateCustom-700'
          }`}>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id} className={isDarkMode ? 'hover:bg-slateCustom-800/30' : 'hover:bg-slateCustom-50/50'}>
                <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{teacher.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{teacher.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? 'bg-slateCustom-800 text-slateCustom-300' : 'bg-slateCustom-100 text-slateCustom-700'
                  }`}>
                    {teacher.subject}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEditTeacher(teacher)} className={`p-1.5 rounded-lg hover:text-primary ${isDarkMode ? 'text-slateCustom-505 hover:bg-slateCustom-800/60' : 'text-slateCustom-400 hover:bg-slateCustom-50'}`} title="Edit">
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                  <button onClick={() => handleDeleteTeacher(teacher._id)} className={`p-1.5 rounded-lg hover:text-red-650 ${isDarkMode ? 'text-slateCustom-505 hover:bg-red-950/30' : 'text-slateCustom-400 hover:bg-red-55'}`} title="Delete">
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTeachers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slateCustom-450">No teacher accounts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const subjectsListContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slateCustom-900">
      {/* Subjects Roster Card list */}
      <div className={`border rounded-3xl p-6 shadow-sm lg:col-span-7 ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <div className={`flex justify-between items-center border-b pb-4 ${
          isDarkMode ? 'border-slateCustom-850' : 'border-slateCustom-100'
        }`}>
          <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Active Subjects</h3>
          <button
            onClick={() => setShowSubjectModal(true)}
            className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Create Subject
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slateCustom-450">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Filter subjects..."
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
              isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
            }`}
          />
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {filteredSubjects.map((sub) => (
            <div
              key={sub._id}
              onClick={() => setSelectedSubject(sub)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedSubject?._id === sub._id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800/30' : 'border-slateCustom-200 hover:bg-slateCustom-50'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {sub.subjectCode}
                  </span>
                  <span className={`font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{sub.name}</span>
                </div>
                <div className="text-xs text-slateCustom-500 mt-1">
                  Teacher: <strong className={`font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{sub.teacher?.name || 'Unassigned'}</strong> | Section: <strong className={`font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{sub.section}</strong>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isDarkMode ? 'bg-slateCustom-800 text-slateCustom-300' : 'bg-slateCustom-100 text-slateCustom-700'
                }`}>
                  {sub.students?.length || 0} Enrolled
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteSubject(sub._id); }}
                  className={`p-1 rounded-lg hover:text-red-500 ${isDarkMode ? 'text-slateCustom-500 hover:bg-red-950/30' : 'text-slateCustom-400 hover:bg-red-50'}`}
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredSubjects.length === 0 && (
            <div className="text-center py-6 text-slateCustom-450">No subject rosters found.</div>
          )}
        </div>
      </div>

      {/* Enrollments manager */}
      <div className={`border rounded-3xl p-6 shadow-sm flex flex-col lg:col-span-5 ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <h3 className={`text-lg font-bold font-display mb-4 border-b pb-4 ${
          isDarkMode ? 'text-white border-slateCustom-850' : 'text-slateCustom-900 border-slateCustom-100'
        }`}>
          Enrollment Manager
        </h3>

        {selectedSubject ? (
          <div className="flex-grow flex flex-col justify-between space-y-6">
            <div>
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-800'}`}>
                Enroll student to <strong className="text-primary font-bold">{selectedSubject.name}</strong>
              </h4>
              <form onSubmit={handleEnrollStudent} className="flex space-x-2 mt-3">
                <select
                  required
                  value={enrollStudentId}
                  onChange={(e) => setEnrollStudentId(e.target.value)}
                  className={`flex-grow px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                    isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                  }`}
                >
                  <option value="">Choose Student...</option>
                  {students
                    .filter(s => !selectedSubject.students?.some(es => es._id === s._id))
                    .map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                    ))
                  }
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Enroll
                </button>
              </form>
            </div>

            <div className="flex-grow overflow-y-auto max-h-72 pr-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slateCustom-450 mb-2">Enrolled Students ({selectedSubject.students?.length || 0})</div>
              <div className={`divide-y ${isDarkMode ? 'divide-slateCustom-850' : 'divide-slateCustom-100'}`}>
                {selectedSubject.students?.map((estudent) => (
                  <div key={estudent._id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slateCustom-800'}`}>{estudent.name}</div>
                      <div className="text-[10px] text-slateCustom-450 font-mono">{estudent.email}</div>
                    </div>
                    <button
                      onClick={() => handleUnenrollStudent(estudent._id)}
                      className="text-[10px] font-semibold text-red-500 hover:text-red-700 bg-red-55 hover:bg-red-950/20 dark:bg-red-500/10 px-2 py-1 rounded cursor-pointer"
                    >
                      Unenroll
                    </button>
                  </div>
                ))}
                {(!selectedSubject.students || selectedSubject.students.length === 0) && (
                  <div className="text-center py-4 text-xs text-slateCustom-450">No students enrolled in this course.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex-grow flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl ${
            isDarkMode ? 'border-slateCustom-800 text-slateCustom-455' : 'border-slateCustom-200 text-slateCustom-400'
          }`}>
            <BookOpen className="w-10 h-10 mb-2 text-slateCustom-300" />
            <p className="text-xs">Select a subject from the list to manage its student enrollment roster.</p>
          </div>
        )}
      </div>
    </div>
  );

  const settingsContent = (
    <AdminSettings 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      onLogout={() => { logoutUser(); navigate('/'); }}
      user={user}
    />
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-all duration-300 ${
      isDarkMode ? 'bg-slateCustom-950 text-white' : 'bg-slate-50 text-slateCustom-900'
    }`}>
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slateCustom-900 text-white shrink-0 flex flex-col justify-between p-6">
        <div className="flex flex-col space-y-8">
          {/* Header logo */}
          <div className="flex items-center space-x-2 cursor-pointer animate-pulse" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold font-display tracking-tight">Smart Attendance</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span>Teachers</span>
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'subjects'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Subjects</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer info & logout */}
        <div className="border-t border-slateCustom-800 pt-6 mt-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slateCustom-800 flex items-center justify-center font-bold font-display uppercase text-primary">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-slateCustom-500 capitalize">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={() => { logoutUser(); navigate('/'); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slateCustom-800 text-slateCustom-400 hover:text-white hover:bg-slateCustom-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Welcome row */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-extrabold font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Admin Control Panel</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Add profiles, assign classrooms, and evaluate compliance.</p>
          </div>
          <div className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-semibold">
            Status: Cloud Synced
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setActiveModal('students')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-805 text-white' : 'bg-white border-slateCustom-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Total Students</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{stats.totalStudents}</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('teachers')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-805 text-white' : 'bg-white border-slateCustom-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Total Teachers</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{stats.totalTeachers}</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('subjects')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-805 text-white' : 'bg-white border-slateCustom-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Active Subjects</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{stats.totalClasses}</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('students')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-805 text-white' : 'bg-white border-slateCustom-200/80'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Attendance Rate</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{stats.avgAttendance}%</div>
                </div>
              </button>
            </div>

            {/* Graphs & Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Compliance Trends */}
              <div className={`border rounded-3xl p-6 shadow-sm lg:col-span-8 ${
                isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Institution Attendance Compliance</h3>
                  <span className="text-xs font-semibold text-slateCustom-500 font-mono">Monthly Average (%)</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#1E293B' : '#E2E8F0'} />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} domain={[70, 100]} tickLine={false} />
                      <Tooltip contentStyle={isDarkMode ? { backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#FFF' } : undefined} />
                      <Bar dataKey="Rate" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className={`border rounded-3xl p-6 shadow-sm flex flex-col justify-between lg:col-span-4 ${
                isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
              }`}>
                <div>
                  <h3 className={`text-lg font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Quick Admin Actions</h3>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => { setEditingItem(null); setShowStudentModal(true); }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-sm font-semibold text-left cursor-pointer ${
                        isDarkMode 
                          ? 'border-slateCustom-850 hover:bg-slateCustom-800/50 text-slateCustom-300' 
                          : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-800'
                      }`}
                    >
                      <span className="flex items-center"><UserPlus className="w-5 h-5 mr-2.5 text-primary" /> Register New Student</span>
                      <ChevronRight className="w-4 h-4 text-slateCustom-400" />
                    </button>
                    <button
                      onClick={() => { setEditingItem(null); setShowTeacherModal(true); }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-sm font-semibold text-left cursor-pointer ${
                        isDarkMode 
                          ? 'border-slateCustom-850 hover:bg-slateCustom-800/50 text-slateCustom-300' 
                          : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-800'
                      }`}
                    >
                      <span className="flex items-center"><UserPlus className="w-5 h-5 mr-2.5 text-cyan-600" /> Add Teacher Account</span>
                      <ChevronRight className="w-4 h-4 text-slateCustom-400" />
                    </button>
                    <button
                      onClick={() => { setShowSubjectModal(true); }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-sm font-semibold text-left cursor-pointer ${
                        isDarkMode 
                          ? 'border-slateCustom-850 hover:bg-slateCustom-800/50 text-slateCustom-300' 
                          : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-800'
                      }`}
                    >
                      <span className="flex items-center"><Plus className="w-5 h-5 mr-2.5 text-indigo-600" /> Create Subject Roster</span>
                      <ChevronRight className="w-4 h-4 text-slateCustom-400" />
                    </button>
                  </div>
                </div>

                <div className={`rounded-2xl p-4 border mt-6 flex flex-col space-y-2 ${
                  isDarkMode ? 'bg-slateCustom-950/40 border-slateCustom-850' : 'bg-slateCustom-50 border-slateCustom-200/60'
                }`}>
                  <div className={`flex items-center text-xs font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>
                    <HelpCircle className="w-4 h-4 mr-1.5 text-primary" /> System Info
                  </div>
                  <p className={`text-[10px] leading-relaxed font-mono ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                    Node.js Express V1.0.0<br />
                    Mongoose Schema Engine active<br />
                    DB: local_attendance_mongodb
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Traditional tabs views */}
        {activeTab === 'students' && studentsListContent}
        {activeTab === 'teachers' && teachersListContent}
        {activeTab === 'subjects' && subjectsListContent}
        {activeTab === 'settings' && settingsContent}

        {/* Modal views for Home/Overview section */}
        <AnimatePresence>
          {activeModal === 'students' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Student Roster Profiles Manager" isDarkMode={isDarkMode}>
              {studentsListContent}
            </Modal>
          )}
          {activeModal === 'teachers' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Faculty accounts Manager" isDarkMode={isDarkMode}>
              {teachersListContent}
            </Modal>
          )}
          {activeModal === 'subjects' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Subject Rosters & Enrollment Manager" isDarkMode={isDarkMode}>
              {subjectsListContent}
            </Modal>
          )}
        </AnimatePresence>
      </main>

      {/* MODAL DIALOGS FOR CREATION/EDITS */}
      <AnimatePresence>
        {showStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slateCustom-950/40 backdrop-blur-xs" onClick={() => setShowStudentModal(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-8 max-w-sm w-full border shadow-2xl z-50 ${
                isDarkMode ? 'bg-slateCustom-900 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200 text-slateCustom-900'
              }`}
            >
              <div className={`flex justify-between items-center border-b pb-4 mb-6 ${
                isDarkMode ? 'border-slateCustom-800' : 'border-slateCustom-100'
              }`}>
                <h4 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                  {editingItem ? 'Modify Student Profile' : 'Register Student'}
                </h4>
                <button onClick={() => setShowStudentModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slateCustom-800' : 'hover:bg-slateCustom-100'}`}><X className="w-5 h-5 text-slateCustom-400" /></button>
              </div>
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Department</label>
                  <input
                    type="text"
                    required
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Roll Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={studentForm.rollNumber || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-955 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Academic Year</label>
                  <select
                    value={studentForm.year}
                    onChange={(e) => setStudentForm({ ...studentForm, year: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none ${
                      isDarkMode ? 'bg-slateCustom-955 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Profile'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeacherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slateCustom-950/40 backdrop-blur-xs" onClick={() => setShowTeacherModal(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-8 max-w-sm w-full border shadow-2xl z-50 ${
                isDarkMode ? 'bg-slateCustom-900 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200 text-slateCustom-900'
              }`}
            >
              <div className={`flex justify-between items-center border-b pb-4 mb-6 ${
                isDarkMode ? 'border-slateCustom-800' : 'border-slateCustom-100'
              }`}>
                <h4 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                  {editingItem ? 'Modify Teacher Profile' : 'Add Teacher'}
                </h4>
                <button onClick={() => setShowTeacherModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slateCustom-800' : 'hover:bg-slateCustom-100'}`}><X className="w-5 h-5 text-slateCustom-400" /></button>
              </div>
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Email Address</label>
                  <input
                    type="email"
                    required
                    value={teacherForm.email}
                    onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Department Subject</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.subject}
                    onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slateCustom-950/40 backdrop-blur-xs" onClick={() => setShowSubjectModal(false)}></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-3xl p-8 max-w-sm w-full border shadow-2xl z-50 ${
                isDarkMode ? 'bg-slateCustom-900 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200 text-slateCustom-900'
              }`}
            >
              <div className={`flex justify-between items-center border-b pb-4 mb-6 ${
                isDarkMode ? 'border-slateCustom-800' : 'border-slateCustom-100'
              }`}>
                <h4 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Create Subject Roster</h4>
                <button onClick={() => setShowSubjectModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slateCustom-800' : 'hover:bg-slateCustom-100'}`}><X className="w-5 h-5 text-slateCustom-400" /></button>
              </div>
              <form onSubmit={handleSubjectSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-401"
                    value={subjectForm.subjectCode}
                    onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Class Section</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={subjectForm.section}
                    onChange={(e) => setSubjectForm({ ...subjectForm, section: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-505">Assign Teacher</label>
                  <select
                    required
                    value={subjectForm.teacherId}
                    onChange={(e) => setSubjectForm({ ...subjectForm, teacherId: e.target.value })}
                    className={`px-3 py-2 rounded-xl border text-sm focus:outline-none ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  >
                    <option value="">Choose Teacher...</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  Create Roster
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
