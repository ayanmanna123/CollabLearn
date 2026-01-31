import { useState } from "react";
import { X, HelpCircle, AlertCircle } from "lucide-react";
import * as forumService from "../../services/forumService";

export function AskQuestionModal({ open, onOpenChange, onQuestionCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await forumService.createQuestion({
        title: title.trim(),
        content: content.trim(),
        category
      });

      // Notify parent component of new question
      if (onQuestionCreated) {
        onQuestionCreated(result.question);
      }

      // Close modal and reset form
      onOpenChange(false);
      setTitle("");
      setContent("");
      setCategory("");
    } catch (err) {
      console.error('Error creating question:', err);
      setError(err.message || 'Failed to create question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0a] border border-white/10 text-white max-w-2xl w-full rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">Ask the Community</h2>
            <p className="text-sm text-gray-400 mt-1">Get fast answers from industry experts.</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Question Title</label>
            <input
              type="text"
              placeholder="e.g. How do I prepare for System Design interviews?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-600">{title.length}/200</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#121212]">Choose a category</option>
                <option value="engineering" className="bg-[#121212]">Engineering</option>
                <option value="data-science" className="bg-[#121212]">Data Science</option>
                <option value="business" className="bg-[#121212]">Business</option>
                <option value="product" className="bg-[#121212]">Product</option>
                <option value="general" className="bg-[#121212]">General</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Question Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Details</label>
            <textarea
              placeholder="Describe what you want to achieve or know more about..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-600 px-4 py-3.5 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] resize-none transition-all"
            />
          </div>

          {/* Tips */}
          <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 flex gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-300 mb-1">Writing a great question</p>
              <ul className="text-xs text-indigo-200/60 space-y-1 list-disc pl-3">
                <li>Be specific and concise</li>
                <li>Add context to help mentors understand your situation</li>
                <li>Proofread for clarity</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => onOpenChange(false)}
              className="px-6 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title || !content || !category}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-500/50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
