import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Check, Trash2, Calendar, FileText, 
  Sparkles, Megaphone, CheckSquare, ShieldCheck, Mail
} from 'lucide-react';

export default function StudentNotifications({ isDarkMode }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI Attendance Checked', desc: 'Your face embedding matched in "Artificial Intelligence" lecture class. Logged: PRESENT.', category: 'attendance', date: 'Today, 10:14 AM', read: false },
    { id: 2, title: 'Submission Due Warning', desc: 'Assignment 2 (Backpropagation Neural Nets) is due in 48 hours. Submit solution file.', category: 'deadline', date: 'Today, 08:30 AM', read: false },
    { id: 3, title: 'Placement Alert: Google Internship', desc: 'Google has posted summer internship opportunities for 3rd-year CS students. GPA criteria: 3.5+.', category: 'placement', date: 'Yesterday', read: true },
    { id: 4, title: 'End-Semester Timetable Released', date: '2 days ago', category: 'exam', desc: 'Final exam slots are approved. Please verify your seat codes and Hall Ticket status.', read: true },
    { id: 5, title: 'Message from Dr. Sarah Connor', date: '3 days ago', category: 'faculty', desc: 'Please review the pre-class notes on Multi-layer Perceptrons before Wednesday lab.', read: true }
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) return { ...notif, read: true };
      return notif;
    }));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Notifications Feed</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>View attendance warnings, deadline logs, and placement postings.</p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-red-200 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold text-red-500 transition-all shrink-0 bg-red-50/10"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Grid Alert Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notif) => {
            let catColor = "bg-primary/10 text-primary";
            if (notif.category === 'deadline') catColor = "bg-amber-500/15 text-amber-500";
            else if (notif.category === 'placement') catColor = "bg-green-500/15 text-green-500";
            else if (notif.category === 'exam') catColor = "bg-red-500/15 text-red-500";
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  notif.read 
                    ? isDarkMode ? 'bg-slateCustom-900/10 border-slateCustom-850' : 'bg-slateCustom-50/40 border-slateCustom-100'
                    : isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800 shadow-sm border-l-4 border-l-primary' : 'bg-white border-slateCustom-200 shadow-sm border-l-4 border-l-primary'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl ${catColor} shrink-0 mt-0.5`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'} leading-tight`}>{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'}`}>{notif.desc}</p>
                    <span className="text-[9px] text-slateCustom-400 block font-mono mt-0.5">{notif.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 justify-end shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className={`p-1.5 rounded-lg border hover:bg-green-600 hover:text-white transition-all text-slateCustom-450 hover:border-green-600 ${
                        isDarkMode ? 'border-slateCustom-850 bg-slateCustom-900/50' : 'border-slateCustom-200 bg-white'
                      }`}
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg border border-red-200/50 hover:bg-red-500 hover:text-white transition-all text-red-500 bg-red-50/20"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className={`text-center py-12 border-2 border-dashed rounded-3xl ${
            isDarkMode ? 'border-slateCustom-800 text-slateCustom-500' : 'border-slateCustom-200 text-slateCustom-400'
          }`}>
            <Bell className="w-8 h-8 mx-auto mb-2 text-slateCustom-300" />
            <p className="text-sm">Your notifications tray is clean!</p>
          </div>
        )}
      </div>
    </div>
  );
}
