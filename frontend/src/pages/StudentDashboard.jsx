import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';

// Lucide Icons
import { 
  GraduationCap, LayoutDashboard, Calendar, BookOpen, User, Bell, LogOut,
  TrendingUp, CheckCircle, AlertTriangle, ShieldCheck, ChevronRight,
  FileText, Award, Clock, Settings, Bot, Menu, X, Shield, ShieldAlert
} from 'lucide-react';

// Subcomponents
import StudentOverview from './student/StudentOverview';
import StudentCourses from './student/StudentCourses';
import StudentAttendance from './student/StudentAttendance';
import StudentAssignments from './student/StudentAssignments';
import StudentExams from './student/StudentExams';
import StudentResults from './student/StudentResults';
import StudentTimetable from './student/StudentTimetable';
import StudentMaterials from './student/StudentMaterials';
import StudentNotifications from './student/StudentNotifications';
import StudentSecurity from './student/StudentSecurity';
import StudentSettings from './student/StudentSettings';
import StudentAI from './student/StudentAI';

export default function StudentDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Student DB states
  const [subjects, setSubjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    percentage: 100,
    total: 0,
    attended: 0,
    missed: 0
  });

  const fetchStudentData = async () => {
    if (!user?.studentId) return;
    try {
      const [subRes, logRes] = await Promise.all([
        api.get(`/subjects?studentId=${user.studentId}`),
        api.get(`/attendance?studentId=${user.studentId}`)
      ]);

      setSubjects(subRes.data);
      setLogs(logRes.data);

      const total = logRes.data.length;
      const attended = logRes.data.filter(l => l.status === 'Present').length;
      const missed = total - attended;
      const percentage = total > 0 ? Math.round((attended / total) * 100) : 100;

      setStats({
        percentage,
        total,
        attended,
        missed
      });
    } catch (err) {
      console.error('Failed to load student dashboard database logs:', err);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  // Sidebar navigation menu items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance Grid', icon: <Calendar className="w-5 h-5" /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-5 h-5" /> },
    { id: 'exams', label: 'Exams', icon: <Calendar className="w-5 h-5" /> },
    { id: 'results', label: 'Results', icon: <Award className="w-5 h-5" /> },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-5 h-5" /> },
    { id: 'materials', label: 'Study Materials', icon: <FileText className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5 font-bold" /> },
    { id: 'security', label: 'Security Logs', icon: <Shield className="w-5 h-5" /> },
    { id: 'ai', label: 'Student Assistant', icon: <Bot className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-all duration-300 ${
      isDarkMode ? 'bg-slateCustom-950 text-white' : 'bg-slate-50 text-slateCustom-900'
    }`}>
      
      {/* MOBILE TOP BAR NAVIGATION */}
      <header className={`md:hidden flex items-center justify-between px-6 py-4 border-b shrink-0 ${
        isDarkMode ? 'bg-slateCustom-900 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-base font-black font-display uppercase tracking-wider">Smart Attendance</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`p-1.5 rounded-lg border ${isDarkMode ? 'border-slateCustom-700 text-white' : 'border-slateCustom-200 text-slateCustom-800'}`}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION FOR DESKTOP */}
      <aside className={`hidden md:flex w-64 bg-slateCustom-900 text-white shrink-0 flex-col justify-between p-6 overflow-y-auto`}>
        <div className="flex flex-col space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-base font-black font-display tracking-tight uppercase">Smart Attendance</span>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow'
                    : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer profile segment */}
        <div className="border-t border-slateCustom-800 pt-6 mt-8 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slateCustom-800 flex items-center justify-center font-bold font-display uppercase text-primary border border-slateCustom-700">
              {user?.name?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-black truncate">{user?.name}</div>
              <div className="text-[10px] text-slateCustom-500 uppercase font-semibold">{user?.role}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slateCustom-800 text-slateCustom-400 hover:text-white hover:bg-slateCustom-800 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE NAVIGATION SLIDEOVER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className={`w-64 h-full flex flex-col justify-between p-6 ${
              isDarkMode ? 'bg-slateCustom-900 text-white' : 'bg-slateCustom-900 text-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-7 w-7 text-primary" />
                  <span className="text-sm font-black font-display uppercase tracking-wider">Smart Attendance</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slateCustom-400" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1 overflow-y-auto max-h-[70vh]">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow'
                        : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="border-t border-slateCustom-800 pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slateCustom-800 flex items-center justify-center font-bold font-display uppercase text-primary">
                  {user?.name?.charAt(0)}
                </div>
                <div className="overflow-hidden text-left">
                  <div className="text-xs font-bold truncate">{user?.name}</div>
                  <div className="text-[10px] text-slateCustom-500 uppercase">{user?.role}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slateCustom-800 text-slateCustom-400 hover:text-white hover:bg-slateCustom-800 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        
        {/* Dynamic header label based on activeTab */}
        <div className="mb-8 flex justify-between items-center border-b pb-4 border-slateCustom-200/50 dark:border-slateCustom-800/80">
          <div>
            <h1 className={`text-2xl md:text-3xl font-black font-display tracking-tight ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
              {activeTab === 'overview' && 'Overview Dashboard'}
              {activeTab === 'attendance' && 'Attendance Calendar & Analytics'}
              {activeTab === 'courses' && 'My Academic Courses'}
              {activeTab === 'assignments' && 'Assignments & Projects'}
              {activeTab === 'exams' && 'Semester Exam Schedules'}
              {activeTab === 'results' && 'Academic Transcripts'}
              {activeTab === 'timetable' && 'Weekly Class Timetable'}
              {activeTab === 'materials' && 'Study Materials Vault'}
              {activeTab === 'notifications' && 'Notifications Bulletins'}
              {activeTab === 'security' && 'Security & Access Logs'}
              {activeTab === 'ai' && 'AI Student Assistant'}
              {activeTab === 'settings' && 'Portal Settings'}
            </h1>
            <p className={`text-xs ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-450'} mt-1`}>
              Academic Year: 3rd Year • Semester 5 • Roll No: Parker-CS
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block ${
              isDarkMode 
                ? 'bg-green-500/10 border-green-500/25 text-green-400' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              Live Sync Active
            </span>
          </div>
        </div>

        {/* Tab view loaders */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <StudentOverview 
              stats={stats} 
              subjects={subjects} 
              logs={logs} 
              isDarkMode={isDarkMode} 
              studentId={user?.studentId}
              onRefresh={fetchStudentData}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              onLogout={handleSignOut}
            />
          )}
          
          {activeTab === 'attendance' && (
            <StudentAttendance 
              stats={stats} 
              subjects={subjects} 
              logs={logs} 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'courses' && (
            <StudentCourses 
              subjects={subjects} 
              studentId={user?.studentId} 
              onRefresh={fetchStudentData} 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'assignments' && (
            <StudentAssignments 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'exams' && (
            <StudentExams 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'results' && (
            <StudentResults 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'timetable' && (
            <StudentTimetable 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'materials' && (
            <StudentMaterials 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'notifications' && (
            <StudentNotifications 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'security' && (
            <StudentSecurity 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'ai' && (
            <StudentAI 
              stats={stats} 
              subjects={subjects} 
              isDarkMode={isDarkMode} 
            />
          )}
          
          {activeTab === 'settings' && (
            <StudentSettings 
              isDarkMode={isDarkMode} 
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
              onLogout={handleSignOut}
            />
          )}
        </div>
      </main>
    </div>
  );
}
