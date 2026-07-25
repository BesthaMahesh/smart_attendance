import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Eye, Download, FileText, Calendar, 
  User, CheckCircle, Clock, AlertCircle, X, ShieldAlert, Award
} from 'lucide-react';
import api from '../../utils/api';

export default function StudentCourses({ subjects, studentId, onRefresh, isDarkMode }) {
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all subjects in the system for the enrollment dialog
  const fetchAllSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setAllSubjects(res.data);
    } catch (err) {
      console.error('Failed to fetch all subjects:', err);
    }
  };

  useEffect(() => {
    if (isEnrollModalOpen) {
      fetchAllSubjects();
    }
  }, [isEnrollModalOpen]);

  const handleEnroll = async (subjectId) => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.put(`/subjects/${subjectId}`, {
        action: 'enroll',
        studentId
      });
      setMessage('Successfully enrolled in course!');
      onRefresh(); // Refresh parent dashboard lists
      // Refresh available list
      setTimeout(() => {
        fetchAllSubjects();
        setMessage('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll in subject.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (subjectId) => {
    if (!window.confirm("Are you sure you want to drop this course? Your attendance records will remain saved but you will be removed from the active roster.")) return;
    
    setLoading(true);
    setError('');
    try {
      await api.put(`/subjects/${subjectId}`, {
        action: 'unenroll',
        studentId
      });
      onRefresh();
      if (selectedCourse && selectedCourse._id === subjectId) {
        setSelectedCourse(null);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to drop subject.');
    } finally {
      setLoading(false);
    }
  };

  // Filter out subjects student is already enrolled in
  const enrolledIds = subjects.map(s => s._id);
  const joinableSubjects = allSubjects.filter(sub => !enrolledIds.includes(sub._id));

  // Mock course details helper
  const getMockDetails = (course) => {
    return {
      credits: course.credits || 4,
      schedule: course.schedule || "Mon/Wed 10:00 AM - 11:30 AM",
      materials: [
        { id: 1, name: "Lecture_01_Introduction.pdf", size: "2.4 MB" },
        { id: 2, name: "Lecture_02_Core_Concepts.pdf", size: "3.1 MB" },
        { id: 3, name: "Homework_01_Instructions.docx", size: "512 KB" }
      ],
      assignments: [
        { id: 1, name: "Homework 1: Fundamentals", deadline: "June 20, 2026", status: "Submitted", score: "92/100" },
        { id: 2, name: "Midterm Project: Design & Architecture", deadline: "July 05, 2026", status: "Pending", score: null },
        { id: 3, name: "Quiz 2: Concept Map Verification", deadline: "June 18, 2026", status: "Late", score: "80/100" }
      ]
    };
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>My Enrolled Courses</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Browse schedules, notes, and submit assignments.</p>
        </div>
        <button
          onClick={() => setIsEnrollModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll in Course</span>
        </button>
      </div>

      {/* Courses Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((course) => {
          const details = getMockDetails(course);
          return (
            <motion.div
              key={course._id}
              layout
              className={`rounded-2xl border p-5 ${
                isDarkMode 
                  ? 'bg-slateCustom-900/40 border-slateCustom-800' 
                  : 'bg-white border-slateCustom-200/80 shadow-sm'
              } flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                    {course.subjectCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDarkMode ? 'bg-slateCustom-800 text-slateCustom-400' : 'bg-slateCustom-100 text-slateCustom-600'
                  }`}>
                    {details.credits} Credits
                  </span>
                </div>
                <h3 className={`text-base font-bold font-display mt-3 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                  {course.name}
                </h3>
                <div className="mt-2 space-y-1">
                  <p className={`text-xs flex items-center ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                    <User className="w-3.5 h-3.5 mr-1 text-slateCustom-400" />
                    Faculty: <strong className={`ml-1 ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{course.teacher?.name || 'Assigned Staff'}</strong>
                  </p>
                  <p className={`text-xs flex items-center ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slateCustom-400" />
                    Section: <span className="ml-1 font-semibold">{course.section}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slateCustom-100 dark:border-slateCustom-800 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Course Rate:</span>
                  <span className="text-sm font-black text-primary">85%</span> {/* Default baseline average */}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className={`p-2 rounded-lg border hover:bg-primary hover:text-white transition-all text-slateCustom-500 hover:border-primary ${
                      isDarkMode ? 'border-slateCustom-850 bg-slateCustom-900/50' : 'border-slateCustom-200 bg-white'
                    }`}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert('Starting PDF Download for ' + course.name + '...')}
                    className={`p-2 rounded-lg border hover:bg-green-600 hover:text-white transition-all text-slateCustom-500 hover:border-green-600 ${
                      isDarkMode ? 'border-slateCustom-850 bg-slateCustom-900/50' : 'border-slateCustom-200 bg-white'
                    }`}
                    title="Download Syllabus"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDrop(course._id)}
                    className="p-2 rounded-lg border border-red-200/50 hover:bg-red-500 hover:text-white transition-all text-red-500 bg-red-50/20"
                    title="Drop Course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {subjects.length === 0 && (
          <div className={`col-span-2 text-center py-12 border-2 border-dashed rounded-3xl ${
            isDarkMode ? 'border-slateCustom-800 text-slateCustom-500' : 'border-slateCustom-200 text-slateCustom-400'
          }`}>
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slateCustom-300" />
            <p className="text-sm">No courses enrolled yet.</p>
            <p className="text-xs text-slateCustom-500 mt-1">Click "Enroll in Course" to begin joining schedules.</p>
          </div>
        )}
      </div>

      {/* VIEW DETAILS DRAWER/MODAL */}
      <AnimatePresence>
        {selectedCourse && (() => {
          const details = getMockDetails(selectedCourse);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl ${
                  isDarkMode ? 'bg-slateCustom-900 text-white' : 'bg-white text-slateCustom-900'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-slateCustom-100 dark:border-slateCustom-800 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                      {selectedCourse.subjectCode}
                    </span>
                    <h3 className="text-lg font-bold font-display">{selectedCourse.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(null)} 
                    className={`p-1.5 rounded-full hover:bg-slateCustom-150 ${isDarkMode ? 'hover:bg-slateCustom-800' : ''}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                  {/* Info row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slateCustom-950/30 border-slateCustom-800' : 'bg-slateCustom-50 border-slateCustom-100'}`}>
                      <span className="text-[10px] uppercase font-bold text-slateCustom-400 block mb-1">Faculty Mentor</span>
                      <div className="text-sm font-semibold">{selectedCourse.teacher?.name || 'Staff'}</div>
                      <div className="text-xs text-slateCustom-500 font-mono mt-0.5">{selectedCourse.teacher?.email || 'staff@rgmcet.edu.in'}</div>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slateCustom-950/30 border-slateCustom-800' : 'bg-slateCustom-50 border-slateCustom-100'}`}>
                      <span className="text-[10px] uppercase font-bold text-slateCustom-400 block mb-1">Lecture Schedule</span>
                      <div className="text-sm font-semibold">{details.schedule}</div>
                      <div className="text-xs text-slateCustom-500 mt-0.5 font-bold">Classroom section {selectedCourse.section}</div>
                    </div>
                  </div>

                  {/* Study Notes */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold font-display flex items-center">
                      <FileText className="w-4 h-4 mr-1.5 text-primary" /> Download Course Notes
                    </h4>
                    <div className="space-y-2">
                      {details.materials.map((file) => (
                        <div 
                          key={file.id} 
                          className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                            isDarkMode ? 'border-slateCustom-800 bg-slateCustom-950/20' : 'border-slateCustom-150 bg-white'
                          }`}
                        >
                          <span className="font-semibold truncate">{file.name}</span>
                          <div className="flex items-center space-x-3 shrink-0">
                            <span className="text-slateCustom-400 font-mono">{file.size}</span>
                            <button 
                              onClick={() => alert(`Starting download for ${file.name}`)}
                              className="text-primary hover:underline font-bold"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assignments */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold font-display flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-primary" /> Assignment Submission Check
                    </h4>
                    <div className="space-y-2">
                      {details.assignments.map((task) => (
                        <div 
                          key={task.id} 
                          className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                            isDarkMode ? 'border-slateCustom-800 bg-slateCustom-950/20' : 'border-slateCustom-150 bg-white'
                          }`}
                        >
                          <div>
                            <span className="font-semibold block">{task.name}</span>
                            <span className="text-[10px] text-slateCustom-450 block mt-0.5">Due date: {task.deadline}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.status === 'Submitted' 
                                ? 'bg-green-500/10 text-green-500' 
                                : task.status === 'Late' 
                                  ? 'bg-amber-500/10 text-amber-500' 
                                  : 'bg-red-500/10 text-red-500'
                            }`}>
                              {task.status}
                            </span>
                            {task.score && <span className="font-mono font-bold text-slateCustom-500">{task.score}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ENROLL MODAL */}
      <AnimatePresence>
        {isEnrollModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setIsEnrollModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl ${
                isDarkMode ? 'bg-slateCustom-900 text-white' : 'bg-white text-slateCustom-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slateCustom-100 dark:border-slateCustom-800 flex justify-between items-center">
                <h3 className="text-lg font-bold font-display flex items-center">
                  <Plus className="w-5 h-5 mr-1.5 text-primary" /> Browse Available Courses
                </h3>
                <button 
                  onClick={() => setIsEnrollModalOpen(false)} 
                  className={`p-1.5 rounded-full hover:bg-slateCustom-150 ${isDarkMode ? 'hover:bg-slateCustom-800' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {message && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center space-x-2">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-3">
                  {joinableSubjects.map((sub) => (
                    <div 
                      key={sub._id}
                      className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                        isDarkMode ? 'border-slateCustom-800 bg-slateCustom-950/20 hover:bg-slateCustom-850' : 'border-slateCustom-150 bg-white hover:bg-slateCustom-50'
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                          {sub.subjectCode}
                        </span>
                        <h4 className="text-sm font-bold font-display mt-2">{sub.name}</h4>
                        <span className="text-[10px] text-slateCustom-500 mt-1 block">Instructor: {sub.teacher?.name || 'Assigned Staff'}</span>
                      </div>
                      <button
                        onClick={() => handleEnroll(sub._id)}
                        disabled={loading}
                        className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark disabled:bg-slateCustom-800 text-white rounded-lg text-xs font-bold shadow"
                      >
                        Enroll
                      </button>
                    </div>
                  ))}

                  {joinableSubjects.length === 0 && (
                    <div className="text-center py-6 text-xs text-slateCustom-500 font-medium">
                      All system subjects already enrolled or no subjects found in database!
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
