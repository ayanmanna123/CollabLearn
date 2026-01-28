import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, FileText, Link2, Tag, User, AlertCircle, Upload, CheckCircle2, BookOpen, Code, FolderKanban, SearchIcon, FileCheck, PenTool, FileQuestion, ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";
import { createTask } from "../../services/createTaskApi";
import { getApiUrl } from "../../config/backendConfig";

function CustomDropdown({ value, onChange, placeholder, options, disabled = false }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef(null);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selected = options.find((o) => o.value === value);
  const label = selected?.label || '';

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[#202327] border text-left transition-colors ${
          disabled
            ? 'border-gray-800 text-gray-500 cursor-not-allowed'
            : 'border-gray-700 text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500'
        }`}
      >
        <span className={label ? 'text-white' : 'text-gray-400'}>{label || placeholder}</span>
        <ChevronDown className={`h-4 w-4 ${disabled ? 'text-gray-600' : 'text-gray-300'} ${open ? 'rotate-180' : ''} transition-transform`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-700 bg-[#121212] shadow-xl">
          <div className="max-h-64 overflow-auto">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-[#202327] text-white'
                      : 'text-gray-200 hover:bg-[#202327]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const categories = [
  { value: "coding", label: "Coding Assignment", icon: Code },
  { value: "practice", label: "Reading Material", icon: BookOpen },
  { value: "project", label: "Project Work", icon: FolderKanban },
  { value: "project", label: "Research Task", icon: SearchIcon },
  { value: "coding", label: "Code Review", icon: FileCheck },
  { value: "practice", label: "Practice Exercise", icon: PenTool },
  { value: "Content Creation", label: "Documentation", icon: FileText },
  { value: "assignment", label: "Other", icon: FileQuestion },
];

export function CreateTaskForm() {
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAttachments, setUploadedAttachments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    menteeId: "",
    priority: "",
    category: "",
    dueDate: "",
    estimatedTime: "",
    resources: "",
    instructions: "",
    notifyMentee: true,
    requireSubmission: false,
  });

  const uploadAttachment = async (file) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error('Authentication required');

    const apiUrl = getApiUrl().replace(/\/$/, '');
    const isVideo = file.type?.startsWith('video/');
    const isImage = file.type?.startsWith('image/');

    const endpoint = isVideo ? 'video' : isImage ? 'image' : 'file';
    const fieldName = isVideo ? 'video' : isImage ? 'image' : 'file';

    const form = new FormData();
    form.append(fieldName, file);

    const res = await fetch(`${apiUrl}/upload/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Upload failed');
    }

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      url: data?.data?.url,
      publicId: data?.data?.publicId,
    };
  };

  const handleAttachmentSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const result = await uploadAttachment(file);
        uploaded.push(result);
      }

      setUploadedAttachments((prev) => [...prev, ...uploaded]);
      toast.success('File(s) uploaded');
    } catch (err) {
      console.error('Attachment upload error:', err);
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const apiUrl = getApiUrl().replace(/\/$/, '');
      const response = await fetch(`${apiUrl}/bookings/mentor`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.bookings) {
        const menteesMap = new Map();

        data.bookings.forEach((booking) => {
          if (!booking.student) return;

          const studentId = booking.student._id;
          if (!menteesMap.has(studentId)) {
            menteesMap.set(studentId, {
              id: studentId,
              name: booking.student.name,
              email: booking.student.email,
              profilePicture: booking.student.profilePicture,
            });
          }
        });

        setMentees(Array.from(menteesMap.values()));
      }
    } catch (err) {
      console.error("Error fetching mentees:", err);
      toast.error("Failed to load mentees");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.menteeId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const allowedCategories = new Set([
        'Technical Skills',
        'Soft Skills',
        'Career Development',
        'Content Creation',
        'coding',
        'practice',
        'project',
        'assignment',
        ''
      ]);

      const normalizedCategory = allowedCategories.has(formData.category)
        ? formData.category
        : 'Technical Skills';

      // Format the data for backend
      const taskData = {
        title: formData.title,
        description: formData.description,
        instructions: formData.instructions,
        category: normalizedCategory,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate).toISOString(),
        estimatedTime: formData.estimatedTime,
        resources: formData.resources,
        attachments: uploadedAttachments.map((a) => a.url).filter(Boolean),
        attachmentsMeta: uploadedAttachments
          .filter((a) => a && a.url && a.name)
          .map((a) => ({
            name: a.name,
            size: a.size,
            type: a.type,
            url: a.url,
          })),
        notifyMentee: formData.notifyMentee,
        requireSubmission: formData.requireSubmission,
        menteeId: formData.menteeId,
      };

      // Use centralized API service (automatically switches between Java and Node.js)
      const data = await createTask(taskData);

      if (data.success) {
        toast.success("Task created successfully!");
        navigate("/mentor/tasks");
      } else {
        toast.error(data.message || "Failed to create task");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Error creating task: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMentee = mentees.find((m) => m.id === formData.menteeId);

  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Main Content */}
      <main className="mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                  <FileText className="w-5 h-5 text-white" />
                  Basic Information
                </h3>
                <p className="text-sm text-gray-400">Enter the main details for this task</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Task Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Build a REST API with Node.js"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#202327] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Provide a detailed description of what the mentee needs to accomplish..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#202327] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-400">
                    Be specific about requirements, expected outcomes, and any constraints.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Special Instructions</label>
                  <textarea
                    placeholder="Any additional instructions, tips, or guidance for the mentee..."
                    rows={3}
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full px-3 py-2 bg-[#202327] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Task Category */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                  <Tag className="w-5 h-5 text-white" />
                  Task Category
                </h3>
                <p className="text-sm text-gray-400">Select the type of task you are assigning</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = formData.category === category.value;
                  return (
                    <button
                      key={`${category.value}-${category.label}`}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: category.value })}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-all ${
                        isSelected
                          ? "border-gray-500 bg-[#202327] text-white"
                          : "border-gray-700 bg-[#1a1a1a] text-gray-300 hover:border-gray-500 hover:bg-[#202327]"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                      <span className="text-xs font-medium text-center">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
                  <Link2 className="w-5 h-5 text-white" />
                  Resources & Attachments
                </h3>
                <p className="text-sm text-gray-400">Add helpful links or upload files for the mentee</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Resource Links</label>
                  <textarea
                    placeholder="Add helpful links, documentation, or tutorials (one per line)&#10;e.g., https://docs.example.com/guide"
                    rows={4}
                    value={formData.resources}
                    onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                    className="w-full px-3 py-2 bg-[#202327] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500 resize-none font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Attachments</label>
                  <label className="block">
                    <input
                      type="file"
                      multiple
                      onChange={handleAttachmentSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className={`flex items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                      isUploading
                        ? 'border-gray-800 bg-[#0f0f0f] cursor-not-allowed'
                        : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-500 hover:bg-[#202327] cursor-pointer'
                    }`}>
                      <div className="text-center">
                        <Upload className="mx-auto w-8 h-8 text-gray-300" />
                        <p className="mt-2 text-sm font-medium text-gray-300">
                          {isUploading ? 'Uploading...' : 'Click to upload files'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Images, videos, PDF, DOC (max 100MB)</p>
                      </div>
                    </div>
                  </label>

                  {uploadedAttachments.length > 0 && (
                    <div className="space-y-2">
                      {uploadedAttachments.map((att) => (
                        <div key={`${att.url}-${att.name}`} className="flex items-center justify-between rounded-lg border border-gray-700 bg-[#202327] px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{att.name}</p>
                            <p className="text-xs text-gray-400">Uploaded</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setUploadedAttachments((prev) => prev.filter((x) => x.url !== att.url))}
                            className="ml-3 inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-black/20 hover:text-white"
                            aria-label="Remove attachment"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Assign Mentee */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <User className="w-5 h-5 text-white" />
                  Assign To
                </h3>
              </div>

              <div className="space-y-4">
                <CustomDropdown
                  value={formData.menteeId}
                  onChange={(v) => setFormData({ ...formData, menteeId: v })}
                  placeholder="Select a mentee"
                  options={[
                    { value: '', label: 'Select a mentee' },
                    ...mentees.map((m) => ({ value: m.id, label: m.name }))
                  ]}
                />

                {selectedMentee && (
                  <div className="flex items-center gap-3 rounded-lg bg-[#202327] border border-gray-700 p-3">
                    <img
                      src={selectedMentee.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMentee.name)}&background=4a5568&color=fff`}
                      alt={selectedMentee.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMentee.name)}&background=4a5568&color=fff`;
                      }}
                    />
                    <div>
                      <p className="font-medium text-white">{selectedMentee.name}</p>
                      <p className="text-xs text-gray-400">{selectedMentee.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Priority & Timeline */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-800 p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <AlertCircle className="w-5 h-5 text-white" />
                  Priority & Timeline
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Priority Level</label>
                  <CustomDropdown
                    value={formData.priority}
                    onChange={(v) => setFormData({ ...formData, priority: v })}
                    placeholder="Select priority"
                    options={[
                      { value: '', label: 'Select priority' },
                      { value: 'low', label: 'Low Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'high', label: 'High Priority' },
                      { value: 'urgent', label: 'Urgent' }
                    ]}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#202327] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Estimated Time
                  </label>
                  <CustomDropdown
                    value={formData.estimatedTime}
                    onChange={(v) => setFormData({ ...formData, estimatedTime: v })}
                    placeholder="Select duration"
                    options={[
                      { value: '', label: 'Select duration' },
                      { value: '30min', label: '30 minutes' },
                      { value: '1hr', label: '1 hour' },
                      { value: '2hr', label: '2 hours' },
                      { value: '4hr', label: '4 hours' },
                      { value: '1day', label: '1 day' },
                      { value: '2-3days', label: '2-3 days' },
                      { value: '1week', label: '1 week' },
                      { value: '2weeks', label: '2+ weeks' }
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="bg-[#121212] rounded-lg shadow-sm border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Options</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="notify"
                    checked={formData.notifyMentee}
                    onChange={(e) => setFormData({ ...formData, notifyMentee: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-gray-400 focus:ring-2 focus:ring-gray-500"
                  />
                  <div className="space-y-1">
                    <label htmlFor="notify" className="block text-sm font-medium text-gray-300 cursor-pointer">
                      Notify mentee
                    </label>
                    <p className="text-xs text-gray-400">Send an email notification when task is created</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="submission"
                    checked={formData.requireSubmission}
                    onChange={(e) => setFormData({ ...formData, requireSubmission: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-gray-400 focus:ring-2 focus:ring-gray-500"
                  />
                  <div className="space-y-1">
                    <label htmlFor="submission" className="block text-sm font-medium text-gray-300 cursor-pointer">
                      Require submission
                    </label>
                    <p className="text-xs text-gray-400">Mentee must submit work for review to complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/mentor/tasks")}
                className="flex-1 px-6 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.menteeId}
                className="flex-1 px-6 py-2.5 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
