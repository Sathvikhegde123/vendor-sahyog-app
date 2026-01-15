import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle, Loader2, Download, RefreshCw } from 'lucide-react';

export default function BusinessContinuity() {
    const [activeTab, setActiveTab] = useState('upload');
    const [file, setFile] = useState(null);
    const [textInput, setTextInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            
            if (activeTab === 'upload' && file) {
                formData.append('policyFile', file);
            } else if (activeTab === 'text' && textInput.trim()) {
                formData.append('rawTextInput', textInput);
            } else {
                throw new Error('Please provide policy input');
            }

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/bcm-policy/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze policy');
            }

            setResult(data.bcmPolicy);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setTextInput('');
        setResult(null);
        setError(null);
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-50';
            case 'medium': return 'text-yellow-600 bg-yellow-50';
            case 'low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const downloadReport = () => {
        if (!result) return;
        
        const report = JSON.stringify(result, null, 2);
        const blob = new Blob([report], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bcm-policy-report-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Continuity Management Policy</h1>
                    <p className="text-gray-600">Upload or paste your BCM policy for ISO 22301 compliance analysis</p>
                </div>

                {!result && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                    activeTab === 'upload'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload File
                            </button>
                            <button
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                    activeTab === 'text'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <FileText className="w-4 h-4 inline mr-2" />
                                Paste Text
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'upload' ? (
                                <div>
                                    <label className="block mb-4">
                                        <div className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.txt"
                                                className="hidden"
                                            />
                                            <div className="text-center">
                                                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                                {file ? (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT (max 10MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Policy Text
                                    </label>
                                    <textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        rows={12}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Paste your BCM policy text here..."
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading || (activeTab === 'upload' && !file) || (activeTab === 'text' && !textInput.trim())}
                                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing Policy...
                                    </>
                                ) : (
                                    'Analyze Policy'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Clauses</p>
                                        <p className="text-3xl font-bold text-gray-900">{result.gapAnalysis?.totalClauses || 0}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Gaps Found</p>
                                        <p className="text-3xl font-bold text-red-600">{result.gapAnalysis?.gapsFound || 0}</p>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <AlertCircle className="w-8 h-8 text-red-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Compliance Rate</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {result.gapAnalysis?.totalClauses 
                                                ? Math.round(((result.gapAnalysis.totalClauses - result.gapAnalysis.gapsFound) / result.gapAnalysis.totalClauses) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={downloadReport}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Analyze Another
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Gap Analysis</h2>
                                <p className="text-sm text-gray-600 mt-1">{result.gapAnalysis?.summary}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {result.gapAnalysis?.details?.map((gap, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mr-3">
                                                    Clause {gap.clause}
                                                </span>
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(gap.gapSeverity)}`}>
                                                    {gap.gapSeverity} Severity
                                                </span>
                                            </div>
                                            {gap.present ? (
                                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                            )}
                                        </div>
                                        
                                        <h3 className="font-semibold text-gray-900 mb-2">Requirement</h3>
                                        <p className="text-sm text-gray-700 mb-3">{gap.requirement}</p>
                                        
                                        <h3 className="font-semibold text-gray-900 mb-2">Evidence</h3>
                                        <p className="text-sm text-gray-600 mb-3">{gap.evidence}</p>
                                        
                                        {gap.recommendation && (
                                            <>
                                                <h3 className="font-semibold text-gray-900 mb-2">Recommendation</h3>
                                                <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">{gap.recommendation}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Extracted Clauses</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {result.extractedClauses?.map((clause, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center mb-3">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                Clause {clause.clause}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Existing Text</h4>
                                            <p className="text-sm text-gray-600">{clause.existingText}</p>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Requirement</h4>
                                            <p className="text-sm text-gray-600">{clause.requirementText}</p>
                                        </div>
                                        
                                        {clause.questions && clause.questions.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Assessment Questions</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {clause.questions.map((q, qi) => (
                                                        <li key={qi} className="text-sm text-gray-600">{q}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900">Improved Policy Suggestions</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {result.regeneratedPolicy?.clauses?.map((clause, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center mb-3">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                Clause {clause.clause}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Text</h4>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{clause.existingText}</p>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-green-700 mb-2">Improved Text</h4>
                                            <p className="text-sm text-gray-900 bg-green-50 p-3 rounded border border-green-200">{clause.newText}</p>
                                        </div>
                                        
                                        {clause.improvementSuggestions && clause.improvementSuggestions.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Improvement Suggestions</h4>
                                                <ul className="space-y-1">
                                                    {clause.improvementSuggestions.map((suggestion, si) => (
                                                        <li key={si} className="text-sm text-blue-700 flex items-start">
                                                            <span className="mr-2">•</span>
                                                            <span>{suggestion}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Vendor Code</p>
                                    <p className="font-medium text-gray-900">{result.vendorCode}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">AI Model</p>
                                    <p className="font-medium text-gray-900">{result.aiModelUsed}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Processed Date</p>
                                    <p className="font-medium text-gray-900">{new Date(result.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Source Type</p>
                                    <p className="font-medium text-gray-900">{result.policySource?.sourceType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}