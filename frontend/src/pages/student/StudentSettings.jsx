import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Globe, Bell, Eye, Lock, 
  HelpCircle, ShieldCheck, Trash2, ShieldAlert, X, LogOut, CheckCircle
} from 'lucide-react';
import api from '../../utils/api';

export default function StudentSettings({ isDarkMode, onToggleDarkMode, onLogout }) {
  const [language, setLanguage] = useState('English');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  
  const [profilePublic, setProfilePublic] = useState(true);
  const [showGPA, setShowGPA] = useState(true);

  // Profile and Action states
  const [profile, setProfile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get('/students/profile/me');
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile details in settings:', err);
      }
    };
    fetchMe();
  }, []);

  const handleDeleteAccount = async () => {
    if (!profile) return;
    if (deleteConfirmationName !== profile.name) {
      setErrorMsg("Confirmation name does not match your profile name.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await api.delete('/students/profile/delete');
      alert("Your student account has been successfully deleted from our records.");
      onLogout(); // Log user out
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to delete account.');
      setLoading(false);
    }
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your profile? You will be signed out and unable to check-in at classrooms until an administrator reactivates you.")) {
      alert("Deactivating student profile...");
      onLogout();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>Portal Settings</h2>
        <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Customize dashboard appearance, language, notification preferences, and privacy logs.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 text-green-500 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl flex items-center space-x-2">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
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

          <div className="flex items-center justify-between text-xs pt-4 border-t border-slateCustom-100 dark:border-slateCustom-850">
            <div>
              <span className="font-bold block">Language Locale</span>
              <span className="text-[10px] text-slateCustom-450 block mt-0.5">Translate portal metrics vocabulary.</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none focus:border-primary bg-white ${
                isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
              }`}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Telugu</option>
            </select>
          </div>
        </div>

        {/* Notifications preferences */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            <Bell className="w-4.5 h-4.5 mr-2 text-primary" /> Notification Channels
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold block">Email Notifications</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Send attendance warnings and grade alerts to email.</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  emailAlerts ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${emailAlerts ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slateCustom-100 dark:border-slateCustom-850">
              <div>
                <span className="font-bold block">Push Notifications</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Trigger browser popups on active class scan events.</span>
              </div>
              <button
                type="button"
                onClick={() => setPushAlerts(!pushAlerts)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  pushAlerts ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${pushAlerts ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slateCustom-100 dark:border-slateCustom-850">
              <div>
                <span className="font-bold block">SMS Mobile Alerts</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Relay daily check-in logs directly via cell number.</span>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  smsAlerts ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${smsAlerts ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Privacy preferences */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            <Eye className="w-4.5 h-4.5 mr-2 text-primary" /> Privacy Settings
          </h3>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold block">Roster Visibility</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Allow search visibility to other campus members.</span>
              </div>
              <button
                type="button"
                onClick={() => setProfilePublic(!profilePublic)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  profilePublic ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${profilePublic ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slateCustom-100 dark:border-slateCustom-850">
              <div>
                <span className="font-bold block">Hide GPA stats</span>
                <span className="text-[10px] text-slateCustom-450 mt-0.5 block">Do not expose SGPA charts to peer dashboard scoreboards.</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGPA(!showGPA)}
                className={`w-10 h-5.5 rounded-full transition-all relative p-0.5 ${
                  showGPA ? 'bg-primary' : 'bg-slateCustom-300 dark:bg-slateCustom-700'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-all shadow ${showGPA ? 'translate-x-4.5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Support panel */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          <h3 className={`text-sm font-bold font-display flex items-center ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>
            <Lock className="w-4.5 h-4.5 mr-2 text-primary" /> Compliance Certification
          </h3>
          <div className="p-4 rounded-2xl bg-primary/10 text-primary text-xs space-y-2 leading-relaxed">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
              <span>ERP Security Standard Verified</span>
            </div>
            <p>
              Your Smart Attendance Pro profile adheres to FERPA student record regulations and uses AES encrypted vector landmarks storage for camera scan probes.
            </p>
          </div>
        </div>
      </div>

      {/* DANGER ZONE PANEL */}
      <div className={`border border-red-200/50 dark:border-red-950/40 rounded-3xl p-6 shadow-sm bg-red-500/[0.02] space-y-4`}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-red-500 uppercase tracking-wide">Danger Zone</h3>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-450' : 'text-slateCustom-500'}`}>Irreversible student credentials alterations and logins security cleanup.</p>
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
            Deactivate Account
          </button>
          <button
            onClick={() => alert("Invalidated all alternate user devices sessions tokens successfully.")}
            className={`px-4 py-2 border border-slateCustom-300 dark:border-slateCustom-800 hover:bg-slateCustom-100 dark:hover:bg-slateCustom-800 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-600'}`}
          >
            Logout All Devices
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT DOUBLE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && profile && (
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
              <div className="p-6 border-b border-slateCustom-100 dark:border-slateCustom-800 flex justify-between items-center bg-red-600/5">
                <h3 className="text-base font-bold font-display text-red-500 flex items-center">
                  <Trash2 className="w-5 h-5 mr-1.5" /> Dangerous: Confirm Account Deletion
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
                  <strong>WARNING:</strong> This action is permanent and cannot be undone. All your face mappings, course attendance percentages, and credentials will be deleted from the database.
                </div>

                <div className="flex flex-col space-y-2 text-xs">
                  <span className={`font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>
                    To confirm, please type your exact profile name <strong className="text-red-500">"{profile.name}"</strong> below:
                  </span>
                  <input
                    type="text"
                    required
                    value={deleteConfirmationName}
                    onChange={(e) => setDeleteConfirmationName(e.target.value)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-red-500 ${
                      isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200'
                    }`}
                    placeholder={profile.name}
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
                    disabled={loading || deleteConfirmationName !== profile.name}
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
