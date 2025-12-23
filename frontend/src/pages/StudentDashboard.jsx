import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    User, Mail, GraduationCap, Calendar,
    LogOut, Edit3, Save, CheckCircle, AlertCircle, Lock
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
            const { data } = await axios.put(`/api/students/${user._id}`, profile, config);

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

    const handlePasswordUpdate = async (newPassword) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.put(`/api/students/${user._id}`, { password: newPassword }, config);
            showMessage('success', 'Password updated successfully!');
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Password update failed');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
            <nav className="w-full max-w-4xl glass-card p-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-pink-500 p-2 rounded-xl">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="font-bold text-xl hidden sm:block">Student Portal</h1>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <div className="glass-card overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-pink-600 relative">
                        <div className="absolute -bottom-12 left-8 p-1 bg-slate-900 rounded-2xl">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center text-4xl font-bold text-white">
                                {profile.name?.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold">{profile.name}</h2>
                                <p className="text-indigo-400 font-medium">Student Account</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20"
                                >
                                    <Edit3 className="w-4 h-4" /> Edit Profile
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
                                            onClick={() => {
                                                const newPass = prompt("Enter new password:");
                                                if (newPass) handlePasswordUpdate(newPass);
                                            }}
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
        </div>
    );
};



export default StudentDashboard;
