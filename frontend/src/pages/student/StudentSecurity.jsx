import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Cpu, Eye, LogOut, CheckCircle, RefreshCw, KeyRound } from 'lucide-react';

export default function StudentSecurity({ isDarkMode }) {
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11 (Current)', ip: '192.168.1.4', location: 'Hyderabad, IN', active: 'Just Now' },
    { id: 2, device: 'Safari on iPhone 15 Pro', ip: '103.45.21.90', location: 'Hyderabad, IN', active: '4 hours ago' },
    { id: 3, device: 'Firefox on Macbook Pro', ip: '82.190.12.43', location: 'Bengaluru, IN', active: '2 days ago' }
  ]);

  const [faceLogs, setFaceLogs] = useState([
    { id: 1, timestamp: 'June 15, 2026, 10:12 AM', confidence: '98.8%', status: 'Success', node: 'Main Entry Terminal 1' },
    { id: 2, timestamp: 'June 15, 2026, 09:02 AM', confidence: '97.4%', status: 'Success', node: 'Lecture Hall 3 Scanner' },
    { id: 3, timestamp: 'June 14, 2026, 01:15 PM', confidence: '62.1%', status: 'Failed', node: 'Library Gate Scanner (Poor Light)' },
    { id: 4, timestamp: 'June 12, 2026, 10:05 AM', confidence: '99.1%', status: 'Success', node: 'Main Entry Terminal 1' }
  ]);

  const [recoveryEmail, setRecoveryEmail] = useState('parker.peter@rgmcet.edu.in');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleRevokeSession = (id) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Security Logs & Audits</h2>
        <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Monitor face landmarks matching trails, device sessions, and account recovery configurations.</p>
      </div>

      {/* Row 1: Session Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Device Sessions */}
        <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm flex flex-col justify-between ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Active Login Sessions</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {activeSessions.map((session) => (
                  <motion.div 
                    key={session.id} 
                    exit={{ opacity: 0, x: -10 }}
                    className={`p-3.5 rounded-xl border flex justify-between items-center text-xs ${
                      isDarkMode ? 'border-slateCustom-800 bg-slateCustom-950/20' : 'border-slateCustom-150 bg-white'
                    }`}
                  >
                    <div>
                      <div className={`font-bold flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-850'}`}>
                        <Cpu className="w-4 h-4 mr-1.5 text-primary shrink-0" />
                        {session.device}
                      </div>
                      <div className="text-[10px] text-slateCustom-500 font-mono mt-0.5">
                        IP: {session.ip} • {session.location}
                      </div>
                    </div>
                    
                    {session.id === 1 ? (
                      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-500 hover:underline font-bold text-[10px]"
                      >
                        Terminate
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Account Recovery */}
        <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm flex flex-col justify-between ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <div className="space-y-4">
            <h3 className={`text-base font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Account Recovery & 2FA</h3>
            
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-slateCustom-500">Backup Recovery Email</label>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary ${
                  isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                }`}
              />
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
              isDarkMode ? 'bg-slateCustom-950/20 border-slateCustom-800' : 'bg-slateCustom-50 border-slateCustom-100'
            }`}>
              <div>
                <span className="font-bold block">Two-Factor Authentication (2FA)</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Requires mobile authenticator code next to Face Recognition checks.</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-11 h-6 rounded-full transition-all relative p-1 ${
                  twoFactorEnabled ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Face Login History Table */}
      <div className={`border rounded-3xl p-6 shadow-sm overflow-hidden ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <h3 className={`text-base font-bold font-display mb-4 ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Facial Authentication Audit Trail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'border-slateCustom-800 text-slateCustom-450' : 'border-slateCustom-100 text-slateCustom-500'
              } font-bold uppercase tracking-wider`}>
                <th className="py-3 px-4">Log Timestamp</th>
                <th className="py-3 px-4">Verification Terminal</th>
                <th className="py-3 px-4 text-center">Landmarks Confidence</th>
                <th className="py-3 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody>
              {faceLogs.map((log) => (
                <tr 
                  key={log.id}
                  className={`border-b transition-colors ${
                    isDarkMode 
                      ? 'border-slateCustom-850/60 hover:bg-slateCustom-850/30' 
                      : 'border-slateCustom-50 hover:bg-slateCustom-50/60'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-medium">{log.timestamp}</td>
                  <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-white' : 'text-slateCustom-950'}`}>{log.node}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slateCustom-500">{log.confidence}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === 'Success' 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
