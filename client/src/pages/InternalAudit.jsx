import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Filter, Edit2, Trash2, Eye, AlertCircle, CheckCircle, Clock, XCircle, FileText, Users, Shield, TrendingUp } from 'lucide-react';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const InternalAuditPortal = () => {
    const [audits, setAudits] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [view, setView] = useState('list');
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [notification, setNotification] = useState(null);

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
        auditors: [],
        auditOwner: '',
        checklist: [],
        findings: [],
        correctiveActions: [],
        riskAssessment: {
            score: 0,
            riskItems: [''],
            notes: ''
        },
        complianceStatus: 'Partial',
        distributedTo: [''],
        isConfidential: false,
        tags: [''],
        notes: ''
    });

    useEffect(() => {
        fetchAudits();
        fetchEmployees();
    }, []);

    const fetchAudits = async () => {
        try {
            setLoading(true);
            const response = await api.get('/internal-audit');
            setAudits(response.data);
        } catch (error) {
            showNotification('Failed to fetch audits', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
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

    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleChecklistChange = (index, field, value) => {
        const updatedChecklist = [...formData.checklist];
        updatedChecklist[index] = { ...updatedChecklist[index], [field]: value };
        setFormData(prev => ({ ...prev, checklist: updatedChecklist }));
    };

    const addChecklistItem = () => {
        setFormData(prev => ({
            ...prev,
            checklist: [...prev.checklist, {
                item: '',
                status: 'Not Checked',
                notes: '',
                checkedBy: '',
                checkedAt: ''
            }]
        }));
    };

    const handleFindingChange = (index, field, value) => {
        const updatedFindings = [...formData.findings];
        updatedFindings[index] = { ...updatedFindings[index], [field]: value };
        setFormData(prev => ({ ...prev, findings: updatedFindings }));
    };

    const addFinding = () => {
        setFormData(prev => ({
            ...prev,
            findings: [...prev.findings, {
                observation: '',
                rootCause: '',
                severity: 'Low',
                recommendation: '',
                status: 'Open',
                owner: '',
                dueDate: ''
            }]
        }));
    };

    const handleCorrectiveActionChange = (index, field, value) => {
        const updatedActions = [...formData.correctiveActions];
        updatedActions[index] = { ...updatedActions[index], [field]: value };
        setFormData(prev => ({ ...prev, correctiveActions: updatedActions }));
    };

    const addCorrectiveAction = () => {
        setFormData(prev => ({
            ...prev,
            correctiveActions: [...prev.correctiveActions, {
                description: '',
                assignedTo: '',
                plannedStart: '',
                plannedEnd: '',
                status: 'Planned'
            }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const normalizeIds = (value) =>
                typeof value === "object" && value?._id ? value._id : value;
            const submitData = {
                ...formData,
                objectives: formData.objectives.filter(o => o.trim()),
                standardsChecked: formData.standardsChecked.filter(s => s.trim()),
                distributedTo: formData.distributedTo.filter(d => d.trim()),
                tags: formData.tags.filter(t => t.trim()),
                riskAssessment: {
                    ...formData.riskAssessment,
                    riskItems: formData.riskAssessment.riskItems.filter(r => r.trim())
                }
            };

            if (editMode && selectedAudit) {
                await api.put(`/internal-audit/${selectedAudit._id}`, submitData);
                showNotification('Audit updated successfully');
            } else {
                await api.post('/internal-audit', submitData);
                showNotification('Audit created successfully');
            }

            fetchAudits();
            resetForm();
        } catch (error) {
            showNotification(error.response?.data?.error || 'Operation failed', 'error');
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
            objectives: audit.objectives?.length ? audit.objectives : [''],
            standardsChecked: audit.standardsChecked?.length ? audit.standardsChecked : [''],
            startDate: audit.startDate?.split('T')[0] || '',
            endDate: audit.endDate?.split('T')[0] || '',
            status: audit.status || 'Planned',
            auditors: audit.auditors || [],
            auditOwner: audit.auditOwner || '',
            checklist: audit.checklist || [],
            findings: audit.findings || [],
            correctiveActions: audit.correctiveActions || [],
            riskAssessment: audit.riskAssessment || { score: 0, riskItems: [''], notes: '' },
            complianceStatus: audit.complianceStatus || 'Partial',
            distributedTo: audit.distributedTo?.length ? audit.distributedTo : [''],
            isConfidential: audit.isConfidential || false,
            tags: audit.tags?.length ? audit.tags : [''],
            notes: audit.notes || ''
        });
        setEditMode(true);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this audit?')) return;

        try {
            await api.delete(`/internal-audit/${id}`);
            showNotification('Audit deleted successfully');
            fetchAudits();
        } catch (error) {
            showNotification('Failed to delete audit', 'error');
        }
    };

    const handleViewDetails = (audit) => {
        setSelectedAudit(audit);
        setView('details');
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
            auditors: [],
            auditOwner: '',
            checklist: [],
            findings: [],
            correctiveActions: [],
            riskAssessment: { score: 0, riskItems: [''], notes: '' },
            complianceStatus: 'Partial',
            distributedTo: [''],
            isConfidential: false,
            tags: [''],
            notes: ''
        });
        setIsFormOpen(false);
        setEditMode(false);
        setSelectedAudit(null);
    };

    const filteredAudits = audits.filter(audit => {
        const matchesSearch = audit.auditName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            audit.auditCode?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || audit.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Planned': return <Clock className="w-4 h-4" />;
            case 'In Progress': return <TrendingUp className="w-4 h-4" />;
            case 'Completed': return <CheckCircle className="w-4 h-4" />;
            case 'Cancelled': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Planned': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-600 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-white';
            case 'Low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    if (view === 'details' && selectedAudit) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => { setView('list'); setSelectedAudit(null); }}
                        className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        ← Back to List
                    </button>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{selectedAudit.auditName}</h1>
                                <p className="text-gray-600 mt-1">Code: {selectedAudit.auditCode}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(selectedAudit.status)}`}>
                                    {getStatusIcon(selectedAudit.status)}
                                    {selectedAudit.status}
                                </span>
                                {selectedAudit.isConfidential && (
                                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Confidential
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-blue-600 mb-1">Audit Type</div>
                                <div className="text-xl font-bold text-blue-900">{selectedAudit.auditType}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm text-green-600 mb-1">Compliance Status</div>
                                <div className="text-xl font-bold text-green-900">{selectedAudit.complianceStatus}</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="text-sm text-purple-600 mb-1">Overall Score</div>
                                <div className="text-xl font-bold text-purple-900">{selectedAudit.overallAuditScore}/100</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Audit Period</h3>
                                <p className="text-gray-700">
                                    {new Date(selectedAudit.startDate).toLocaleDateString()} - {new Date(selectedAudit.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Total Findings</h3>
                                <p className="text-gray-700">{selectedAudit.totalFindings}</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Scope</h3>
                            <p className="text-gray-700">{selectedAudit.scope}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Objectives</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {selectedAudit.objectives?.map((obj, idx) => (
                                    <li key={idx} className="text-gray-700">{obj}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">Standards Checked</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedAudit.standardsChecked?.map((std, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                        {std}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {selectedAudit.findings?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">Findings</h3>
                                <div className="space-y-4">
                                    {selectedAudit.findings.map((finding, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-gray-900">{finding.observation}</h4>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                                                    {finding.severity}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2"><strong>Root Cause:</strong> {finding.rootCause}</p>
                                            <p className="text-gray-600 text-sm mb-2"><strong>Recommendation:</strong> {finding.recommendation}</p>
                                            <div className="flex justify-between items-center mt-3 text-sm">
                                                <span className={`px-2 py-1 rounded ${finding.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {finding.status}
                                                </span>
                                                {finding.dueDate && (
                                                    <span className="text-gray-500">Due: {new Date(finding.dueDate).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Finding Severity Summary</h4>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600">{selectedAudit.findingSeveritySummary?.critical || 0}</div>
                                            <div className="text-xs text-gray-600">Critical</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">{selectedAudit.findingSeveritySummary?.high || 0}</div>
                                            <div className="text-xs text-gray-600">High</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-yellow-600">{selectedAudit.findingSeveritySummary?.medium || 0}</div>
                                            <div className="text-xs text-gray-600">Medium</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{selectedAudit.findingSeveritySummary?.low || 0}</div>
                                            <div className="text-xs text-gray-600">Low</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedAudit.correctiveActions?.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">Corrective Actions</h3>
                                <div className="space-y-3">
                                    {selectedAudit.correctiveActions.map((action, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <p className="font-medium text-gray-900 mb-2">{action.description}</p>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Planned: {new Date(action.plannedStart).toLocaleDateString()} - {new Date(action.plannedEnd).toLocaleDateString()}</p>
                                                <span className={`inline-block px-2 py-1 rounded text-xs ${action.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {action.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedAudit.riskAssessment && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-orange-600">Risk Score</span>
                                        <span className="text-2xl font-bold text-orange-900">{selectedAudit.riskAssessment.score}/100</span>
                                    </div>
                                    <div className="mb-3">
                                        <h4 className="text-sm font-semibold mb-2">Risk Items:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {selectedAudit.riskAssessment.riskItems?.map((item, idx) => (
                                                <li key={idx} className="text-sm text-gray-700">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {selectedAudit.riskAssessment.notes && (
                                        <p className="text-sm text-gray-700"><strong>Notes:</strong> {selectedAudit.riskAssessment.notes}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedAudit.tags?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAudit.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {notification && (
                <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="w-8 h-8" />
                            Internal Audit Management
                        </h1>
                        <p className="text-gray-600 mt-1">Manage audits, findings, and compliance tracking</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Audit
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search audits by name or code..."
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
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading && !isFormOpen ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredAudits.map((audit) => (
                            <div key={audit._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{audit.auditName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(audit.status)}`}>
                                                {getStatusIcon(audit.status)}
                                                {audit.status}
                                            </span>
                                            {audit.isConfidential && (
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    Confidential
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">Code: {audit.auditCode}</p>
                                        <p className="text-gray-700 mb-3">{audit.scope}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleViewDetails(audit)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(audit)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(audit._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                        <div className="text-xs text-gray-500 mb-1">Start Date</div>
                                        <div className="text-sm font-medium">{new Date(audit.startDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <div className="text-xs text-gray-500 mb-1">End Date</div>
                                        <div className="text-sm font-medium">{new Date(audit.endDate).toLocaleDateString()}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <div className="text-xs text-gray-500 mb-1">Total Findings</div>
                                        <div className="text-sm font-medium">{audit.totalFindings}</div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                        <div className="text-xs text-gray-500 mb-1">Compliance</div>
                                        <div className="text-sm font-medium">{audit.complianceStatus}</div>
                                    </div>
                                </div>

                                {audit.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {audit.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredAudits.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No audits found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-4xl w-full my-8">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-lg">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editMode ? 'Edit Audit' : 'Create New Audit'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audit Name *</label>
                                    <input
                                        type="text"
                                        name="auditName"
                                        value={formData.auditName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audit Code *</label>
                                    <input
                                        type="text"
                                        name="auditCode"
                                        value={formData.auditCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audit Type</label>
                                    <select
                                        name="auditType"
                                        value={formData.auditType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Internal">Internal</option>
                                        <option value="External">External</option>
                                        <option value="Compliance">Compliance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Planned">Planned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Status</label>
                                    <select
                                        name="complianceStatus"
                                        value={formData.complianceStatus}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Compliant">Compliant</option>
                                        <option value="Partial">Partial</option>
                                        <option value="Non-Compliant">Non-Compliant</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scope *</label>
                                <textarea
                                    name="scope"
                                    value={formData.scope}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audit Owner</label>
                                    <select
                                        name="auditOwner"
                                        value={formData.auditOwner}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Owner</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Auditors</label>
                                    <select
                                        multiple
                                        name="auditors"
                                        value={formData.auditors}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            auditors: Array.from(e.target.selectedOptions, option => option.value)
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        size={3}
                                    >
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
                                {formData.objectives.map((obj, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={obj}
                                            onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter objective"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('objectives', index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('objectives')}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                >
                                    + Add Objective
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Standards Checked</label>
                                {formData.standardsChecked.map((std, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={std}
                                            onChange={(e) => handleArrayChange('standardsChecked', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., ISO 27001"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('standardsChecked', index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('standardsChecked')}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                >
                                    + Add Standard
                                </button>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Checklist Items</h3>
                                {formData.checklist.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={item.item}
                                                onChange={(e) => handleChecklistChange(index, 'item', e.target.value)}
                                                placeholder="Checklist item"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleChecklistChange(index, 'status', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Compliant">Compliant</option>
                                                <option value="Non-Compliant">Non-Compliant</option>
                                            </select>
                                            <textarea
                                                value={item.notes}
                                                onChange={(e) => handleChecklistChange(index, 'notes', e.target.value)}
                                                placeholder="Notes"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <select
                                                value={item.checkedBy}
                                                onChange={(e) => handleChecklistChange(index, 'checkedBy', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Checked By</option>
                                                {employees.map(emp => (
                                                    <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                checklist: prev.checklist.filter((_, i) => i !== index)
                                            }))}
                                            className="mt-2 text-red-600 text-sm hover:underline"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addChecklistItem}
                                    className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                >
                                    + Add Checklist Item
                                </button>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Findings</h3>
                                {formData.findings.map((finding, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <textarea
                                                value={finding.observation}
                                                onChange={(e) => handleFindingChange(index, 'observation', e.target.value)}
                                                placeholder="Observation"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <textarea
                                                value={finding.rootCause}
                                                onChange={(e) => handleFindingChange(index, 'rootCause', e.target.value)}
                                                placeholder="Root Cause"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <select
                                                value={finding.severity}
                                                onChange={(e) => handleFindingChange(index, 'severity', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                            <select
                                                value={finding.status}
                                                onChange={(e) => handleFindingChange(index, 'status', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <textarea
                                                value={finding.recommendation}
                                                onChange={(e) => handleFindingChange(index, 'recommendation', e.target.value)}
                                                placeholder="Recommendation"
                                                className="px-3 py-2 border border-gray-300 rounded-lg col-span-2"
                                            />
                                            <select
                                                value={finding.owner}
                                                onChange={(e) => handleFindingChange(index, 'owner', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Select Owner</option>
                                                {employees.map(emp => (
                                                    <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="date"
                                                value={finding.dueDate}
                                                onChange={(e) => handleFindingChange(index, 'dueDate', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                findings: prev.findings.filter((_, i) => i !== index)
                                            }))}
                                            className="mt-2 text-red-600 text-sm hover:underline"
                                        >
                                            Remove Finding
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addFinding}
                                    className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                >
                                    + Add Finding
                                </button>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Corrective Actions</h3>
                                {formData.correctiveActions.map((action, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <textarea
                                                value={action.description}
                                                onChange={(e) => handleCorrectiveActionChange(index, 'description', e.target.value)}
                                                placeholder="Action Description"
                                                className="px-3 py-2 border border-gray-300 rounded-lg col-span-2"
                                            />
                                            <select
                                                value={action.assignedTo}
                                                onChange={(e) => handleCorrectiveActionChange(index, 'assignedTo', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="">Assigned To</option>
                                                {employees.map(emp => (
                                                    <option key={emp._id} value={emp._id}>{emp.employeeName}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={action.status}
                                                onChange={(e) => handleCorrectiveActionChange(index, 'status', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="Planned">Planned</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={action.plannedStart}
                                                onChange={(e) => handleCorrectiveActionChange(index, 'plannedStart', e.target.value)}
                                                placeholder="Planned Start"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                            <input
                                                type="date"
                                                value={action.plannedEnd}
                                                onChange={(e) => handleCorrectiveActionChange(index, 'plannedEnd', e.target.value)}
                                                placeholder="Planned End"
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                correctiveActions: prev.correctiveActions.filter((_, i) => i !== index)
                                            }))}
                                            className="mt-2 text-red-600 text-sm hover:underline"
                                        >
                                            Remove Action
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCorrectiveAction}
                                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                                >
                                    + Add Corrective Action
                                </button>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Score (0-100)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.riskAssessment.score}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                riskAssessment: { ...prev.riskAssessment, score: parseInt(e.target.value) || 0 }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <input
                                            type="text"
                                            value={formData.riskAssessment.notes}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                riskAssessment: { ...prev.riskAssessment, notes: e.target.value }
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Risk Items</label>
                                    {formData.riskAssessment.riskItems.map((item, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const newItems = [...formData.riskAssessment.riskItems];
                                                    newItems[index] = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        riskAssessment: { ...prev.riskAssessment, riskItems: newItems }
                                                    }));
                                                }}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Risk item"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newItems = formData.riskAssessment.riskItems.filter((_, i) => i !== index);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        riskAssessment: { ...prev.riskAssessment, riskItems: newItems }
                                                    }));
                                                }}
                                                className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                riskAssessment: {
                                                    ...prev.riskAssessment,
                                                    riskItems: [...prev.riskAssessment.riskItems, '']
                                                }
                                            }));
                                        }}
                                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    >
                                        + Add Risk Item
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Distribution List (Emails)</label>
                                {formData.distributedTo.map((email, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => handleArrayChange('distributedTo', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="email@example.com"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('distributedTo', index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('distributedTo')}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                >
                                    + Add Email
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="Tag"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('tags', index)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('tags')}
                                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                >
                                    + Add Tag
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isConfidential"
                                    checked={formData.isConfidential}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 text-sm text-gray-700">Mark as Confidential</label>
                            </div>

                            <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                                >
                                    {loading ? 'Saving...' : editMode ? 'Update Audit' : 'Create Audit'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternalAuditPortal;