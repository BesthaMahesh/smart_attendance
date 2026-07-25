import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import api from '../utils/api';
import Webcam from 'react-webcam';
import { GraduationCap, ArrowLeft, Camera, ShieldAlert, Sparkles, UserPlus, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherRegisterPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  // Form states
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [subject, setSubject] = useState('Artificial Intelligence');

  // Capture samples state
  const [samples, setSamples] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showShutterFlash, setShowShutterFlash] = useState(false);

  useEffect(() => {
    let intervalId = null;
    if (isCapturing && samples.length < 15) {
      intervalId = setInterval(() => {
        captureSample();
      }, 350);
    } else if (samples.length === 15) {
      setIsCapturing(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCapturing, samples]);

  const captureSample = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setSamples(prev => [...prev, screenshot]);
        setShowShutterFlash(true);
        setTimeout(() => setShowShutterFlash(false), 80);
      }
    }
  };

  const handleStartCapture = (e) => {
    e.preventDefault();
    if (!name || !employeeId || !email || !subject) {
      setErrorMessage("Please fill out all teacher profile fields first.");
      return;
    }
    setErrorMessage('');
    setSamples([]);
    setIsCapturing(true);
  };

  const handleRegister = async () => {
    if (samples.length < 15) {
      setErrorMessage("Please capture 15 face samples before registering.");
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.post('/auth/register-teacher-face', {
        name,
        employeeId,
        email,
        department,
        subject,
        images: samples
      });

      const { token, user } = res.data;
      setSuccessMessage("Teacher roster profile created successfully!");

      setTimeout(() => {
        loginUser(token, user);
        navigate('/teacher');
      }, 1500);

    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.error || 'Failed to register teacher face profile.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <div className="absolute top-[-25%] left-[-25%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-25%] right-[-25%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-3xl"></div>

      {/* Back to Login Link */}
      <div className="absolute top-6 left-6">
        <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slateCustom-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Login
        </Link>
      </div>

      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <GraduationCap className="h-10 w-10 text-primary mr-2" />
          <span className="text-2xl font-bold font-display tracking-tight text-slateCustom-900">
            Smart Attendance <span className="text-primary font-extrabold">Pro</span>
          </span>
        </div>

        <div className="w-full bg-white rounded-3xl border border-slateCustom-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Panel: Roster Details */}
          <div className="p-8 border-r border-slateCustom-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slateCustom-900 font-display">Teacher Enrollment</h1>
                <p className="text-xs text-slateCustom-500 leading-relaxed">Fill out registration metrics and map face samples.</p>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-xs flex items-start space-x-1.5">
                  <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-700 text-xs flex items-start space-x-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-green-500 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. Dr. Sarah Connor"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Employee ID</label>
                  <input
                    type="text"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                    placeholder="e.g. EMP-001"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-slateCustom-500">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                    placeholder="name@institution.edu"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slateCustom-500">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="px-3 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary bg-white"
                    >
                      <option>Computer Science</option>
                      <option>Neuroscience</option>
                      <option>Mathematics</option>
                      <option>Bio-Physics</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-semibold text-slateCustom-500">Primary Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-slateCustom-200 text-sm focus:outline-none focus:border-primary"
                      placeholder="e.g. Artificial Intelligence"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slateCustom-100">
              <button
                onClick={handleRegister}
                disabled={loading || samples.length < 15}
                className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-slateCustom-200 disabled:text-slateCustom-400 text-white rounded-xl font-semibold text-sm transition-all shadow flex items-center justify-center space-x-2"
              >
                {loading ? <RefreshCw className="w-4.5 h-4.5 animate-spin" /> : <UserPlus className="w-4.5 h-4.5" />}
                <span>{loading ? 'Generating Embeddings...' : 'Enroll & Sign In'}</span>
              </button>
            </div>
          </div>

          {/* Right Panel: Camera Scan Interface */}
          <div className="p-8 bg-slateCustom-900 text-white flex flex-col justify-between items-center relative">
            <AnimatePresence>
              {showShutterFlash && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-20 pointer-events-none"
                ></motion.div>
              )}
            </AnimatePresence>

            <div className="w-full text-center mb-4 border-b border-slateCustom-800 pb-4">
              <h3 className="text-sm font-bold font-display text-accent uppercase tracking-wider">Face Sample Capturer</h3>
              <p className="text-[10px] text-slateCustom-400">Capture 15 distinct facial features frames.</p>
            </div>

            <div className="relative w-full aspect-video bg-slateCustom-950 rounded-2xl border border-slateCustom-850 overflow-hidden flex items-center justify-center">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />

              {isCapturing && <div className="scan-line"></div>}

              {samples.length > 0 && (
                <div className="absolute top-3 right-3 bg-accent/90 text-slateCustom-950 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse">
                  {samples.length}/15 samples
                </div>
              )}
            </div>

            <div className="w-full mt-4 space-y-1">
              <div className="flex justify-between text-[10px] text-slateCustom-400">
                <span>Calibration Progress</span>
                <span className="font-bold text-accent">{Math.round((samples.length / 15) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slateCustom-800 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(samples.length / 15) * 100}%` }}></div>
              </div>
            </div>

            <div className="w-full mt-6">
              {!isCapturing && samples.length < 15 ? (
                <button
                  onClick={handleStartCapture}
                  className="w-full py-3 bg-accent hover:bg-accent-dark text-slateCustom-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow"
                >
                  <Camera className="w-4.5 h-4.5" />
                  <span>Start Face Calibration</span>
                </button>
              ) : isCapturing ? (
                <div className="w-full py-3 bg-slateCustom-800 text-accent font-bold rounded-xl text-xs uppercase tracking-wider text-center animate-pulse">
                  Keep facing screen...
                </div>
              ) : (
                <button
                  onClick={() => { setSamples([]); setErrorMessage(''); }}
                  className="w-full py-3 border border-slateCustom-800 text-slateCustom-400 hover:text-white rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Re-calibrate Face Samples
                </button>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-1.5 text-slateCustom-500 text-[9px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Embedding calibration processes standard 128 landmarks vectors.</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
