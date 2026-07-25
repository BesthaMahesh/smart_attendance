import React from 'react';
import { Clock, MapPin, User, BookOpen } from 'lucide-react';

export default function StudentTimetable({ isDarkMode }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM'];

  // Timetable grid matrix mapping [day][timeSlot] to class details
  const scheduleMatrix = {
    'Monday': {
      '09:00 AM': { code: 'CS301', name: 'Artificial Intelligence', room: 'Lab-3', teacher: 'Dr. Sarah Connor' },
      '12:00 PM': { code: 'CS303', name: 'Software Engineering', room: 'Room-402', teacher: 'Prof. Alan Turing' },
      '03:00 PM': { code: 'CS302L', name: 'Database Systems Lab', room: 'Lab-1', teacher: 'Dr. E.F. Codd' }
    },
    'Tuesday': {
      '10:30 AM': { code: 'CS302', name: 'Database Management Systems', room: 'Room-405', teacher: 'Dr. E.F. Codd' },
      '01:30 PM': { code: 'CS304', name: 'Theory of Computation', room: 'Seminar Hall-1', teacher: 'Prof. Noam Chomsky' }
    },
    'Wednesday': {
      '09:00 AM': { code: 'CS301', name: 'Artificial Intelligence', room: 'Lab-3', teacher: 'Dr. Sarah Connor' },
      '12:00 PM': { code: 'CS303', name: 'Software Engineering', room: 'Room-402', teacher: 'Prof. Alan Turing' }
    },
    'Thursday': {
      '10:30 AM': { code: 'CS302', name: 'Database Management Systems', room: 'Room-405', teacher: 'Dr. E.F. Codd' },
      '01:30 PM': { code: 'CS304', name: 'Theory of Computation', room: 'Seminar Hall-1', teacher: 'Prof. Noam Chomsky' }
    },
    'Friday': {
      '09:00 AM': { code: 'CS301', name: 'Artificial Intelligence Lab', room: 'Lab-3', teacher: 'Dr. Sarah Connor' },
      '03:00 PM': { code: 'CS302L', name: 'Database Systems Lab', room: 'Lab-1', teacher: 'Dr. E.F. Codd' }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Weekly Timetable</h2>
        <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>View weekly lecture intervals, classroom codes, and subject details.</p>
      </div>

      {/* Structured grid of timetable */}
      <div className={`border rounded-3xl p-6 shadow-sm overflow-x-auto ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <div className="min-w-[700px] space-y-4">
          {/* Hour slots header */}
          <div className="grid grid-cols-6 gap-4 text-center pb-2 border-b border-slateCustom-100 dark:border-slateCustom-800">
            <div className={`text-xs font-bold text-left pl-4 ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Day</div>
            {timeSlots.map(slot => (
              <div key={slot} className="text-[10px] font-bold uppercase tracking-wider text-slateCustom-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slateCustom-400" />
                <span>{slot}</span>
              </div>
            ))}
          </div>

          {/* Days content rows */}
          <div className="space-y-3">
            {days.map(day => (
              <div 
                key={day} 
                className={`grid grid-cols-6 gap-4 items-center p-3 rounded-2xl border ${
                  isDarkMode 
                    ? 'border-slateCustom-850/65 bg-slateCustom-950/10' 
                    : 'border-slateCustom-100 bg-slateCustom-50/50'
                }`}
              >
                <div className={`text-sm font-bold pl-2 ${isDarkMode ? 'text-white' : 'text-slateCustom-800'}`}>{day}</div>
                
                {timeSlots.map(slot => {
                  const subject = scheduleMatrix[day]?.[slot];
                  if (!subject) {
                    return (
                      <div key={slot} className="h-16 rounded-xl border border-dashed border-slateCustom-200 dark:border-slateCustom-850 flex items-center justify-center">
                        <span className="text-[10px] text-slateCustom-400 dark:text-slateCustom-500">-</span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={slot}
                      className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary flex flex-col justify-between h-16 overflow-hidden relative"
                    >
                      <div className="truncate font-bold text-[10px] leading-tight font-display">{subject.name}</div>
                      <div className="flex justify-between items-center mt-1 text-[8px] font-semibold text-slateCustom-500 font-mono">
                        <span className="flex items-center"><MapPin className="w-2.5 h-2.5 mr-0.5" /> {subject.room}</span>
                        <span className="truncate">{subject.code}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
