import React from "react";
import { X, Calendar, User } from "lucide-react";

const BlogPreview = ({ isOpen, onClose, blogData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Blog Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Thumbnail */}
          {blogData.thumbnail && (
            <div className="mb-6">
              <img
                src={blogData.thumbnail}
                alt={blogData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {blogData.title || "Blog Title"}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mb-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="text-sm">Author Name</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 italic">
              {blogData.description || "Blog description will appear here..."}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  blogData.content || "<p>Blog content will appear here...</p>",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <p className="text-sm text-gray-600 text-center">
            This is how your blog will look to readers
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
