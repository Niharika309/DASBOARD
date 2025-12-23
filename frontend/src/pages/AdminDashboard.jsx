import { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, UserPlus, LogOut, Edit2, Trash2, Search,
    X, Save, CheckCircle, GraduationCap
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingStudent, setEditingStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', course: '', password: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get(`${API_URL}/students`, config);
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`${API_URL}/students/${id}`, config);
            setStudents(students.filter(s => s._id !== id));
            showMessage('success', 'Student deleted successfully');
            setShowDeleteConfirm(null);
        } catch (error) {
            showMessage('error', 'Failed to delete student');
        } finally {
            setDeletingId(null);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put(`${API_URL}/students/${editingStudent._id}`, editingStudent, config);
            setStudents(students.map(s => s._id === data._id ? data : s));
            setEditingStudent(null);
            showMessage('success', 'Student updated successfully');
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Update failed');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.post(`${API_URL}/students`, newStudent, config);
            setStudents([data, ...students]);
            setShowAddModal(false);
            setNewStudent({ name: '', email: '', course: '', password: '' });
            showMessage('success', 'Student added successfully');
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Failed to add student');
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Background mesh */}
            <div className="fixed inset-0 z-[-1] opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full"></div>
            </div>

            {/* Header */}
            <nav className="mx-4 mt-6 mb-8">
                <div className="max-w-7xl mx-auto glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 px-2">
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Administration
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">System Active • {user.name}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="group flex items-center gap-3 px-5 py-2.5 bg-slate-800/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 rounded-xl transition-all duration-300"
                    >
                        <span className="text-sm font-bold uppercase tracking-wider">Session End</span>
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </nav>

            <main className="container mx-auto px-4 mt-8">
                {/* Actions Bar */}
                <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center justify-between">
                    <div className="relative w-full max-w-xl group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by student name, email, or course..."
                            className="pl-12 py-4 bg-slate-900/40 border-white/5 focus:bg-slate-900/60 transition-all rounded-2xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-3 px-8 py-4 w-full lg:w-auto text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-600/20"
                    >
                        <UserPlus className="w-5 h-5" /> Enlist New Student
                    </button>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-5 rounded-2xl mb-10 flex items-center justify-between border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                    >
                        <div className="flex items-center gap-3 font-semibold">
                            <CheckCircle className="w-6 h-6" /> {message.text}
                        </div>
                        <button onClick={() => setMessage({ text: '' })} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Table/List */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-sm">
                                    <th className="p-4 font-semibold">Student</th>
                                    <th className="p-4 font-semibold">Course</th>
                                    <th className="p-4 font-semibold">Enrolled</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                                <p className="text-gray-400">Loading students...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Users className="w-12 h-12 text-gray-600" />
                                                <p className="text-gray-400">No students found</p>
                                                {searchTerm && (
                                                    <p className="text-sm text-gray-500">Try adjusting your search</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredStudents.map((s) => (
                                    <motion.tr
                                        layout
                                        key={s._id}
                                        className="hover:bg-white/5 transition-colors table-row-hover"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{s.name}</div>
                                                    <div className="text-xs text-gray-500">{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">
                                                {s.course}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(s.enrollmentDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingStudent({ ...s })}
                                                className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                title="Edit student"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(s._id)}
                                                className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                                                title="Delete student"
                                                disabled={deletingId === s._id}
                                            >
                                                {deletingId === s._id ? (
                                                    <div className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin"></div>
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-md p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-indigo-400" />
                                    Edit Student
                                </h2>
                                <button 
                                    onClick={() => setEditingStudent(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Full Name
                                    </label>
                                    <input
                                        placeholder="John Doe"
                                        value={editingStudent.name}
                                        onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Course
                                    </label>
                                    <input
                                        placeholder="MERN Bootcamp"
                                        value={editingStudent.course}
                                        onChange={e => setEditingStudent({ ...editingStudent, course: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                                        <Save className="w-5 h-5" /> Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingStudent(null)}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-md p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-indigo-400" />
                                    Add New Student
                                </h2>
                                <button 
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setNewStudent({ name: '', email: '', course: '', password: '' });
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Full Name
                                    </label>
                                    <input
                                        placeholder="John Doe"
                                        value={newStudent.name}
                                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={newStudent.email}
                                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Course
                                    </label>
                                    <input
                                        placeholder="MERN Bootcamp"
                                        value={newStudent.course}
                                        onChange={e => setNewStudent({ ...newStudent, course: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider font-bold">
                                        Password <span className="text-gray-500 normal-case">(optional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Leave empty for default password"
                                        value={newStudent.password}
                                        onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="submit" className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                                        <UserPlus className="w-5 h-5" /> Create Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setNewStudent({ name: '', email: '', course: '', password: '' });
                                        }}
                                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-md p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-rose-400">
                                    <Trash2 className="w-5 h-5" />
                                    Confirm Deletion
                                </h2>
                                <button 
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete this student? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    disabled={deletingId === showDeleteConfirm}
                                >
                                    {deletingId === showDeleteConfirm ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors"
                                    disabled={deletingId === showDeleteConfirm}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
