import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';
import Webcam from 'react-webcam';
import { 
  GraduationCap, Camera, ShieldAlert, Sparkles, UserCheck, UserX, KeyRound, 
  HelpCircle, Monitor, ArrowRight, RefreshCw, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student'); // 'student', 'teacher', 'admin'
  
  // Webcam & capture state
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle', 'success', 'failed'
  const [errorMessage, setErrorMessage] = useState('');

  // Admin login credentials (empty by default for manual entry)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Automatically start webcam when switching tabs
  useEffect(() => {
    setAuthStatus('idle');
    setErrorMessage('');
    if (activeTab === 'admin') {
      setCameraActive(false);
    } else {
      setCameraActive(true);
    }
  }, [activeTab]);

  const captureFrameAndLogin = async () => {
    if (!webcamRef.current) return;
    
    setIsProcessing(true);
    setAuthStatus('idle');
    setErrorMessage('');

    try {
      // Capture screenshot from webcam (base64 string)
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error("Failed to capture video feed. Make sure camera is enabled.");
      }

      // Call Express login API
      const res = await api.post('/auth/face-login', {
        probe: imageSrc,
        role: activeTab
      });

      const { token, user } = res.data;
      setAuthStatus('success');

      // Wait 1.5s to show success state before redirecting
      setTimeout(() => {
        loginUser(token, user);
        if (user.role === 'teacher') navigate('/teacher');
        else navigate('/student');
      }, 1500);

    } catch (err) {
      console.error(err);
      setAuthStatus('failed');
      setErrorMessage(err.response?.data?.error || err.message || 'Face comparison failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Traditional login only for Admin
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/login', {
        email: adminEmail,
        password: adminPassword
      });

      const { token, user } = res.data;
      loginUser(token, user);
      navigate('/admin');
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Invalid Admin credentials.');
    } finally {
      setIsProcessing(false);
    }
  };

  const portalMeta = {
    student: {
      title: "Student Face Scan Portal",
      desc: "Contactless face authentication. Aligns with standard class-enrollment rosters.",
      btnText: "Authenticate Face",
      regLink: "/register-student"
    },
    teacher: {
      title: "Teacher Face Scan Console",
      desc: "Activate faculty profile scan to manage classrooms and grade logs.",
      btnText: "Authenticate Face",
      regLink: "/register-teacher"
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-[-25%] left-[-25%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-25%] right-[-25%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <GraduationCap className="h-10 w-10 text-primary mr-2" />
          <span className="text-2xl font-bold font-display tracking-tight text-slateCustom-900">
            Smart Attendance <span className="text-primary font-extrabold">Pro</span>
          </span>
        </div>

        {/* Portal card */}
        <div className="w-full bg-white rounded-3xl border border-slateCustom-200/80 shadow-xl overflow-hidden flex flex-col">
          {/* Tabs switch */}
          <div className="grid grid-cols-3 border-b border-slateCustom-200 bg-slateCustom-50 p-1.5 gap-1">
            {['student', 'teacher', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveTab(role)}
                className={`py-2 text-xs font-semibold rounded-xl uppercase tracking-wider transition-all ${
                  activeTab === role
                    ? 'bg-white text-primary shadow-sm border border-slateCustom-200/60'
                    : 'text-slateCustom-500 hover:text-slateCustom-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="p-8 flex flex-col space-y-6">
            {/* Header info */}
            {activeTab !== 'admin' ? (
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-slateCustom-900 font-display">
                  {portalMeta[activeTab].title}
                </h1>
                <p className="text-xs text-slateCustom-500 leading-relaxed">
                  {portalMeta[activeTab].desc}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-slateCustom-900 font-display">Admin Portal Access</h1>
                <p className="text-xs text-slateCustom-500 leading-relaxed">Traditional credentials login exclusively for administrators.</p>
              </div>
            )}

            {/* ERROR CARD */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2 text-red-700 text-xs"
              >
                <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* PORTAL INTERFACE VIEWPORTS */}
            {activeTab !== 'admin' && (
              <div className="flex flex-col space-y-4">
                {/* Webcam Box */}
                <div className="relative aspect-video rounded-2xl bg-slateCustom-950 border border-slateCustom-850 overflow-hidden flex items-center justify-center shadow-inner">
                  {cameraActive && (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                      className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                    />
                  )}

                  {/* Neon scan-line overlay */}
                  {isProcessing && <div className="scan-line"></div>}

                  {/* Processing Overlay Screen */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slateCustom-950/70 flex flex-col items-center justify-center space-y-3"
                      >
                        <RefreshCw className="w-9 h-9 text-accent animate-spin" />
                        <span className="text-xs text-accent font-bold uppercase tracking-widest font-display animate-pulse">Scanning facial profile...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Success Overlay Screen */}
                  <AnimatePresence>
                    {authStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-green-950/90 flex flex-col items-center justify-center space-y-2 text-white"
                      >
                        <UserCheck className="w-12 h-12 text-green-400" />
                        <span className="text-sm font-bold font-display tracking-wide uppercase">Recognized Successfully</span>
                        <span className="text-xs text-green-300">Setting up credentials...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Failed / Not Registered Overlay Screen */}
                  <AnimatePresence>
                    {authStatus === 'failed' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slateCustom-950/90 flex flex-col items-center justify-center p-6 space-y-3 text-white text-center"
                      >
                        <UserX className="w-10 h-10 text-red-400" />
                        <span className="text-sm font-bold font-display text-red-200">Identity Not Recognized</span>
                        <p className="text-[10px] text-slateCustom-400 max-w-xs">
                          Your face embedding is not registered in our database roster.
                        </p>
                        <button
                          onClick={() => navigate(portalMeta[activeTab].regLink)}
                          className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow transition-all flex items-center space-x-1"
                        >
                          <span>Register Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Authenticate Trigger Button */}
                {authStatus !== 'success' && (
                  <button
                    onClick={captureFrameAndLogin}
                    disabled={isProcessing}
                    className="w-full py-3 bg-accent hover:bg-accent-dark disabled:bg-slateCustom-800 text-slateCustom-950 font-bold rounded-xl text-sm transition-all shadow flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4.5 h-4.5" />
                    <span>{portalMeta[activeTab].btnText}</span>
                  </button>
                )}

                {/* Not Registered Link helper */}
                {authStatus !== 'failed' && (
                  <div className="text-center">
                    <span className="text-xs text-slateCustom-500">Unregistered? </span>
                    <Link to={portalMeta[activeTab].regLink} className="text-xs font-semibold text-primary hover:underline">Register face profile</Link>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN LOGIN VIEWPORT */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isProcessing ? 'Verifying...' : 'Sign In Admin'}</span>
                </button>
              </form>
            )}

            {/* Test credentials highlight helper */}
            {activeTab !== 'admin' && (
              <div className="bg-slateCustom-50 rounded-2xl p-4 border border-slateCustom-200/60 flex flex-col space-y-2">
                <div className="flex items-center space-x-1.5 text-slateCustom-800">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold font-display">Test Login Profiles</span>
                </div>
                <div className="text-[10px] text-slateCustom-600 space-y-1 leading-relaxed">
                  {activeTab === 'student' && <div>Capture your face. The database has pre-seeded **Peter Parker** matching embeddings for tests.</div>}
                  {activeTab === 'teacher' && <div>Capture your face. The database has pre-seeded **Sarah Connor** matching embeddings for tests.</div>}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slateCustom-400 leading-relaxed">
          Identity matching runs via edge webcam captures,<br />
          relayed to a state-less Python face recognition microservice.
        </p>
      </div>
    </div>
  );
}
