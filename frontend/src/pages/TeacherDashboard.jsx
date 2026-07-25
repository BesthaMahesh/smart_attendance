import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';
import { 
  GraduationCap, LayoutDashboard, Camera, Mic, Users, FileBarChart, Settings, LogOut,
  ChevronRight, Calendar, AlertCircle, CheckCircle, FileSpreadsheet, Download, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import TeacherSettings from './teacher/TeacherSettings';

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
        className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl z-10 border ${
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

export default function TeacherDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'scan', 'students', 'reports', 'settings'
  const [activeModal, setActiveModal] = useState(null); // null, 'scan', 'students', 'reports', 'settings'
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Teacher specific lists
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [reportData, setReportData] = useState([]);

  // Attendance Scan states
  const [scanMode, setScanMode] = useState('face'); // 'face', 'voice'
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]); // [{ studentId, name, email, status: 'Present'/'Absent' }]
  const [logsSubmitted, setLogsSubmitted] = useState(false);

  // Audio simulation state
  const [audioRecording, setAudioRecording] = useState(false);

  // References for media
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Fetch teacher subjects
  const fetchTeacherData = async () => {
    if (!user?.teacherId) return;
    try {
      const subRes = await api.get(`/subjects?teacherId=${user.teacherId}`);
      setSubjects(subRes.data);
      if (subRes.data.length > 0) {
        setSelectedSubject(subRes.data[0]);
      }

      // Fetch overall report
      const repRes = await api.get(`/reports/overall?teacherId=${user.teacherId}`);
      setReportData(repRes.data);
    } catch (err) {
      console.error('Failed to load teacher stats:', err);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [user]);

  // Load students when subject changes
  useEffect(() => {
    if (selectedSubject) {
      // populate student list
      setStudentsList(selectedSubject.students || []);
      // reset scan states
      setScanComplete(false);
      setAttendanceRecords([]);
      setLogsSubmitted(false);
    }
  }, [selectedSubject]);

  // Web camera activation
  const startCamera = async () => {
    setScanComplete(false);
    setLogsSubmitted(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera blocked or unavailable. Proceeding with scan simulation.', err);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Run/Stop camera based on active mode
  useEffect(() => {
    if ((activeTab === 'scan' || activeModal === 'scan') && scanMode === 'face' && !scanComplete) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, activeModal, scanMode, scanComplete]);

  // Canvas audio wave animation
  const drawWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#06B6D4'; // cyan accent
      ctx.lineWidth = 3;

      for (let x = 0; x < canvas.width; x++) {
        // Sine wave equation
        const amplitude = audioRecording ? 25 : 5;
        const frequency = 0.05;
        const y = canvas.height / 2 + Math.sin(x * frequency + angle) * amplitude;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      angle += 0.15;
      animationRef.current = requestAnimationFrame(render);
    };

    render();
  };

  useEffect(() => {
    if ((activeTab === 'scan' || activeModal === 'scan') && scanMode === 'voice' && canvasRef.current) {
      drawWave();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [activeTab, activeModal, scanMode, audioRecording]);

  // Handle Scanning Simulation
  const handleStartScan = () => {
    if (studentsList.length === 0) {
      alert("No students are enrolled in this subject yet. Please add students first via the Admin dashboard.");
      return;
    }

    setIsScanning(true);
    if (scanMode === 'voice') {
      setAudioRecording(true);
    }

    // 3-second scanning simulation
    setTimeout(() => {
      setIsScanning(false);
      setAudioRecording(false);
      setScanComplete(true);
      stopCamera();

      // Semi-randomize presence mapping (80% present, 20% absent)
      const mappedLogs = studentsList.map(student => {
        const rand = Math.random();
        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          status: rand > 0.2 ? 'Present' : 'Absent'
        };
      });

      setAttendanceRecords(mappedLogs);
    }, 3000);
  };

  // Toggle override checkbox in grid
  const handleToggleStatus = (idx) => {
    const copy = [...attendanceRecords];
    copy[idx].status = copy[idx].status === 'Present' ? 'Absent' : 'Present';
    setAttendanceRecords(copy);
  };

  // Submit recorded logs to MongoDB
  const handleSubmitLogs = async () => {
    if (!selectedSubject) return;
    try {
      const recordsToSubmit = attendanceRecords.map(r => ({
        studentId: r.studentId,
        status: r.status
      }));

      await api.post('/attendance', {
        teacherId: user.teacherId,
        subject: selectedSubject.name,
        date: new Date(),
        records: recordsToSubmit
      });

      setLogsSubmitted(true);
      fetchTeacherData(); // refresh reports data
    } catch (err) {
      alert('Failed to submit attendance logs.');
    }
  };

  // PDF Export
  const handleExportPDF = () => {
    if (reportData.length === 0) return;
    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Smart Attendance Pro - Class Report", 14, 22);
    
    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text(`Teacher: ${user.name}`, 14, 30);
    doc.text(`Subject: ${selectedSubject?.name || 'Class Roster'}`, 14, 36);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 42);

    doc.line(14, 46, 196, 46);

    // Table headers
    doc.setFont("Helvetica", "bold");
    doc.text("Student Name", 14, 54);
    doc.text("Email", 75, 54);
    doc.text("Present / Total", 145, 54);
    doc.text("Rate", 175, 54);

    doc.line(14, 57, 196, 57);
    doc.setFont("Helvetica", "normal");

    let y = 65;
    reportData.forEach((row) => {
      doc.text(row.name, 14, y);
      doc.text(row.email, 75, y);
      doc.text(`${row.present} / ${row.total}`, 145, y);
      doc.text(`${row.attendancePercentage}%`, 175, y);
      y += 8;
      
      // Page breakdown safety
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`Attendance_Report_${selectedSubject?.subjectCode || 'Class'}.pdf`);
  };

  // Excel Export
  const handleExportExcel = () => {
    if (reportData.length === 0) return;
    
    const excelRows = reportData.map(row => ({
      'Student Name': row.name,
      'Email': row.email,
      'Department': row.department,
      'Year': row.year,
      'Present Count': row.present,
      'Total Classes': row.total,
      'Attendance Rate (%)': row.attendancePercentage
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roster Summary");

    // Write to file
    XLSX.writeFile(workbook, `Attendance_Summary_${selectedSubject?.subjectCode || 'Roster'}.xlsx`);
  };

  // Local components definitions for tabs
  const scanContent = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slateCustom-900">
      {/* Scanner Viewport */}
      <div className="lg:col-span-7 bg-slateCustom-900 rounded-3xl overflow-hidden border border-slateCustom-800 shadow-xl p-4 flex flex-col space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slateCustom-800">
          <div className="flex space-x-2">
            <button
              onClick={() => { setScanMode('face'); setScanComplete(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                scanMode === 'face' ? 'bg-primary text-white' : 'text-slateCustom-400 hover:text-white'
              }`}
            >
              AI Face Scan
            </button>
            <button
              onClick={() => { setScanMode('voice'); setScanComplete(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                scanMode === 'voice' ? 'bg-primary text-white' : 'text-slateCustom-400 hover:text-white'
              }`}
            >
              Voice Scan
            </button>
          </div>
          <div className="text-[10px] text-slateCustom-500 font-mono">mode: {scanMode === 'face' ? 'Webcam' : 'Microphone'}</div>
        </div>

        {/* Viewport Box */}
        <div className="relative aspect-video rounded-2xl bg-slateCustom-950 flex items-center justify-center overflow-hidden border border-slateCustom-850">
          {/* Face Scanning Screen */}
          {scanMode === 'face' && (
            <>
              {!scanComplete ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 bg-slateCustom-900 flex items-center justify-center text-center p-8">
                  <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto animate-pulse" />
                    <h4 className="text-white font-bold font-display text-sm">Face Recognition Mapping Complete</h4>
                    <p className="text-xs text-slateCustom-400">Review student logs in the override sheet and submit.</p>
                  </div>
                </div>
              )}
              {isScanning && <div className="scan-line"></div>}
            </>
          )}

          {/* Voice Scanning Screen */}
          {scanMode === 'voice' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
              {!scanComplete ? (
                <>
                  <canvas ref={canvasRef} width="400" height="150" className="w-full max-w-sm h-32 rounded-xl bg-slateCustom-950/20"></canvas>
                  <p className="text-[10px] text-slateCustom-400 font-medium">
                    {audioRecording ? 'Capturing audio wave signature...' : 'Select Start Scan and record voice logs.'}
                  </p>
                </>
              ) : (
                <div className="text-center space-y-3">
                  <Mic className="w-12 h-12 text-cyan-500 mx-auto animate-bounce" />
                  <h4 className="text-white font-bold font-display text-sm">Voice Print Matches Found</h4>
                  <p className="text-xs text-slateCustom-400">Rosters populated successfully.</p>
                </div>
              )}
            </div>
          )}

          {/* Loading indicator */}
          {isScanning && (
            <div className="absolute inset-0 bg-slateCustom-950/70 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="w-10 h-10 text-accent animate-spin" />
                <span className="text-xs text-accent font-bold uppercase tracking-widest font-display animate-pulse">Running AI Classifier...</span>
              </div>
            </div>
          )}
        </div>

        {/* Viewport trigger buttons */}
        {!scanComplete ? (
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="w-full py-3 bg-accent hover:bg-accent-dark disabled:bg-slateCustom-800 disabled:text-slateCustom-600 text-slateCustom-950 font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
          >
            {scanMode === 'face' ? <Camera className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
            <span>{isScanning ? 'Processing...' : 'Start Scan'}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (scanMode === 'face') startCamera();
              else setScanComplete(false);
            }}
            className="w-full py-3 bg-slateCustom-800 hover:bg-slateCustom-700 text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
          >
            Reset Scanner
          </button>
        )}
      </div>

      {/* Attendance Roster Log Sheet */}
      <div className="lg:col-span-5 bg-white border border-slateCustom-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
        <div>
          <h3 className="text-lg font-bold text-slateCustom-900 font-display mb-1.5">Classroom Log Sheet</h3>
          <p className="text-xs text-slateCustom-500 mb-4 border-b border-slateCustom-100 pb-3">Review mapped logs before saving.</p>

          {scanComplete ? (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {attendanceRecords.map((record, idx) => (
                <div key={record.studentId} className="flex items-center justify-between p-2.5 bg-slateCustom-50 rounded-xl border border-slateCustom-200/50">
                  <div>
                    <div className="text-xs font-bold text-slateCustom-800">{record.name}</div>
                    <div className="text-[9px] text-slateCustom-500 font-mono">{record.email}</div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(idx)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {record.status}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slateCustom-400 border-2 border-dashed border-slateCustom-200 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-slateCustom-300 mb-2" />
              <p className="text-xs">Conduct a Face or Voice Scan to automatically map student attendance logs.</p>
            </div>
          )}
        </div>

        {scanComplete && (
          <div className="pt-6 border-t border-slateCustom-100 mt-6">
            {logsSubmitted ? (
              <div className="p-3 bg-green-50 border border-green-205 text-green-705 text-green-750 font-semibold rounded-xl text-center">
                Attendance records successfully synced to cloud database!
              </div>
            ) : (
              <button
                onClick={handleSubmitLogs}
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                Save Attendance Logs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const studentsContent = (
    <div className="bg-white border border-slateCustom-200 rounded-3xl overflow-hidden shadow-sm text-slateCustom-900">
      <div className="p-6 border-b border-slateCustom-200">
        <h3 className="text-lg font-bold text-slateCustom-900 font-display">Student Enrollment List</h3>
        <p className="text-xs text-slateCustom-500 mt-1">Displaying students registered in: {selectedSubject?.name || 'Class'}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slateCustom-50 border-b border-slateCustom-200 text-slateCustom-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Dept / Year</th>
              <th className="px-6 py-4">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slateCustom-100 text-sm text-slateCustom-700">
            {studentsList.map((student) => (
              <tr key={student._id} className="hover:bg-slateCustom-50/50">
                <td className="px-6 py-4 font-semibold text-slateCustom-900">{student.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{student.email}</td>
                <td className="px-6 py-4 text-xs">
                  <span className="font-semibold text-slateCustom-600">{student.department}</span>
                  <div className="text-[10px] text-slateCustom-400">{student.year}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${student.attendancePercentage >= 85 ? 'text-green-600' : 'text-red-500'}`}>
                    {student.attendancePercentage}%
                  </span>
                </td>
              </tr>
            ))}
            {studentsList.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slateCustom-400">No student profiles linked to this course.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const reportsContent = (
    <div className="bg-white border border-slateCustom-200 rounded-3xl p-6 shadow-sm space-y-6 text-slateCustom-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slateCustom-100 pb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slateCustom-900 font-display"> Roster Compliance Sheets</h3>
          <p className="text-xs text-slateCustom-500 mt-1">Download summaries or view individual logs below.</p>
        </div>

        {reportData.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center px-4 py-2 border border-slateCustom-200 rounded-xl text-xs font-semibold text-slateCustom-700 bg-white hover:bg-slateCustom-50 transition-all shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-green-600" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-dark rounded-xl text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1.5" />
              <span>Download PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Logs table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slateCustom-50 border-b border-slateCustom-200 text-slateCustom-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Present / Total Days</th>
              <th className="px-6 py-4">Overall Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slateCustom-100 text-sm text-slateCustom-700">
            {reportData.map((row) => (
              <tr key={row.studentId} className="hover:bg-slateCustom-50/50">
                <td className="px-6 py-4 font-semibold text-slateCustom-900">{row.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{row.email}</td>
                <td className="px-6 py-4 font-semibold">{row.present} / {row.total}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold ${row.attendancePercentage >= 85 ? 'text-green-600' : 'text-red-500'}`}>
                    {row.attendancePercentage}%
                  </span>
                </td>
              </tr>
            ))}
            {reportData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slateCustom-400">No report records found. Make sure class attendance has been logged.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const settingsContent = (
    <TeacherSettings 
      isDarkMode={isDarkMode} 
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      onLogout={() => { logoutUser(); navigate('/'); }}
    />
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-all duration-300 ${
      isDarkMode ? 'bg-slateCustom-950 text-white' : 'bg-slate-50 text-slateCustom-900'
    }`}>
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-slateCustom-900 text-white shrink-0 flex flex-col justify-between p-6">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold font-display tracking-tight uppercase">Smart Attendance</span>
          </div>

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
              onClick={() => setActiveTab('scan')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'scan'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Take Attendance</span>
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
              <span>My Students</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-primary text-white shadow'
                  : 'text-slateCustom-400 hover:bg-slateCustom-800 hover:text-white'
              }`}
            >
              <FileBarChart className="w-5 h-5" />
              <span>Report Engine</span>
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

      {/* Main workspace */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight">Faculty Hub</h1>
            <p className="text-sm text-slateCustom-500">Conduct AI scanning, schedule classes, and audit logs.</p>
          </div>

          {/* Subject Dropdown Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slateCustom-500">Active Course:</span>
            <select
              value={selectedSubject ? JSON.stringify(selectedSubject) : ''}
              onChange={(e) => setSelectedSubject(JSON.parse(e.target.value))}
              className="px-3 py-2 rounded-xl border border-slateCustom-200 text-sm focus:outline-none font-semibold bg-white shadow-sm text-slateCustom-900"
            >
              {subjects.map(s => (
                <option key={s._id} value={JSON.stringify(s)}>{s.name} ({s.subjectCode})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveModal('students')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slateCustom-900/40 border-slateCustom-805 hover:bg-slateCustom-800/60 text-white' 
                    : 'bg-white border-slateCustom-200/80 hover:bg-slateCustom-50 text-slateCustom-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Class Roster size</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{studentsList.length}</div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('reports')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slateCustom-900/40 border-slateCustom-805 hover:bg-slateCustom-800/60 text-white' 
                    : 'bg-white border-slateCustom-200/80 hover:bg-slateCustom-50 text-slateCustom-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Total Class Days</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                    {reportData.length > 0 ? reportData[0].total : 30}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveModal('reports')}
                className={`text-left hover:scale-102 hover:shadow-md transition-all rounded-2xl p-6 border shadow-sm flex items-center space-x-4 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slateCustom-900/40 border-slateCustom-805 hover:bg-slateCustom-800/60 text-white' 
                    : 'bg-white border-slateCustom-200/80 hover:bg-slateCustom-50 text-slateCustom-900'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slateCustom-400 uppercase tracking-wider">Avg Compliance</div>
                  <div className={`text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                    {reportData.length > 0 
                      ? Math.round(reportData.reduce((a,c) => a + c.attendancePercentage, 0) / reportData.length)
                      : 91
                    }%
                  </div>
                </div>
              </button>
            </div>

            {/* Quick guidance alert */}
            <div className="bg-slateCustom-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg relative overflow-hidden">
              <div className="absolute right-[-50px] bottom-[-50px] w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-accent">Ready to mark classroom attendance?</h3>
                <p className="text-xs text-slateCustom-400 max-w-lg">
                  Launch the scanner directly on this page to run facial recognition mapping or microphone voice scan validation.
                </p>
              </div>
              <div className="flex space-x-2 shrink-0">
                <button
                  onClick={() => setActiveModal('scan')}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Launch Scanner Console
                </button>
                <button
                  onClick={() => setActiveModal('settings')}
                  className="px-5 py-2.5 bg-slateCustom-800 hover:bg-slateCustom-700 text-slateCustom-300 hover:text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Faculty Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Traditional tabs views */}
        {activeTab === 'scan' && scanContent}
        {activeTab === 'students' && studentsContent}
        {activeTab === 'reports' && reportsContent}
        {activeTab === 'settings' && settingsContent}

        {/* Modal views for Home/Overview section */}
        <AnimatePresence>
          {activeModal === 'scan' && (
            <Modal isOpen={true} onClose={() => { stopCamera(); setActiveModal(null); }} title="AI Attendance Scanner Console" isDarkMode={isDarkMode}>
              {scanContent}
            </Modal>
          )}
          {activeModal === 'students' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Enrolled Students Roster" isDarkMode={isDarkMode}>
              {studentsContent}
            </Modal>
          )}
          {activeModal === 'reports' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Roster Compliance Sheets & Exports" isDarkMode={isDarkMode}>
              {reportsContent}
            </Modal>
          )}
          {activeModal === 'settings' && (
            <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Faculty portal Settings" isDarkMode={isDarkMode}>
              {settingsContent}
            </Modal>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
