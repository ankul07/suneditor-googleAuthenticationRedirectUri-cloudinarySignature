import React from "react";

const BlogCard = ({ blog, onClick }) => {
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract text from HTML content for preview
  const getTextPreview = (htmlContent, maxLength = 150) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Format view count
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Blog Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Featured Badge */}
        {blog.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {blog.category}
        </div>
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>

        {/* Content Preview */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {getTextPreview(blog.content)}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={
                blog.author.avatar ||
                "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
              }
              alt={blog.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(blog.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Read More Button */}
      <div className="px-6 pb-6">
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Read More
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
