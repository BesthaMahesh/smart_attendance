import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Calendar, CheckCircle2, AlertTriangle, Award, 
  Clock, ArrowRight, Megaphone, CheckSquare, X, Bot, BookOpen, FileText, Bell, Shield, Settings
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

// Subcomponents imports
import StudentCourses from './StudentCourses';
import StudentAttendance from './StudentAttendance';
import StudentAssignments from './StudentAssignments';
import StudentExams from './StudentExams';
import StudentResults from './StudentResults';
import StudentTimetable from './StudentTimetable';
import StudentMaterials from './StudentMaterials';
import StudentNotifications from './StudentNotifications';
import StudentSecurity from './StudentSecurity';
import StudentAI from './StudentAI';
import StudentSettings from './StudentSettings';

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
        className="absolute inset-0 bg-slateCustom-950/65 backdrop-blur-xs"
      />
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 border ${
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

export default function StudentOverview({ stats, subjects, logs, isDarkMode, studentId, onRefresh, onToggleDarkMode, onLogout }) {
  const [activeModal, setActiveModal] = useState(null);

  // Mock upcoming classes
  const upcomingClasses = [
    { id: 1, subject: 'Artificial Intelligence', time: '10:00 AM - 11:30 AM', room: 'Lab-3', faculty: 'Dr. Sarah Connor' },
    { id: 2, subject: 'Software Engineering', time: '01:00 PM - 02:30 PM', room: 'Seminar Hall-1', faculty: 'Prof. Alan Turing' },
    { id: 3, subject: 'Database Systems', time: '03:00 PM - 04:30 PM', room: 'Room-402', faculty: 'Dr. E.F. Codd' }
  ];

  // Mock announcements
  const announcements = [
    { id: 1, title: 'Mid-Term Exam Schedule Published', date: 'June 14, 2026', type: 'academic', desc: 'The schedule for the 3rd semester midterm exams is now active. Check the Exams tab for room listings.' },
    { id: 2, title: 'Hackathon Registration Open', date: 'June 12, 2026', type: 'placement', desc: 'Annual Inter-department Hackathon registrations are open till next Friday. Top recruiters will be evaluating submissions.' },
    { id: 3, title: 'Face Authenticator Nodes Update', date: 'June 10, 2026', type: 'general', desc: 'Please update your roster face embeddings if you recently changed your look to prevent recognition delay.' }
  ];

  // Fallback monthly compliance chart data
  const monthlyData = [
    { name: 'Jan', Rate: 95 },
    { name: 'Feb', Rate: 92 },
    { name: 'Mar', Rate: 88 },
    { name: 'Apr', Rate: stats.percentage || 94 },
    { name: 'May', Rate: 96 },
    { name: 'Jun', Rate: stats.percentage || 95 }
  ];

  // Weekly rates data
  const weeklyData = [
    { day: 'Mon', Present: 98 },
    { day: 'Tue', Present: 95 },
    { day: 'Wed', Present: 92 },
    { day: 'Thu', Present: 90 },
    { day: 'Fri', Present: 96 }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      {/* Welcome Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl p-8 border ${
          isDarkMode 
            ? 'bg-slateCustom-900/40 border-slateCustom-800' 
            : 'bg-white border-slateCustom-200/85'
        } shadow-lg shadow-primary/5`}
      >
        <div className="absolute top-[-40%] right-[-10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-40%] left-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                <Award className="w-3.5 h-3.5" />
                <span>Elite Scholar Status</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-black font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                Academic Track Overview
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'} max-w-xl`}>
                Verify your facial login audit trail, track daily compliance metrics, check upcoming lectures, and stay updated with departmental bulletins.
              </p>
            </div>
            
            {/* Quick action buttons right inside the hero card */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveModal('ai')}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Assistant</span>
              </button>
              <button
                onClick={() => setActiveModal('assignments')}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-accent text-slateCustom-950 hover:bg-accent-dark shadow transition-all cursor-pointer"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Submit Assignments</span>
              </button>
              <button
                onClick={() => setActiveModal('materials')}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slateCustom-100 hover:bg-slateCustom-200 dark:bg-slateCustom-800 dark:hover:bg-slateCustom-700 text-slateCustom-700 dark:text-slateCustom-300 shadow transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Study Materials</span>
              </button>
              <button
                onClick={() => setActiveModal('settings')}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slateCustom-100 hover:bg-slateCustom-200 dark:bg-slateCustom-800 dark:hover:bg-slateCustom-700 text-slateCustom-700 dark:text-slateCustom-300 shadow transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Portal Settings</span>
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4 shrink-0">
            <button
              onClick={() => setActiveModal('results')}
              className={`px-5 py-4 rounded-2xl border text-center hover:scale-105 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slateCustom-950/40 border-slateCustom-800 hover:bg-slateCustom-850' 
                  : 'bg-slateCustom-50 border-slateCustom-200 hover:bg-slateCustom-100/60'
              }`}
            >
              <div className={`text-2xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>3.85</div>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'} mt-1`}>Sem GPA</div>
            </button>
            <button
              onClick={() => setActiveModal('attendance')}
              className={`px-5 py-4 rounded-2xl border text-center hover:scale-105 transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slateCustom-950/40 border-slateCustom-800 hover:bg-slateCustom-850' 
                  : 'bg-slateCustom-50 border-slateCustom-200 hover:bg-slateCustom-100/60'
              }`}
            >
              <div className="text-2xl font-black font-mono text-primary">{stats.percentage}%</div>
              <div className={`text-[10px] uppercase font-bold tracking-wider ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'} mt-1`}>Attendance</div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Widget Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Attendance Rate", value: `${stats.percentage}%`, icon: <TrendingUp className="w-6 h-6" />, colorClass: "text-primary bg-primary/10", desc: "Target rate above 85%", modal: 'attendance' },
          { title: "Total Subjects", value: subjects.length || 4, icon: <Award className="w-6 h-6" />, colorClass: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400", desc: "Across Current Semester", modal: 'courses' },
          { title: "Classes Attended", value: stats.attended, icon: <CheckCircle2 className="w-6 h-6" />, colorClass: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400", desc: "Face Scan Verified", modal: 'attendance' },
          { title: "Missed Classes", value: stats.missed, icon: <AlertTriangle className="w-6 h-6" />, colorClass: "text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400", desc: "Requires Compliance Review", modal: 'attendance' }
        ].map((item, idx) => (
          <motion.div
            key={item.title}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onClick={() => setActiveModal(item.modal)}
            className={`rounded-2xl p-6 border cursor-pointer hover:scale-102 hover:shadow-md transition-all ${
              isDarkMode 
                ? 'bg-slateCustom-900/40 border-slateCustom-800 hover:bg-slateCustom-800/60' 
                : 'bg-white border-slateCustom-200/80 hover:bg-slateCustom-50'
            } shadow-sm flex items-center space-x-4`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.colorClass}`}>
              {item.icon}
            </div>
            <div>
              <div className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>{item.title}</div>
              <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{item.value}</div>
              <div className={`text-[10px] mt-1 ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Trends Graph */}
        <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>My Attendance Trend</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>Monthly average comparison rate (%)</p>
            </div>
            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${
              isDarkMode ? 'bg-slateCustom-800 border-slateCustom-700 text-slateCustom-400' : 'bg-slateCustom-100 border-slateCustom-200 text-slateCustom-500'
            }`}>
              Sem 5
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={11} domain={[60, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={isDarkMode ? { backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' } : {}}
                />
                <Bar dataKey="Rate" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Graph */}
        <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Weekly Profile Activity</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>Weekly attendance rate details</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#E2E8F0"} />
                <XAxis dataKey="day" stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={11} domain={[70, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={isDarkMode ? { backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' } : {}}
                />
                <Area type="monotone" dataKey="Present" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Timetable & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Classes Timetable */}
        <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Upcoming Classes Today</h3>
            <button
              onClick={() => setActiveModal('timetable')}
              className="text-xs text-primary hover:underline font-bold transition-all"
            >
              View Full Timetable
            </button>
          </div>
          <div className="space-y-4">
            {upcomingClasses.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode 
                    ? 'bg-slateCustom-950/20 border-slateCustom-800/80 hover:bg-slateCustom-850' 
                    : 'bg-slateCustom-50/60 border-slateCustom-100 hover:bg-slateCustom-50'
                } flex justify-between items-center`}
              >
                <div className="space-y-1">
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'}`}>{item.subject}</h4>
                  <div className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'}`}>{item.faculty}</div>
                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded inline-block bg-primary/10 text-primary mt-1`}>
                    Room {item.room}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slateCustom-400" />
                  <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulletins / Announcements */}
        <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Announcements Bulletin</h3>
            <button
              onClick={() => setActiveModal('notifications')}
              className="text-xs text-primary hover:underline font-bold transition-all"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {announcements.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode 
                    ? 'bg-slateCustom-950/20 border-slateCustom-800/80 hover:bg-slateCustom-850' 
                    : 'bg-slateCustom-50/60 border-slateCustom-100 hover:bg-slateCustom-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-amber-500 shrink-0" />
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'}`}>{item.title}</h4>
                  </div>
                  <span className={`text-[9px] font-mono text-slateCustom-400`}>{item.date}</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity Timeline */}
      <div className={`border rounded-3xl p-6 shadow-sm ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Recent Activity Timeline</h3>
          <button
            onClick={() => setActiveModal('security')}
            className="text-xs text-primary hover:underline font-bold flex items-center space-x-1"
          >
            <span>Security Logs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="relative pl-6 border-l-2 border-slateCustom-200 dark:border-slateCustom-800 space-y-6">
          {logs.slice(0, 4).map((log, index) => (
            <div key={log._id || index} className="relative">
              {/* Timeline circle icon indicator */}
              <div className={`absolute left-[-31px] top-1.5 w-4 h-4 rounded-full border-4 ${
                log.status === 'Present' 
                  ? 'bg-green-500 border-white dark:border-slateCustom-900' 
                  : 'bg-red-500 border-white dark:border-slateCustom-900'
              }`}></div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <div>
                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                    Attendance Logged: <span className={log.status === 'Present' ? 'text-green-500' : 'text-red-500'}>{log.status}</span>
                  </h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'} mt-0.5`}>
                    Verified subject: <span className="font-semibold text-primary">{log.subject}</span>. Checked in via Face Recognition matching node.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-slateCustom-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold font-mono">{new Date(log.date).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className={`text-center py-6 text-xs ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>
              No recent logs found. Start scanning your face at class terminals to trigger timeline activities.
            </div>
          )}
        </div>
      </div>

      {/* Render Modals in AnimatePresence */}
      <AnimatePresence>
        {activeModal === 'attendance' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Attendance Ledger & Analytics" isDarkMode={isDarkMode}>
            <StudentAttendance stats={stats} subjects={subjects} logs={logs} isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'courses' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Course Enrollment & Syllabus" isDarkMode={isDarkMode}>
            <StudentCourses subjects={subjects} studentId={studentId} onRefresh={onRefresh} isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'assignments' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Assignments Tracker" isDarkMode={isDarkMode}>
            <StudentAssignments isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'exams' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Semester Exam Schedules" isDarkMode={isDarkMode}>
            <StudentExams isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'results' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Academic Transcripts" isDarkMode={isDarkMode}>
            <StudentResults isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'timetable' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Weekly Class Timetable" isDarkMode={isDarkMode}>
            <StudentTimetable isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'materials' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Study Materials Vault" isDarkMode={isDarkMode}>
            <StudentMaterials isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'notifications' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Notification Bulletins" isDarkMode={isDarkMode}>
            <StudentNotifications isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'security' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Security & Access Logs" isDarkMode={isDarkMode}>
            <StudentSecurity isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'ai' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="AI Student Assistant" isDarkMode={isDarkMode}>
            <StudentAI stats={stats} subjects={subjects} isDarkMode={isDarkMode} />
          </Modal>
        )}
        {activeModal === 'settings' && (
          <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Portal Settings" isDarkMode={isDarkMode}>
            <StudentSettings isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} onLogout={onLogout} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
