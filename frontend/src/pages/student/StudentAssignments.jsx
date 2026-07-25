import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle2, AlertTriangle, UploadCloud, 
  X, CheckCircle, ShieldAlert, BookOpen
} from 'lucide-react';

export default function StudentAssignments({ isDarkMode }) {
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Assignment 2: Feedforward Networks & Backpropagation', subject: 'Artificial Intelligence', deadline: 'June 22, 2026', points: '100 pts', status: 'Pending', type: 'homework' },
    { id: 2, title: 'Term Project Proposal & DB Schema Design', subject: 'Database Systems', deadline: 'June 29, 2026', points: '150 pts', status: 'Pending', type: 'project' },
    { id: 3, title: 'Lab exercise 3: B-Tree Indexes & Node Partitioning', subject: 'Database Systems', deadline: 'June 12, 2026', points: '50 pts', status: 'Submitted', type: 'lab', score: '48/50' },
    { id: 4, title: 'Assignment 1: State Space Search Methods', subject: 'Artificial Intelligence', deadline: 'June 05, 2026', points: '100 pts', status: 'Graded', type: 'homework', score: '95/100' },
    { id: 5, title: 'Software Specification Document (SRS) Draft', subject: 'Software Engineering', deadline: 'June 08, 2026', points: '100 pts', status: 'Late', type: 'homework', score: '82/100' }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setLoading(true);

    setTimeout(() => {
      setAssignments(prev => prev.map(task => {
        if (task.id === selectedTask.id) {
          return { ...task, status: 'Submitted' };
        }
        return task;
      }));
      setLoading(false);
      setMessage('Assignment document uploaded successfully!');
      setTimeout(() => {
        setMessage('');
        setSelectedTask(null);
        setUploadFile(null);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Assignments Tracker</h2>
        <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Monitor homework logs, due dates, credits, and upload solution files.</p>
      </div>

      <div className="space-y-4">
        {assignments.map((task) => {
          let statusBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slateCustom-100 text-slateCustom-600 dark:bg-slateCustom-800 dark:text-slateCustom-400">
              {task.status}
            </span>
          );
          if (task.status === 'Submitted') {
            statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Submitted
              </span>
            );
          } else if (task.status === 'Graded') {
            statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Graded
              </span>
            );
          } else if (task.status === 'Late') {
            statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500">
                <AlertTriangle className="w-3 h-3 mr-1" /> Late
              </span>
            );
          } else if (task.status === 'Pending') {
            statusBadge = (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500">
                <Clock className="w-3 h-3 mr-1" /> Pending
              </span>
            );
          }

          return (
            <div 
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                isDarkMode 
                  ? 'bg-slateCustom-900/40 border-slateCustom-800 hover:bg-slateCustom-850/50' 
                  : 'bg-white border-slateCustom-200 hover:shadow-sm'
              } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}
            >
              <div className="flex items-start space-x-3.5">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slateCustom-800 text-primary' : 'bg-primary/5 text-primary'} shrink-0`}>
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <span className={`text-[10px] font-bold font-display px-2 py-0.5 rounded ${
                    task.type === 'project' 
                      ? 'bg-indigo-500/15 text-indigo-500' 
                      : task.type === 'lab' 
                        ? 'bg-green-500/15 text-green-500' 
                        : 'bg-primary/10 text-primary'
                  }`}>
                    {task.subject}
                  </span>
                  <h3 className={`text-sm font-bold mt-1.5 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{task.title}</h3>
                  <div className="flex items-center space-x-3 text-[10px] text-slateCustom-400">
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Due: {task.deadline}</span>
                    <span className="font-bold">{task.points}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 justify-end shrink-0">
                {statusBadge}
                {task.score && <span className="text-xs font-black font-mono text-slateCustom-500">{task.score}</span>}
                {task.status === 'Pending' && (
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold shadow transition-all"
                  >
                    Upload Solution
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD SUBMISSION MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`w-full max-w-md rounded-3xl overflow-hidden shadow-2xl ${
                isDarkMode ? 'bg-slateCustom-900 text-white' : 'bg-white text-slateCustom-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slateCustom-100 dark:border-slateCustom-800 flex justify-between items-center">
                <h3 className="text-base font-bold font-display flex items-center">
                  <UploadCloud className="w-5 h-5 mr-1.5 text-primary" /> Submit Solution
                </h3>
                <button 
                  onClick={() => setSelectedTask(null)} 
                  className={`p-1.5 rounded-full hover:bg-slateCustom-150 ${isDarkMode ? 'hover:bg-slateCustom-800' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                {message && (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-xl flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <div className="text-xs space-y-1">
                  <span className="text-slateCustom-400">Target Assignment:</span>
                  <div className="font-bold">{selectedTask.title}</div>
                  <div className="text-[10px] text-primary">{selectedTask.subject}</div>
                </div>

                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  uploadFile 
                    ? 'border-green-500/60 bg-green-500/5' 
                    : 'border-slateCustom-300 hover:border-primary dark:border-slateCustom-800'
                }`}>
                  <input
                    type="file"
                    id="assignment-file"
                    required
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label htmlFor="assignment-file" className="cursor-pointer space-y-2 block">
                    <UploadCloud className={`w-8 h-8 mx-auto ${uploadFile ? 'text-green-500 animate-bounce' : 'text-slateCustom-400'}`} />
                    <div className="text-xs font-semibold">
                      {uploadFile ? uploadFile.name : 'Click to browse assignment file'}
                    </div>
                    <div className="text-[10px] text-slateCustom-400">PDF, ZIP, DOCX up to 10MB</div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !uploadFile}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark disabled:bg-slateCustom-800 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {loading ? 'Uploading Solution...' : 'Submit Assignment'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
