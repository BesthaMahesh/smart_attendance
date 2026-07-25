import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CreditCard, ShieldAlert, Download, Award } from 'lucide-react';

export default function StudentExams({ isDarkMode }) {
  const exams = [
    { id: 1, subject: 'Artificial Intelligence', code: 'CS102', date: 'July 15, 2026', time: '10:00 AM - 01:00 PM', room: 'Block A, Room 302', seat: 'A-34', type: 'End-Semester' },
    { id: 2, subject: 'Database Systems', code: 'CS105', date: 'July 18, 2026', time: '10:00 AM - 01:00 PM', room: 'Block B, Seminar Hall', seat: 'B-12', type: 'End-Semester' },
    { id: 3, subject: 'Software Engineering', code: 'CS108', date: 'July 21, 2026', time: '02:00 PM - 05:00 PM', room: 'Block A, Room 405', seat: 'A-19', type: 'End-Semester' }
  ];

  const handleDownloadHallTicket = () => {
    alert("Downloading Hall Ticket PDF...\nStudent: Peter Parker (CS102)\nStatus: Approved\nEnsure to carry a physical copy and campus ID card.");
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Exams & Schedules</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Check exam schedules, room seat configurations, and download hall tickets.</p>
        </div>
        <button
          onClick={handleDownloadHallTicket}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow transition-all shrink-0"
        >
          <CreditCard className="w-4 h-4" />
          <span>Download Hall Ticket</span>
        </button>
      </div>

      {/* Roster Warning Info */}
      <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
        isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50/60 border-amber-200 text-amber-700'
      }`}>
        <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-amber-500 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Attendance Eligibility Check</span>
          <p className="leading-relaxed">
            Ensure your cumulative attendance rate stays above **85%** in each subject. Students falling below this threshold will be flagged and excluded from the Hall Ticket approval roster.
          </p>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={`rounded-2xl border p-5 ${
              isDarkMode 
                ? 'bg-slateCustom-900/40 border-slateCustom-800' 
                : 'bg-white border-slateCustom-200/80 shadow-sm'
            } flex flex-col justify-between space-y-4`}
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                  {exam.code}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  isDarkMode ? 'bg-slateCustom-850 text-slateCustom-400' : 'bg-slateCustom-100 text-slateCustom-500'
                }`}>
                  {exam.type}
                </span>
              </div>
              <h3 className={`text-sm font-bold font-display mt-3 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
                {exam.subject}
              </h3>
            </div>

            <div className="border-t border-slateCustom-100 dark:border-slateCustom-850 pt-4 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-slateCustom-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className={`font-semibold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{exam.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-slateCustom-500">
                <Clock className="w-3.5 h-3.5" />
                <span className={`font-mono font-bold ${isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-700'}`}>{exam.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-slateCustom-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className={isDarkMode ? 'text-slateCustom-300' : 'text-slateCustom-600'}>{exam.room}</span>
              </div>
              <div className="flex items-center space-x-2 text-slateCustom-500">
                <Award className="w-3.5 h-3.5" />
                <span>Seat Allocation: <strong className={isDarkMode ? 'text-white' : 'text-slateCustom-900'}>{exam.seat}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
