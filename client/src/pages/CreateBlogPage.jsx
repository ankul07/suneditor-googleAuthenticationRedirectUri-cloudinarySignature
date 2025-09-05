import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import ImageUploader from "../components/ImageUploader";
import FormInput from "../components/FormInput";
import BlogEditor from "../components/BlogEditor";
import BlogPreview from "../components/BlogPreview";
import { Send, Eye, Save, FileText, Image, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: null,
    tags: "",
    category: "",
    status: "draft", // draft, published
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleThumbnailUpload = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: imageUrl,
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return false;
    }
    if (!formData.description.trim()) {
      alert("Please enter a blog description");
      return false;
    }
    if (!formData.content.trim()) {
      alert("Please write some blog content");
      return false;
    }
    if (!formData.category.trim()) {
      alert("Please select a blog category");
      return false;
    }
    if (!formData.thumbnail) {
      alert("Please upload a blog thumbnail");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e, status = "published") => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const blogData = {
        ...formData,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Blog data to submit:", blogData);

      // Using axios with credentials for cookie-based authentication
      const response = await axios.post(
        `${server}/blog/create-blog`, // Replace with your actual API endpoint
        {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          thumbnail: formData.thumbnail,
          category: formData.category,
          tags: formData.tags,
          status,
        },
        {
          withCredentials: true, // This sends cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "this is response in create blog page for create blogs",
        response
      );

      if (response.data) {
        alert(
          status === "draft"
            ? "Blog saved as draft!"
            : "Blog published successfully!"
        );

        // Reset form
        setFormData({
          title: "",
          description: "",
          content: "",
          thumbnail: null,
          tags: "",
          category: "",
          status: "draft",
        });
        navigate("/");
        // You might want to redirect to the blog list or blog detail page
        // window.location.href = `/blog/${response.data.slug}`;
      }
    } catch (error) {
      console.error("Error saving blog:", error);

      // Handle different error scenarios
      if (error.response?.status === 401) {
        alert("You are not authorized. Please login again.");
        // Redirect to login page
        // window.location.href = '/login';
      } else if (error.response?.status === 400) {
        alert("Invalid blog data. Please check your inputs.");
      } else {
        alert("Failed to save blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e) => {
    setIsDraft(true);
    handleSubmit(e, "draft");
  };

  const handlePublish = (e) => {
    setIsDraft(false);
    handleSubmit(e, "published");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit3 size={24} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Blog
            </h1>
          </div>
          <p className="text-gray-600">
            Share your thoughts and ideas with the world. Create engaging
            content with our rich editor.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePublish} className="space-y-6">
              {/* Blog Title */}
              <FormInput
                label="Blog Title"
                value={formData.title}
                onChange={handleInputChange("title")}
                placeholder="Enter an engaging title for your blog"
                required
                maxLength={100}
              />

              {/* Blog Description */}
              <FormInput
                label="Short Description"
                type="textarea"
                value={formData.description}
                onChange={handleInputChange("description")}
                placeholder="Write a brief description that summarizes your blog post"
                required
                maxLength={200}
                rows={3}
              />

              {/* Blog Content */}
              <BlogEditor
                content={formData.content}
                onChange={handleContentChange}
              />

              {/* Blog Category - Required */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Category"
                  value={formData.category}
                  onChange={handleInputChange("category")}
                  placeholder="e.g., Technology, Lifestyle, Travel"
                  required
                />
                <FormInput
                  label="Tags (comma separated)"
                  value={formData.tags}
                  onChange={handleInputChange("tags")}
                  placeholder="e.g., react, javascript, tutorial"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && !isDraft ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send size={20} />
                  )}
                  Publish Blog
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Thumbnail Upload - Required */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">
                    Featured Image <span className="text-red-500">*</span>
                  </h3>
                </div>
                <ImageUploader
                  onImageUpload={handleThumbnailUpload}
                  currentImage={formData.thumbnail}
                  label=""
                />
              </div>

              {/* Preview Button */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Eye size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Preview</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Eye size={18} />
                  Preview Blog
                </button>
              </div>

              {/* Blog Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Blog Info</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Title Length:</span>
                    <span>{formData.title.length}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description Length:</span>
                    <span>{formData.description.length}/200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Content Length:</span>
                    <span>
                      {formData.content.replace(/<[^>]*>/g, "").length} chars
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{formData.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        <BlogPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          blogData={formData}
        />
      </div>
    </Layout>
  );
};

export default CreateBlogPage;
