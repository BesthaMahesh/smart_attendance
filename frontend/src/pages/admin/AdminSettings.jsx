import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Bell, Lock, ShieldCheck, Trash2, 
  ShieldAlert, X, LogOut, CheckCircle, Save, Edit, 
  KeyRound, Eye, EyeOff, User, Mail, Database, Shield
} from 'lucide-react';
import api from '../../utils/api';

export default function AdminSettings({ isDarkMode, onToggleDarkMode, onLogout, user }) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Preference states (mock configurations synced to system setting state)
  const [autoSync, setAutoSync] = useState('Real-Time');
  const [attendancePenalty, setAttendancePenalty] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('85%');

  // Change Password Modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Delete Account Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.put('/admins/profile/change-password', {
        currentPassword,
        newPassword
      });
      setIsPasswordModalOpen(false);
      setSuccessMsg('Administrator password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to change admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmationName !== user.name) {
      setErrorMsg("Confirmation name does not match your account name.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await api.delete('/admins/profile/delete');
      alert("Administrator account deleted successfully.");
      onLogout();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to delete admin account.');
      setLoading(false);
      setIsDeleteModalOpen(false);
      setDeleteConfirmationName('');
    }
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to temporarily deactivate your administrative privileges? You will be signed out and require another active administrator to restore your access.")) {
      alert("Simulating administrative deactivation...");
      onLogout();
    }
  };

  const handleTerminateSessions = () => {
    setSuccessMsg("All other active device sessions have been terminated.");
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4.5 h-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center space-x-2">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Admin Account Card */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-sm ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slateCustom-100 dark:border-slateCustom-850">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-black uppercase font-display border border-primary/20">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className={`text-base font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
              {user?.name}
            </h3>
            <p className="text-xs text-slateCustom-500 font-mono">Role: Administrator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slateCustom-500">Name</label>
            <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
              isDarkMode ? 'bg-slateCustom-950/40 border-slateCustom-850 text-slateCustom-300' : 'bg-slate-50 border-slate-100 text-slateCustom-700'
            }`}>
              {user?.name}
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-slateCustom-500">Email Address</label>
            <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold ${
              isDarkMode ? 'bg-slateCustom-950/40 border-slateCustom-850 text-slateCustom-300' : 'bg-slate-50 border-slate-100 text-slateCustom-700'
            }`}>
              {user?.email}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slateCustom-100 dark:border-slateCustom-850">
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
              isDarkMode ? 'border-slateCustom-850 hover:bg-slateCustom-800 text-slateCustom-300' : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-600'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change Security Password</span>
          </button>
        </div>
      </div>

      {/* System Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Options */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            <Sun className="w-4.5 h-4.5 mr-2 text-primary" /> Appearance Setup
          </h3>

          <div className="flex items-center justify-between text-xs pt-2">
            <div>
              <span className="font-bold block">Theme Preference</span>
              <span className="text-[10px] text-slateCustom-450 block mt-0.5">Toggle between dark and light modes.</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                isDarkMode 
                  ? 'border-slateCustom-700 bg-slateCustom-800 text-amber-400' 
                  : 'border-slateCustom-200 bg-slateCustom-50 text-slateCustom-700 hover:bg-slateCustom-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="font-bold text-[10px] uppercase tracking-wider">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>

        {/* Database configurations */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            <Database className="w-4.5 h-4.5 mr-2 text-primary" /> Institution Roster Rules
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold block">Attendance Penalty Alert</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Highlight students under threshold.</span>
              </div>
              <button
                type="button"
                onClick={() => setAttendancePenalty(!attendancePenalty)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  attendancePenalty ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${attendancePenalty ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slateCustom-100 dark:border-slateCustom-850">
              <div>
                <span className="font-bold block">Local DB Sync Interval</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Define logs write push timing.</span>
              </div>
              <select
                value={autoSync}
                onChange={(e) => setAutoSync(e.target.value)}
                className={`px-3 py-1 bg-white border border-slateCustom-200 rounded-lg text-[10px] font-bold ${
                  isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                }`}
              >
                <option>Real-Time</option>
                <option>Every 5 Mins</option>
                <option>Hourly</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slateCustom-100 dark:border-slateCustom-850">
              <div>
                <span className="font-bold block">Alert Threshold Limit</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Warning line indicator.</span>
              </div>
              <select
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className={`px-3 py-1 bg-white border border-slateCustom-200 rounded-lg text-[10px] font-bold ${
                  isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                }`}
              >
                <option>85%</option>
                <option>80%</option>
                <option>75%</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* DANGER ZONE PANEL */}
      <div className={`border border-red-200/50 dark:border-red-950/40 rounded-3xl p-6 shadow-sm bg-red-500/[0.02] space-y-4`}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wide">Danger Zone</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-450' : 'text-slateCustom-500'}`}>
            Irreversible administrative account deletion, deactivation, and token sessions invalidations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
          <button
            onClick={handleDeactivate}
            className={`px-4 py-2 border border-red-500/35 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold text-red-500 transition-all`}
          >
            Deactivate Admin Account
          </button>
          <button
            onClick={handleTerminateSessions}
            className={`px-4 py-2 border border-slateCustom-300 dark:border-slateCustom-800 hover:bg-slateCustom-100 dark:hover:bg-slateCustom-800 rounded-xl text-xs font-bold transition-all ${
              isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'
            }`}
          >
            Logout All Other Sessions
          </button>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setIsPasswordModalOpen(false)}
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
                  <KeyRound className="w-5 h-5 mr-1.5 text-primary" /> Update Password
                </h3>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)} 
                  className={`p-1.5 rounded-full hover:bg-slateCustom-150 ${isDarkMode ? 'hover:bg-slateCustom-800' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary ${
                        isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                      }`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3.5 top-3 text-slateCustom-400 hover:text-slateCustom-600"
                    >
                      {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {loading ? 'Verifying...' : 'Save Password'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT DOUBLE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setIsDeleteModalOpen(false)}
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
              <div className="p-6 border-b border-slateCustom-100 dark:border-slateCustom-880 flex justify-between items-center bg-red-650/5">
                <h3 className="text-base font-bold font-display text-red-500 flex items-center">
                  <Trash2 className="w-5 h-5 mr-1.5" /> Dangerous: Confirm Admin Deletion
                </h3>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className={`p-1.5 rounded-full hover:bg-slateCustom-150 ${isDarkMode ? 'hover:bg-slateCustom-800' : ''}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className={`p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl leading-relaxed`}>
                  <strong>WARNING:</strong> This action is permanent and cannot be undone. All database records linked to your administrative privileges will be deleted. You cannot delete this account if it is the last administrator account in the system.
                </div>

                <div className="flex flex-col space-y-2 text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                    To confirm deletion, type your exact administrator account name <strong className="text-red-500">"{user?.name}"</strong> below:
                  </span>
                  <input
                    type="text"
                    required
                    value={deleteConfirmationName}
                    onChange={(e) => setDeleteConfirmationName(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-red-500 ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                    placeholder={user?.name}
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsDeleteModalOpen(false); setDeleteConfirmationName(''); }}
                    className={`w-1/2 py-2.5 rounded-xl border text-xs font-bold ${
                      isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800' : 'border-slateCustom-200 hover:bg-slateCustom-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmationName !== user?.name}
                    className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-slateCustom-800 text-white rounded-xl text-xs font-bold shadow transition-all"
                  >
                    {loading ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
