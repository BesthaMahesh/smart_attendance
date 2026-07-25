import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Clipboard, ArrowUpRight, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function StudentResults({ isDarkMode }) {
  const [selectedSemester, setSelectedSemester] = useState('Semester 3');

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3'];

  // Mock grade data for semesters
  const semesterGrades = {
    'Semester 1': {
      sgpa: 3.75,
      creditsEarned: 22,
      courses: [
        { code: 'CS101', name: 'Introduction to Programming', grade: 'A', points: 4.0, credits: 4 },
        { code: 'MTH101', name: 'Calculus & Algebra', grade: 'A-', points: 3.7, credits: 4 },
        { code: 'PHY101', name: 'Engineering Physics', grade: 'B+', points: 3.3, credits: 4 },
        { code: 'ENG101', name: 'Technical Writing', grade: 'A', points: 4.0, credits: 3 },
        { code: 'ECE101', name: 'Basic Electronics', grade: 'B', points: 3.0, credits: 3 },
        { code: 'CS101L', name: 'Programming Lab', grade: 'A+', points: 4.0, credits: 4 }
      ]
    },
    'Semester 2': {
      sgpa: 3.92,
      creditsEarned: 20,
      courses: [
        { code: 'CS201', name: 'Data Structures & Algorithms', grade: 'A+', points: 4.0, credits: 4 },
        { code: 'CS202', name: 'Discrete Mathematics', grade: 'A', points: 4.0, credits: 4 },
        { code: 'CS203', name: 'Computer Architecture', grade: 'A-', points: 3.7, credits: 4 },
        { code: 'MTH202', name: 'Probability & Statistics', grade: 'B+', points: 3.3, credits: 4 },
        { code: 'CS201L', name: 'Data Structures Lab', grade: 'A+', points: 4.0, credits: 4 }
      ]
    },
    'Semester 3': {
      sgpa: 3.85,
      creditsEarned: 18,
      courses: [
        { code: 'CS301', name: 'Artificial Intelligence', grade: 'A', points: 4.0, credits: 4 },
        { code: 'CS302', name: 'Database Management Systems', grade: 'A-', points: 3.7, credits: 4 },
        { code: 'CS303', name: 'Software Engineering & Design', grade: 'B+', points: 3.3, credits: 4 },
        { code: 'CS304', name: 'Theory of Computation', grade: 'A', points: 4.0, credits: 3 },
        { code: 'CS302L', name: 'Database Systems Lab', grade: 'A+', points: 4.0, credits: 3 }
      ]
    }
  };

  // GPA Progression Chart Data
  const gpaProgression = [
    { name: 'Sem 1', SGPA: 3.75, CGPA: 3.75 },
    { name: 'Sem 2', SGPA: 3.92, CGPA: 3.83 },
    { name: 'Sem 3', SGPA: 3.85, CGPA: 3.85 }
  ];

  const currentResult = semesterGrades[selectedSemester];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Academic Transcripts</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Track SGPA progressions, semester credits, and review grade logs.</p>
        </div>

        {/* Semester Toggle Selector */}
        <div className="flex space-x-1 bg-slateCustom-100 dark:bg-slateCustom-950 p-1 rounded-xl">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedSemester === sem
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slateCustom-500 hover:text-slateCustom-700'
              }`}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: SGPA Summary Card & GPA Progression Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Semester GPA Stats */}
        <div className={`lg:col-span-4 border rounded-3xl p-6 shadow-sm flex flex-col justify-between ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>
              Selected Semester Performance
            </span>
            <h3 className={`text-2xl font-black font-display mt-1 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
              {selectedSemester}
            </h3>
          </div>

          <div className="py-6 flex items-baseline space-x-2">
            <span className="text-5xl font-black font-mono text-primary">{currentResult.sgpa}</span>
            <span className={`text-sm ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-450'}`}>/ 4.00 SGPA</span>
          </div>

          <div className="border-t border-slateCustom-100 dark:border-slateCustom-850 pt-4 flex justify-between items-center text-xs">
            <span className={`font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Credits Earned:</span>
            <span className={`font-black font-mono ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{currentResult.creditsEarned} Credits</span>
          </div>
        </div>

        {/* GPA Progression Chart */}
        <div className={`lg:col-span-8 border rounded-3xl p-6 shadow-sm flex flex-col justify-between ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>GPA Progression Chart</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaProgression}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#E2E8F0"} />
                <XAxis dataKey="name" stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={10} tickLine={false} />
                <YAxis stroke={isDarkMode ? "#64748B" : "#94A3B8"} fontSize={10} domain={[3.0, 4.0]} tickLine={false} />
                <Tooltip 
                  contentStyle={isDarkMode ? { backgroundColor: '#1e293b', border: '1px solid #475569', color: '#fff' } : {}}
                />
                <Bar dataKey="SGPA" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="CGPA" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-[10px] font-bold uppercase tracking-wider mt-4">
            <div className="flex items-center space-x-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded bg-primary"></span>
              <span>Semester SGPA</span>
            </div>
            <div className="flex items-center space-x-1.5 text-accent">
              <span className="w-2.5 h-2.5 rounded bg-accent"></span>
              <span>Cumulative CGPA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Grades Ledger Table */}
      <div className={`border rounded-3xl p-6 shadow-sm overflow-hidden ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <h3 className={`text-base font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Transcript Grade Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'border-slateCustom-800 text-slateCustom-450' : 'border-slateCustom-100 text-slateCustom-500'
              } font-bold uppercase tracking-wider`}>
                <th className="py-3 px-4">Course Code</th>
                <th className="py-3 px-4">Course Description</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4 text-center">Grade Letter</th>
                <th className="py-3 px-4 text-right">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {currentResult.courses.map((course) => (
                <tr 
                  key={course.code}
                  className={`border-b transition-colors ${
                    isDarkMode 
                      ? 'border-slateCustom-850/60 hover:bg-slateCustom-850/30' 
                      : 'border-slateCustom-50 hover:bg-slateCustom-50/60'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-medium text-primary">{course.code}</td>
                  <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'}`}>{course.name}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{course.credits}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex justify-center items-center w-8 py-0.5 rounded text-[10px] font-bold ${
                      course.grade.startsWith('A') 
                        ? 'bg-green-500/10 text-green-500' 
                        : course.grade.startsWith('B') 
                          ? 'bg-indigo-500/10 text-indigo-500' 
                          : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slateCustom-500">{course.points.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
