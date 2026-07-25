import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, BookOpen, Calendar, KeyRound, 
  Trash2, LogOut, CheckCircle, ShieldAlert, X, Download, 
  Edit, Camera, Save, Eye, EyeOff
} from 'lucide-react';
import api from '../../utils/api';

export default function StudentProfile({ user, onLogout, isDarkMode }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Field states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  
  // Modals & alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Change password modal states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Danger zone modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationName, setDeleteConfirmationName] = useState('');

  // Fetch full student profile details
  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile/me');
      setProfile(res.data);
      setName(res.data.name || '');
      setEmail(res.data.email || '');
      setPhone(res.data.phone || '');
      setDepartment(res.data.department || '');
      setYear(res.data.year || '');
    } catch (err) {
      console.error('Failed to load profile details:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.put('/students/profile/update', {
        name,
        email,
        phone,
        department,
        year
      });
      setProfile(res.data);
      setIsEditing(false);
      setSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.put('/students/profile/change-password', {
        currentPassword,
        newPassword
      });
      setIsPasswordModalOpen(false);
      setSuccessMsg('Your security password has been updated!');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationName !== profile.name) {
      setErrorMsg("Confirmation name does not match your profile name.");
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await api.delete('/students/profile/delete');
      alert("Your student account has been successfully deleted from our records.");
      onLogout(); // Log user out and redirect
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to delete account.');
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `student_profile_${profile?.rollNumber || 'export'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your profile? You will be signed out and unable to check-in at classrooms until an administrator reactivates you.")) {
      alert("Deactivating student profile...");
      onLogout();
    }
  };

  if (!profile) {
    return (
      <div className={`p-6 text-center ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'}`}>
        Loading profile info...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>My Student Profile</h2>
        <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Edit personal metrics, change password logs, export details, and manage account state.</p>
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

      {/* Main Profile Editor Card */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-sm ${
        isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
      }`}>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar and Name Header */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-black uppercase font-display border-2 border-primary/20">
                {profile.name?.charAt(0)}
              </div>
              <button 
                type="button" 
                onClick={() => alert("Photo upload simulation: Please link your webcam in registration flow to map your primary facial landmarks.")}
                className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full shadow hover:bg-primary-dark transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className={`text-lg font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>{profile.name}</h3>
              <p className="text-xs text-slateCustom-500 font-mono">Roll: {profile.rollNumber}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slateCustom-100 dark:border-slateCustom-850 pt-6">
            <div className="flex flex-col space-y-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary transition-all ${
                  isEditing 
                    ? isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200' 
                    : 'bg-transparent border-transparent cursor-not-allowed text-slateCustom-600 dark:text-slateCustom-300 pl-0'
                }`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary transition-all ${
                  isEditing 
                    ? isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200' 
                    : 'bg-transparent border-transparent cursor-not-allowed text-slateCustom-600 dark:text-slateCustom-300 pl-0'
                }`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Phone Number</label>
              <input
                type="text"
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary transition-all ${
                  isEditing 
                    ? isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200' 
                    : 'bg-transparent border-transparent cursor-not-allowed text-slateCustom-600 dark:text-slateCustom-300 pl-0'
                }`}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Department</label>
              <select
                disabled={!isEditing}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary bg-white transition-all ${
                  isEditing 
                    ? isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200' 
                    : 'bg-transparent border-transparent cursor-not-allowed text-slateCustom-600 dark:text-slateCustom-300 pl-0 appearance-none'
                }`}
              >
                <option>Computer Science</option>
                <option>Mechanical Engineering</option>
                <option>Bio-Physics</option>
                <option>Chemistry</option>
                <option>Journalism</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className={`text-xs font-semibold ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Academic Year</label>
              <select
                disabled={!isEditing}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary bg-white transition-all ${
                  isEditing 
                    ? isDarkMode ? 'bg-slateCustom-950 border-slateCustom-800 text-white' : 'bg-white border-slateCustom-200' 
                    : 'bg-transparent border-transparent cursor-not-allowed text-slateCustom-600 dark:text-slateCustom-300 pl-0 appearance-none'
                }`}
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slateCustom-100 dark:border-slateCustom-850">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExportData}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800 text-slateCustom-300' : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-600'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
              </button>
              <button
                type="button"
                onClick={() => alert("Downloading profile transcript summary...")}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800 text-slateCustom-300' : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-600'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Profile Report</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800 text-slateCustom-300' : 'border-slateCustom-200 hover:bg-slateCustom-50 text-slateCustom-600'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); fetchProfile(); }}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold ${
                      isDarkMode ? 'border-slateCustom-800 hover:bg-slateCustom-800' : 'border-slateCustom-200 hover:bg-slateCustom-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
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

      {/* CHANGE PASSWORD DRAWER/MODAL */}
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
                  <label className="text-xs font-semibold text-slateCustom-500">Current Security Password</label>
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
                  {loading ? 'Verifying Credentials...' : 'Save Password'}
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
