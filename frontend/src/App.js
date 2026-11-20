import React, { useState, useEffect } from 'react';
import { Upload, LogOut, User, BookOpen, FileText, Download, Trash2, Eye, AlertCircle, Users, FileCheck, Sparkles, GraduationCap, Star, TrendingUp, Search, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [notes, setNotes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [stats, setStats] = useState({ totalNotes: 0, totalTeachers: 0, totalStudents: 0 });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: '',
    teacherId: '',
    description: '',
    file: null
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchTeachers();
      fetchNotes();
      fetchStats();
    }
  }, [currentUser]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (err) {
      showError('Failed to fetch teachers');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      showError('Failed to fetch notes');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (data.success) {
        setCurrentUser(data.user);
        setLoginForm({ username: '', password: '' });
        showSuccess(`Welcome, ${data.user.full_name || data.user.username}!`);
      } else {
        showError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      showError('Server connection error! Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowUploadModal(false);
    setSelectedNote(null);
    setNotes([]);
    setTeachers([]);
    setSearchQuery('');
    showSuccess('Logged out successfully');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('subject', uploadForm.subject);
      formData.append('teacherId', uploadForm.teacherId);
      formData.append('description', uploadForm.description);
      formData.append('uploadedBy', currentUser.username);
      formData.append('file', uploadForm.file);

      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUploadForm({ title: '', subject: '', teacherId: '', description: '', file: null });
        setShowUploadModal(false);
        fetchNotes();
        fetchStats();
        showSuccess('Note uploaded successfully!');
      } else {
        showError(data.message || 'Upload failed');
      }
    } catch (err) {
      showError('Error uploading note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        fetchNotes();
        fetchStats();
        showSuccess('Note deleted successfully');
      } else {
        showError(data.message || 'Delete failed');
      }
    } catch (err) {
      showError('Error deleting note');
    }
  };

  const handleDownload = (noteId, fileName) => {
    window.open(`${API_URL}/download/${noteId}`, '_blank');
    showSuccess(`Downloading ${fileName}...`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query) ||
      note.teacher_name.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query)
    );
  });

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Teachers Notes Portal
            </h1>
            <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Your Gateway to Knowledge
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center animate-pulse">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center animate-pulse">
              <FileCheck className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -50px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(50px, 50px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-purple-500 to-pink-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Teachers Notes Portal
                </h1>
                <p className="text-sm text-gray-600 font-medium">📚 Collaborative Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-2 rounded-xl">
                <p className="text-sm font-bold text-gray-800">{currentUser.full_name || currentUser.username}</p>
                <p className="text-xs font-semibold capitalize bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full inline-block">
                  {currentUser.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center shadow-lg animate-pulse">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center shadow-lg animate-pulse">
            <FileCheck className="w-6 h-6 mr-3 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 font-semibold mb-1">Total Notes</p>
                <p className="text-5xl font-bold">{stats.totalNotes}</p>
                <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Available Resources
                </p>
              </div>
              <FileText className="w-20 h-20 text-blue-200 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 font-semibold mb-1">Total Teachers</p>
                <p className="text-5xl font-bold">{stats.totalTeachers}</p>
                <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Expert Educators
                </p>
              </div>
              <Users className="w-20 h-20 text-green-200 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 font-semibold mb-1">Total Students</p>
                <p className="text-5xl font-bold">{stats.totalStudents}</p>
                <p className="text-purple-100 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Active Learners
                </p>
              </div>
              <User className="w-20 h-20 text-purple-200 opacity-50" />
            </div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Study Materials
          </h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Notes</span>
          </button>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100">
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-7 h-7" />
              Available Teachers
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map(teacher => (
                <div key={teacher.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{teacher.name}</p>
                      <p className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mt-1">
                        {teacher.subject}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 font-medium">{teacher.department}</p>
                      <p className="text-xs text-gray-500 mt-1">{teacher.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7" />
              Uploaded Notes ({filteredNotes.length})
            </h3>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-b-2 border-purple-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 pr-12 border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none text-gray-700 placeholder-gray-400"
                placeholder="🔍 Search notes by title, subject, teacher, or description..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-200 rounded-full"
                  title="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-3 text-sm text-purple-700 font-medium bg-purple-100 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                <Search className="w-4 h-4" />
                Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} matching "{searchQuery}"
              </p>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredNotes.length === 0 ? (
              <div className="p-16 text-center">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  {searchQuery ? (
                    <Search className="w-12 h-12 text-purple-500" />
                  ) : (
                    <FileText className="w-12 h-12 text-purple-500" />
                  )}
                </div>
                {searchQuery ? (
                  <>
                    <p className="text-2xl font-bold text-gray-700 mb-2">No matching notes found</p>
                    <p className="text-gray-500 mb-4">Try adjusting your search terms or clear the search to see all notes</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-700 mb-2">No notes uploaded yet</p>
                    <p className="text-gray-500">Be the first to upload study materials!</p>
                  </>
                )}
              </div>
            ) : (
              filteredNotes.map(note => (
                <div key={note.id} className="p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {note.title}
                        </span>
                      </h4>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-purple-600">Subject:</span>
                          <span className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-medium">{note.subject}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600">Teacher:</span>
                          <span className="text-gray-700 font-medium">{note.teacher_name}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-green-600">Uploaded by:</span>
                          <span className="text-gray-700 font-medium">{note.uploaded_by}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-orange-600">Date:</span>
                          <span className="text-gray-700 font-medium">{note.upload_date}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-pink-600">Size:</span>
                          <span className="bg-pink-100 px-2 py-1 rounded text-pink-700 font-medium">{formatFileSize(note.file_size)}</span>
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{note.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(note.id, note.file_name)}
                        className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-3xl font-bold flex items-center gap-2">
                <Upload className="w-8 h-8" />
                Upload Study Notes
              </h3>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Note Title *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
                  placeholder="e.g., Introduction to Calculus"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={uploadForm.subject}
                  onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Teacher *</label>
                <select
                  value={uploadForm.teacherId}
                  onChange={(e) => setUploadForm({...uploadForm, teacherId: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none resize-none"
                  placeholder="Brief description of the notes..."
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload File *</label>
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-500 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
                  <input
                    type="file"
                    onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                    <p className="text-gray-700 font-semibold mb-1">
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload file'}
                    </p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, PPT, PPTX, TXT</p>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </span>
                  ) : (
                    'Upload Notes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Details Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <h3 className="text-3xl font-bold flex items-center gap-2">
                <Eye className="w-8 h-8" />
                Note Details
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {selectedNote.title}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-600 mb-1">Subject</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNote.subject}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-600 mb-1">Teacher</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNote.teacher_name}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-600 mb-1">Uploaded By</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNote.uploaded_by}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200">
                  <p className="text-sm font-semibold text-orange-600 mb-1">Upload Date</p>
                  <p className="text-lg font-bold text-gray-800">{selectedNote.upload_date}</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border-2 border-pink-200">
                  <p className="text-sm font-semibold text-pink-600 mb-1">File Name</p>
                  <p className="text-lg font-bold text-gray-800 truncate">{selectedNote.file_name}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border-2 border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-600 mb-1">File Size</p>
                  <p className="text-lg font-bold text-gray-800">{formatFileSize(selectedNote.file_size)}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">{selectedNote.description}</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => handleDownload(selectedNote.id, selectedNote.file_name)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

















// import React, { useState, useEffect } from 'react';   (main code start)
// import { Upload, LogOut, User, BookOpen, FileText, Download, Trash2, Eye, AlertCircle, Users, FileCheck, Sparkles, GraduationCap, Star, TrendingUp } from 'lucide-react';

// const API_URL = 'http://localhost:5000/api';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loginForm, setLoginForm] = useState({ username: '', password: '' });
//   const [notes, setNotes] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [stats, setStats] = useState({ totalNotes: 0, totalTeachers: 0, totalStudents: 0 });
//   const [uploadForm, setUploadForm] = useState({
//     title: '',
//     subject: '',
//     teacherId: '',
//     description: '',
//     file: null
//   });
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [selectedNote, setSelectedNote] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (currentUser) {
//       fetchTeachers();
//       fetchNotes();
//       fetchStats();
//     }
//   }, [currentUser]);

//   const fetchTeachers = async () => {
//     try {
//       const response = await fetch(`${API_URL}/teachers`);
//       const data = await response.json();
//       setTeachers(data);
//     } catch (err) {
//       showError('Failed to fetch teachers');
//     }
//   };

//   const fetchNotes = async () => {
//     try {
//       const response = await fetch(`${API_URL}/notes`);
//       const data = await response.json();
//       setNotes(data);
//     } catch (err) {
//       showError('Failed to fetch notes');
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${API_URL}/stats`);
//       const data = await response.json();
//       setStats(data);
//     } catch (err) {
//       console.error('Failed to fetch stats');
//     }
//   };

//   const showError = (message) => {
//     setError(message);
//     setTimeout(() => setError(''), 5000);
//   };

//   const showSuccess = (message) => {
//     setSuccess(message);
//     setTimeout(() => setSuccess(''), 5000);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginForm)
//       });

//       const data = await response.json();

//       if (data.success) {
//         setCurrentUser(data.user);
//         setLoginForm({ username: '', password: '' });
//         showSuccess(`Welcome, ${data.user.full_name || data.user.username}!`);
//       } else {
//         showError(data.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       showError('Server connection error! Make sure backend is running on port 5000');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//     setShowUploadModal(false);
//     setSelectedNote(null);
//     setNotes([]);
//     setTeachers([]);
//     showSuccess('Logged out successfully');
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('title', uploadForm.title);
//       formData.append('subject', uploadForm.subject);
//       formData.append('teacherId', uploadForm.teacherId);
//       formData.append('description', uploadForm.description);
//       formData.append('uploadedBy', currentUser.username);
//       formData.append('file', uploadForm.file);

//       const response = await fetch(`${API_URL}/notes`, {
//         method: 'POST',
//         body: formData
//       });

//       const data = await response.json();

//       if (data.success) {
//         setUploadForm({ title: '', subject: '', teacherId: '', description: '', file: null });
//         setShowUploadModal(false);
//         fetchNotes();
//         fetchStats();
//         showSuccess('Note uploaded successfully!');
//       } else {
//         showError(data.message || 'Upload failed');
//       }
//     } catch (err) {
//       showError('Error uploading note');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!window.confirm('Are you sure you want to delete this note?')) return;

//     try {
//       const response = await fetch(`${API_URL}/notes/${noteId}`, {
//         method: 'DELETE'
//       });

//       const data = await response.json();

//       if (data.success) {
//         fetchNotes();
//         fetchStats();
//         showSuccess('Note deleted successfully');
//       } else {
//         showError(data.message || 'Delete failed');
//       }
//     } catch (err) {
//       showError('Error deleting note');
//     }
//   };

//   const handleDownload = (noteId, fileName) => {
//     window.open(`${API_URL}/download/${noteId}`, '_blank');
//     showSuccess(`Downloading ${fileName}...`);
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4 relative overflow-hidden">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//         </div>

//         <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20">
//           <div className="text-center mb-8">
//             <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
//               <BookOpen className="w-10 h-10 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               Teachers Notes Portal
//             </h1>
//             <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
//               <Sparkles className="w-4 h-4 text-yellow-500" />
//               Your Gateway to Knowledge
//               <Sparkles className="w-4 h-4 text-yellow-500" />
//             </p>
//           </div>

//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center animate-pulse">
//               <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
//               <span className="text-sm font-medium">{error}</span>
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-lg flex items-center animate-pulse">
//               <FileCheck className="w-5 h-5 mr-3 flex-shrink-0" />
//               <span className="text-sm font-medium">{success}</span>
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
//               <input
//                 type="text"
//                 value={loginForm.username}
//                 onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={loginForm.password}
//                 onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Logging in...
//                 </span>
//               ) : (
//                 'Login'
//               )}
//             </button>
//           </form>
//         </div>

//         <style jsx>{`
//           @keyframes blob {
//             0%, 100% { transform: translate(0, 0) scale(1); }
//             25% { transform: translate(20px, -50px) scale(1.1); }
//             50% { transform: translate(-20px, 20px) scale(0.9); }
//             75% { transform: translate(50px, 50px) scale(1.05); }
//           }
//           .animate-blob {
//             animation: blob 7s infinite;
//           }
//           .animation-delay-2000 {
//             animation-delay: 2s;
//           }
//           .animation-delay-4000 {
//             animation-delay: 4s;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       {/* Header */}
//       <header className="bg-white shadow-lg border-b-4 border-gradient-to-r from-purple-500 to-pink-500 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl shadow-lg">
//                 <GraduationCap className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   Teachers Notes Portal
//                 </h1>
//                 <p className="text-sm text-gray-600 font-medium">📚 Collaborative Learning Platform</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-2 rounded-xl">
//                 <p className="text-sm font-bold text-gray-800">{currentUser.full_name || currentUser.username}</p>
//                 <p className="text-xs font-semibold capitalize bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full inline-block">
//                   {currentUser.role}
//                 </p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
//               >
//                 <LogOut className="w-5 h-5" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Alerts */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center shadow-lg animate-pulse">
//             <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
//             <span className="font-medium">{error}</span>
//           </div>
//         )}

//         {success && (
//           <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center shadow-lg animate-pulse">
//             <FileCheck className="w-6 h-6 mr-3 flex-shrink-0" />
//             <span className="font-medium">{success}</span>
//           </div>
//         )}

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-100 font-semibold mb-1">Total Notes</p>
//                 <p className="text-5xl font-bold">{stats.totalNotes}</p>
//                 <p className="text-blue-100 text-sm mt-2 flex items-center gap-1">
//                   <TrendingUp className="w-4 h-4" />
//                   Available Resources
//                 </p>
//               </div>
//               <FileText className="w-20 h-20 text-blue-200 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-100 font-semibold mb-1">Total Teachers</p>
//                 <p className="text-5xl font-bold">{stats.totalTeachers}</p>
//                 <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
//                   <TrendingUp className="w-4 h-4" />
//                   Expert Educators
//                 </p>
//               </div>
//               <Users className="w-20 h-20 text-green-200 opacity-50" />
//             </div>
//           </div>
//           <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-100 font-semibold mb-1">Total Students</p>
//                 <p className="text-5xl font-bold">{stats.totalStudents}</p>
//                 <p className="text-purple-100 text-sm mt-2 flex items-center gap-1">
//                   <TrendingUp className="w-4 h-4" />
//                   Active Learners
//                 </p>
//               </div>
//               <User className="w-20 h-20 text-purple-200 opacity-50" />
//             </div>
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="mb-8 flex justify-between items-center">
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
//             <Sparkles className="w-8 h-8 text-yellow-500 fill-yellow-500" />
//             Study Materials
//           </h2>
//           <button
//             onClick={() => setShowUploadModal(true)}
//             className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
//           >
//             <Upload className="w-5 h-5" />
//             <span>Upload Notes</span>
//           </button>
//         </div>

//         {/* Teachers List */}
//         <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//             <h3 className="text-2xl font-bold flex items-center gap-2">
//               <Users className="w-7 h-7" />
//               Available Teachers
//             </h3>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {teachers.map(teacher => (
//                 <div key={teacher.id} className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
//                   <div className="flex items-start space-x-3">
//                     <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
//                       <User className="w-8 h-8 text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <p className="font-bold text-gray-800 text-lg">{teacher.name}</p>
//                       <p className="text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg inline-block mt-1">
//                         {teacher.subject}
//                       </p>
//                       <p className="text-sm text-gray-600 mt-2 font-medium">{teacher.department}</p>
//                       <p className="text-xs text-gray-500 mt-1">{teacher.email}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Notes List */}
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-100">
//           <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
//             <h3 className="text-2xl font-bold flex items-center gap-2">
//               <FileText className="w-7 h-7" />
//               Uploaded Notes ({notes.length})
//             </h3>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {notes.length === 0 ? (
//               <div className="p-16 text-center">
//                 <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <FileText className="w-12 h-12 text-purple-500" />
//                 </div>
//                 <p className="text-2xl font-bold text-gray-700 mb-2">No notes uploaded yet</p>
//                 <p className="text-gray-500">Be the first to upload study materials!</p>
//               </div>
//             ) : (
//               notes.map(note => (
//                 <div key={note.id} className="p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300">
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
//                         <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                           {note.title}
//                         </span>
//                       </h4>
//                       <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
//                         <p className="flex items-center gap-2">
//                           <span className="font-semibold text-purple-600">Subject:</span>
//                           <span className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-medium">{note.subject}</span>
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <span className="font-semibold text-blue-600">Teacher:</span>
//                           <span className="text-gray-700 font-medium">{note.teacher_name}</span>
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <span className="font-semibold text-green-600">Uploaded by:</span>
//                           <span className="text-gray-700 font-medium">{note.uploaded_by}</span>
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <span className="font-semibold text-orange-600">Date:</span>
//                           <span className="text-gray-700 font-medium">{note.upload_date}</span>
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <span className="font-semibold text-pink-600">Size:</span>
//                           <span className="bg-pink-100 px-2 py-1 rounded text-pink-700 font-medium">{formatFileSize(note.file_size)}</span>
//                         </p>
//                       </div>
//                       <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{note.description}</p>
//                     </div>
//                     <div className="flex space-x-2 ml-4">
//                       <button
//                         onClick={() => setSelectedNote(note)}
//                         className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
//                         title="View Details"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDownload(note.id, note.file_name)}
//                         className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
//                         title="Download"
//                       >
//                         <Download className="w-5 h-5" />
//                       </button>
//                       {currentUser.role === 'admin' && (
//                         <button
//                           onClick={() => handleDeleteNote(note.id)}
//                           className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Upload Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-purple-200">
//             <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//               <h3 className="text-3xl font-bold flex items-center gap-2">
//                 <Upload className="w-8 h-8" />
//                 Upload Study Notes
//               </h3>
//             </div>
//             <form onSubmit={handleUploadSubmit} className="p-6 space-y-5">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Note Title *</label>
//                 <input
//                   type="text"
//                   value={uploadForm.title}
//                   onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                   placeholder="e.g., Introduction to Calculus"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
//                 <input
//                   type="text"
//                   value={uploadForm.subject}
//                   onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                   placeholder="e.g., Mathematics"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Select Teacher *</label>
//                 <select
//                   value={uploadForm.teacherId}
//                   onChange={(e) => setUploadForm({...uploadForm, teacherId: e.target.value})}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                   required
//                 >
//                   <option value="">Choose a teacher...</option>
//                   {teachers.map(teacher => (
//                     <option key={teacher.id} value={teacher.id}>
//                       {teacher.name} - {teacher.subject}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
//                 <textarea
//                   value={uploadForm.description}
//                   onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                   rows="3"
//                   placeholder="Brief description of the notes..."
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">Upload File *</label>
//                 <input
//                   type="file"
//                   onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none"
//                   accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded-lg">
//                   📎 Accepted formats: PDF, DOC, DOCX, PPT, PPTX, TXT (Max: 10MB)
//                 </p>
//               </div>

//               <div className="flex space-x-4 pt-4">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {loading ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Uploading...
//                     </span>
//                   ) : (
//                     'Upload'
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowUploadModal(false)}
//                   className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Note Details Modal */}
//       {selectedNote && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-2 border-purple-200">
//             <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
//               <h3 className="text-3xl font-bold flex items-center gap-2">
//                 <FileText className="w-8 h-8" />
//                 {selectedNote.title}
//               </h3>
//             </div>
//             <div className="p-6 space-y-5">
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
//                   <p className="text-sm font-bold text-purple-600 mb-1">Subject</p>
//                   <p className="text-gray-800 font-semibold">{selectedNote.subject}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200">
//                   <p className="text-sm font-bold text-blue-600 mb-1">Teacher</p>
//                   <p className="text-gray-800 font-semibold">{selectedNote.teacher_name}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
//                   <p className="text-sm font-bold text-green-600 mb-1">Department</p>
//                   <p className="text-gray-800 font-semibold">{selectedNote.teacher_subject}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-orange-200">
//                   <p className="text-sm font-bold text-orange-600 mb-1">Uploaded By</p>
//                   <p className="text-gray-800 font-semibold">{selectedNote.uploaded_by}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border-2 border-pink-200">
//                   <p className="text-sm font-bold text-pink-600 mb-1">Upload Date</p>
//                   <p className="text-gray-800 font-semibold">{selectedNote.upload_date}</p>
//                 </div>
//                 <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
//                   <p className="text-sm font-bold text-indigo-600 mb-1">File Size</p>
//                   <p className="text-gray-800 font-semibold">{formatFileSize(selectedNote.file_size)}</p>
//                 </div>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
//                 <p className="text-sm font-bold text-gray-700 mb-2">Description</p>
//                 <p className="text-gray-800">{selectedNote.description}</p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
//                 <p className="text-sm font-bold text-gray-700 mb-2">File Name</p>
//                 <p className="text-gray-800 flex items-center space-x-2">
//                   <FileText className="w-5 h-5 text-blue-500" />
//                   <span className="font-semibold">{selectedNote.file_name}</span>
//                 </p>
//               </div>
//               <div className="flex space-x-4 pt-2">
//                 <button
//                   onClick={() => handleDownload(selectedNote.id, selectedNote.file_name)}
//                   className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
//                 >
//                   <Download className="w-5 h-5" />
//                   <span>Download</span>
//                 </button>
//                 <button
//                   onClick={() => setSelectedNote(null)}
//                   className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300 font-bold shadow-md hover:shadow-lg"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;    (main code upto this)











