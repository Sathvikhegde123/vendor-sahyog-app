import { useState, useEffect } from 'react';
import { Plus, Search, Filter, FileText, AlertTriangle, CheckCircle, Clock, Eye, Edit, Trash2, X, Calendar, Shield, Target, TrendingUp, Award, Users, ClipboardCheck } from 'lucide-react';

export default function InternalAudit() {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        auditName: '',
        auditCode: '',
        auditType: 'Internal',
        scope: '',
        objectives: [''],
        standardsChecked: [''],
        startDate: '',
        endDate: '',
        status: 'Planned',
        complianceStatus: 'Partial',
        isConfidential: false,
        tags: [''],
        notes: ''
    });

    useEffect(() => {
        fetchAudits();
    }, []);

    const fetchAudits = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/internal-audit', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch audits');
            const data = await response.json();
            setAudits(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        if (formData[field].length > 1) {
            setFormData(prev => ({
                ...prev,
                [field]: prev[field].filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const url = editMode
                ? `http://localhost:5000/api/internal-audit/${selectedAudit._id}`
                : 'http://localhost:5000/api/internal-audit';

            const payload = {
                ...formData,
                objectives: formData.objectives.filter(o => o.trim()),
                standardsChecked: formData.standardsChecked.filter(s => s.trim()),
                tags: formData.tags.filter(t => t.trim())
            };

            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save audit');
            }

            await fetchAudits();
            setShowModal(false);
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (auditId, newStatus) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/internal-audit/${auditId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update status');
            await fetchAudits();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this audit?')) return;

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/internal-audit/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to delete audit');
            await fetchAudits();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (audit) => {
        setSelectedAudit(audit);
        setFormData({
            auditName: audit.auditName || '',
            auditCode: audit.auditCode || '',
            auditType: audit.auditType || 'Internal',
            scope: audit.scope || '',
            objectives: audit.objectives && audit.objectives.length > 0 ? audit.objectives : [''],
            standardsChecked: audit.standardsChecked && audit.standardsChecked.length > 0 ? audit.standardsChecked : [''],
            startDate: audit.startDate ? audit.startDate.split('T')[0] : '',
            endDate: audit.endDate ? audit.endDate.split('T')[0] : '',
            status: audit.status || 'Planned',
            complianceStatus: audit.complianceStatus || 'Partial',
            isConfidential: audit.isConfidential || false,
            tags: audit.tags && audit.tags.length > 0 ? audit.tags : [''],
            notes: audit.notes || ''
        });
        setEditMode(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            auditName: '',
            auditCode: '',
            auditType: 'Internal',
            scope: '',
            objectives: [''],
            standardsChecked: [''],
            startDate: '',
            endDate: '',
            status: 'Planned',
            complianceStatus: 'Partial',
            isConfidential: false,
            tags: [''],
            notes: ''
        });
        setEditMode(false);
        setSelectedAudit(null);
    };

    const filteredAudits = audits.filter(audit => {
        const matchesSearch =
            (audit.auditName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (audit.auditCode?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (audit.scope?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'ALL' || audit.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Planned': return 'bg-yellow-100 text-yellow-800';
            case 'On Hold': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getComplianceColor = (status) => {
        switch (status) {
            case 'Full': return 'bg-green-100 text-green-800';
            case 'Partial': return 'bg-yellow-100 text-yellow-800';
            case 'Non-Compliant': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const stats = {
        total: audits.length,
        completed: audits.filter(a => a.status === 'Completed').length,
        inProgress: audits.filter(a => a.status === 'In Progress').length,
        planned: audits.filter(a => a.status === 'Planned').length,
        avgScore: audits.length > 0 ? Math.round(audits.reduce((sum, a) => sum + (a.overallAuditScore || 0), 0) / audits.length) : 0,
        totalFindings: audits.reduce((sum, a) => sum + (a.totalFindings || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Internal Audit Management
                    </h1>
                    <p className="text-gray-600 mt-2">Comprehensive audit tracking and compliance management</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total Audits</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <FileText className="w-10 h-10 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-10 h-10 text-blue-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Planned</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.planned}</p>
                            </div>
                            <Calendar className="w-10 h-10 text-yellow-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Avg Score</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.avgScore}</p>
                            </div>
                            <Award className="w-10 h-10 text-purple-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Findings</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.totalFindings}</p>
                            </div>
                            <AlertTriangle className="w-10 h-10 text-orange-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-1 gap-4 w-full md:w-auto">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by name, code, or scope..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="Planned">Planned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="On Hold">On Hold</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Audit
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Audits Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {loading && audits.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                            Loading audits...
                        </div>
                    ) : filteredAudits.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                            No audits found
                        </div>
                    ) : (
                        filteredAudits.map((audit) => (
                            <div key={audit._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{audit.auditName}</h3>
                                            {audit.isConfidential && (
                                                <Shield className="w-4 h-4 text-red-600" title="Confidential" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{audit.auditCode}</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(audit.status)}`}>
                                                {audit.status}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getComplianceColor(audit.complianceStatus)}`}>
                                                {audit.complianceStatus}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                                Score: {audit.overallAuditScore || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedAudit(audit);
                                                setViewModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(audit)}
                                            className="text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(audit._id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-medium text-gray-900">{audit.auditType}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-600">Period:</span>
                                        <span className="font-medium text-gray-900">
                                            {audit.startDate && new Date(audit.startDate).toLocaleDateString()} - {audit.endDate && new Date(audit.endDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {audit.tags && audit.tags.length > 0 && (
                                        <div className="flex items-start gap-2 mt-2">
                                            <span className="text-xs text-gray-500">Tags:</span>
                                            <div className="flex flex-wrap gap-1">
                                                {audit.tags.map((tag, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {audit.findingSeveritySummary && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-2 text-xs">
                                                <AlertTriangle className="w-4 h-4 text-orange-600" />
                                                <span className="font-medium">Findings:</span>
                                                {audit.findingSeveritySummary.critical > 0 && (
                                                    <span className="text-red-600">Critical: {audit.findingSeveritySummary.critical}</span>
                                                )}
                                                {audit.findingSeveritySummary.high > 0 && (
                                                    <span className="text-orange-600">High: {audit.findingSeveritySummary.high}</span>
                                                )}
                                                {audit.findingSeveritySummary.medium > 0 && (
                                                    <span className="text-yellow-600">Med: {audit.findingSeveritySummary.medium}</span>
                                                )}
                                                {audit.findingSeveritySummary.low > 0 && (
                                                    <span className="text-blue-600">Low: {audit.findingSeveritySummary.low}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <select
                                        value={audit.status}
                                        onChange={(e) => handleUpdateStatus(audit._id, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {editMode ? 'Edit Audit' : 'Create New Audit'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Standards Checked</label>
                                        {formData.standardsChecked.map((std, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={std}
                                                    onChange={(e) => handleArrayChange('standardsChecked', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., ISO 27001"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('standardsChecked', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('standardsChecked')}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> Add Standard
                                        </button>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                        {formData.tags.map((tag, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={tag}
                                                    onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Enter tag"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('tags', index)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('tags')}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Plus className="w-4 h-4" /> Add Tag
                                        </button>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : editMode ? 'Update Audit' : 'Create Audit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {viewModal && selectedAudit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg max-w-5xl w-full my-8">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg z-10">
                                <h2 className="text-xl font-semibold text-gray-900">Audit Details</h2>
                                <button onClick={() => setViewModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">{selectedAudit.auditName}</h3>
                                                {selectedAudit.isConfidential && (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                                        <Shield className="w-3 h-3" /> Confidential
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 font-mono text-sm mb-3">{selectedAudit.auditCode}</p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getStatusColor(selectedAudit.status)}`}>
                                                    {selectedAudit.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getComplianceColor(selectedAudit.complianceStatus)}`}>
                                                    {selectedAudit.complianceStatus} Compliance
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                                                <p className="text-sm text-gray-600">Overall Score</p>
                                                <p className="text-3xl font-bold text-blue-600">{selectedAudit.overallAuditScore || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Basic Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-1">Audit Type</p>
                                        <p className="font-semibold text-gray-900">{selectedAudit.auditType}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-1">Start Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedAudit.startDate && new Date(selectedAudit.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-1">End Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedAudit.endDate && new Date(selectedAudit.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-xs text-gray-600 mb-1">Total Findings</p>
                                        <p className="font-semibold text-orange-600">{selectedAudit.totalFindings || 0}</p>
                                    </div>
                                </div>

                                {/* Scope */}
                                {selectedAudit.scope && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            Scope
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedAudit.scope}</p>
                                    </div>
                                )}

                                {/* Objectives */}
                                {selectedAudit.objectives && selectedAudit.objectives.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            Objectives
                                        </h4>
                                        <ul className="space-y-2">
                                            {selectedAudit.objectives.map((obj, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                                    <span className="text-blue-600 mt-1">•</span>
                                                    <span>{obj}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Standards Checked */}
                                {selectedAudit.standardsChecked && selectedAudit.standardsChecked.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <ClipboardCheck className="w-5 h-5 text-purple-600" />
                                            Standards Checked
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAudit.standardsChecked.map((std, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                                    {std}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Findings Summary */}
                                {selectedAudit.findingSeveritySummary && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                                            Finding Severity Summary
                                        </h4>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                                <p className="text-xs text-red-600 font-medium">Critical</p>
                                                <p className="text-2xl font-bold text-red-700">{selectedAudit.findingSeveritySummary.critical || 0}</p>
                                            </div>
                                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                                                <p className="text-xs text-orange-600 font-medium">High</p>
                                                <p className="text-2xl font-bold text-orange-700">{selectedAudit.findingSeveritySummary.high || 0}</p>
                                            </div>
                                            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                                <p className="text-xs text-yellow-600 font-medium">Medium</p>
                                                <p className="text-2xl font-bold text-yellow-700">{selectedAudit.findingSeveritySummary.medium || 0}</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                                <p className="text-xs text-blue-600 font-medium">Low</p>
                                                <p className="text-2xl font-bold text-blue-700">{selectedAudit.findingSeveritySummary.low || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Findings Details */}
                                {selectedAudit.findings && selectedAudit.findings.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-4">Detailed Findings</h4>
                                        <div className="space-y-3">
                                            {selectedAudit.findings.map((finding, index) => (
                                                <div key={finding._id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h5 className="font-semibold text-gray-900">{finding.observation}</h5>
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(finding.severity)}`}>
                                                            {finding.severity}
                                                        </span>
                                                    </div>
                                                    {finding.rootCause && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Root Cause:</span> {finding.rootCause}
                                                        </p>
                                                    )}
                                                    {finding.recommendation && (
                                                        <div className="bg-blue-50 p-3 rounded text-sm mb-2">
                                                            <span className="font-medium text-blue-900">Recommendation: </span>
                                                            <span className="text-blue-800">{finding.recommendation}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                                        <span className={`px-2 py-1 rounded ${finding.status === 'Closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {finding.status}
                                                        </span>
                                                        {finding.dueDate && (
                                                            <span>Due: {new Date(finding.dueDate).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Checklist */}
                                {selectedAudit.checklist && selectedAudit.checklist.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                                            Audit Checklist
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedAudit.checklist.map((item, index) => (
                                                <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{item.item}</p>
                                                        {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${item.status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Corrective Actions */}
                                {selectedAudit.correctiveActions && selectedAudit.correctiveActions.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                            Corrective Actions
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedAudit.correctiveActions.map((action, index) => (
                                                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    <p className="font-medium text-gray-900 mb-2">{action.description}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        {action.plannedStart && (
                                                            <span>Start: {new Date(action.plannedStart).toLocaleDateString()}</span>
                                                        )}
                                                        {action.plannedEnd && (
                                                            <span>End: {new Date(action.plannedEnd).toLocaleDateString()}</span>
                                                        )}
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${action.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {action.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Risk Assessment */}
                                {selectedAudit.riskAssessment && (
                                    <div className="border border-gray-200 rounded-lg p-4 bg-orange-50">
                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                                            Risk Assessment
                                        </h4>
                                        <div className="mb-3">
                                            <span className="text-sm text-gray-600">Risk Score: </span>
                                            <span className="text-2xl font-bold text-orange-700">{selectedAudit.riskAssessment.score}</span>
                                        </div>
                                        {selectedAudit.riskAssessment.riskItems && selectedAudit.riskAssessment.riskItems.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Risk Items:</p>
                                                <ul className="space-y-1">
                                                    {selectedAudit.riskAssessment.riskItems.map((item, i) => (
                                                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                            <span className="text-orange-600 mt-0.5">•</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {selectedAudit.riskAssessment.notes && (
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Notes: </span>
                                                <span>{selectedAudit.riskAssessment.notes}</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                {selectedAudit.tags && selectedAudit.tags.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAudit.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedAudit.notes && (
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedAudit.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}