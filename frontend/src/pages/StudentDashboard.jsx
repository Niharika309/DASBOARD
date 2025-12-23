import { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, GraduationCap, Calendar,
    LogOut, Edit3, Save, CheckCircle, AlertCircle, Lock, X
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout, updateProfile } = useAuth();
    const [profile, setProfile] = useState({
        _id: '',
        name: '',
        email: '',
        course: '',
        enrollmentDate: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile(user);
            setLoading(false);
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put(`${API_URL}/students/${user._id}`, profile, config);

            // Update local storage and context state
            updateProfile(data);

            setIsEditing(false);
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Update failed');
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            showMessage('error', 'New passwords do not match');
            return;
        }
        if (passwordData.new.length < 6) {
            showMessage('error', 'Password must be at least 6 characters long');
            return;
        }
        setUpdating(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`${API_URL}/students/${user._id}`, { password: passwordData.new }, config);
            showMessage('success', 'Password updated successfully!');
            setShowPasswordModal(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Password update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
            <div className="bg-mesh"></div>

            <nav className="w-full max-w-5xl glass-card p-4 mb-10 flex items-center justify-between">
                <div className="flex items-center gap-4 px-2">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2.5 rounded-xl shadow-lg shadow-pink-500/20">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Student Portal
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Academic Session 2024 • Active</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="group flex items-center gap-3 px-5 py-2.5 bg-slate-800/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 rounded-xl transition-all duration-300"
                >
                    <span className="text-sm font-bold uppercase tracking-wider hidden sm:inline">Terminate Session</span>
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-3xl"
            >
                <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
                    {/* Header Banner */}
                    <div className="h-40 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="absolute -bottom-14 left-10 p-1.5 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl">
                            <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[1.7rem] flex items-center justify-center text-5xl font-black text-white shadow-inner">
                                {profile.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute top-6 right-8">
                            <div className="px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300">
                                Verified Scholar
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 p-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h2 className="text-4xl font-black tracking-tight text-white mb-1">{profile.name}</h2>
                                <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-xs">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                                    Student Enrollment Record
                                </div>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-3 px-6 py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider"
                                >
                                    <Edit3 className="w-4 h-4" /> Modify Profile
                                </button>
                            )}
                        </div>

                        {message.text && (
                            <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        className={`pl-10 ${!isEditing && 'bg-transparent border-transparent cursor-default'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        disabled={!isEditing}
                                        value={profile.email}
                                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                                        className={`pl-10 ${!isEditing && 'bg-transparent border-transparent cursor-default'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Current Course</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={profile.course}
                                        onChange={e => setProfile({ ...profile, course: e.target.value })}
                                        className={`pl-10 ${!isEditing && 'bg-transparent border-transparent cursor-default'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Member Since</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        disabled
                                        value={new Date(profile.enrollmentDate).toLocaleDateString()}
                                        className="pl-10 bg-transparent border-transparent cursor-default opacity-60"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="md:col-span-2 flex gap-4 mt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" /> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setProfile(user);
                                        }}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>

                        {!isEditing && (
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-indigo-400" /> Security
                                </h3>
                                <div className="glass-card p-6 bg-indigo-500/5">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <div className="font-semibold">Update Password</div>
                                            <div className="text-sm text-gray-400">Manage your account security by updating your password.</div>
                                        </div>
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-md p-6"
                        >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Lock className="w-5 h-5 text-indigo-400" />
                                Update Password
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ current: '', new: '', confirm: '' });
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Enter new password"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        className="pl-10"
                                        required
                                        disabled={updating}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        className="pl-10"
                                        required
                                        disabled={updating}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Update Password
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({ current: '', new: '', confirm: '' });
                                    }}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors"
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </div>
    );
};



export default StudentDashboard;
