import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/students', config);
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`/api/students/${id}`, config);
            setStudents(students.filter(s => s._id !== id));
            showMessage('success', 'Student deleted successfully');
        } catch (error) {
            showMessage('error', 'Failed to delete student');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.put(`/api/students/${editingStudent._id}`, editingStudent, config);
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
            const { data } = await axios.post('/api/students', newStudent, config);
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
        <div className="min-h-screen pb-20">
            {/* Header */}
            <nav className="glass-card sticky top-0 z-40 m-4 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 p-2 rounded-xl">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Admin Dashboard</h1>
                        <p className="text-xs text-gray-400">Welcome, {user.name}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </nav>

            <main className="container mx-auto px-4 mt-8">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="pl-10 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2 px-6 py-3 w-full md:w-auto"
                    >
                        <UserPlus className="w-5 h-5" /> Add Student
                    </button>
                </div>

                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                    >
                        <CheckCircle className="w-5 h-5" /> {message.text}
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
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Loading students...</td></tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">No students found</td></tr>
                                ) : filteredStudents.map((s) => (
                                    <motion.tr
                                        layout
                                        key={s._id}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                                    {s.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{s.name}</div>
                                                    <div className="text-xs text-gray-500">{s.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium">
                                                {s.course}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(s.enrollmentDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                onClick={() => setEditingStudent({ ...s })}
                                                className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
                                <h2 className="text-xl font-bold">Edit Student</h2>
                                <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-white">
                                    <X />
                                </button>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                                    <input
                                        value={editingStudent.name}
                                        onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Email Address</label>
                                    <input
                                        type="email"
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Course</label>
                                    <input
                                        value={editingStudent.course}
                                        onChange={e => setEditingStudent({ ...editingStudent, course: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2">
                                    <Save className="w-5 h-5" /> Save Changes
                                </button>
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
                                <h2 className="text-xl font-bold">Add New Student</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                                    <X />
                                </button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <input
                                    placeholder="Full Name"
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={newStudent.email}
                                    onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Course"
                                    value={newStudent.course}
                                    onChange={e => setNewStudent({ ...newStudent, course: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password (optional, default: password123)"
                                    value={newStudent.password}
                                    onChange={e => setNewStudent({ ...newStudent, password: e.target.value })}
                                />
                                <button type="submit" className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2">
                                    <UserPlus className="w-5 h-5" /> Create Student
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
