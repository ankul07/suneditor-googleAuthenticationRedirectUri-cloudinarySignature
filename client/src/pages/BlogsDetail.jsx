import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import hljs from "highlight.js";
import "highlight.js/styles/monokai.css"; // You can change this to any theme
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

const BlogsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  // Copy text to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Code copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      // console.error("Failed to copy code:", err);
      toast.error("Failed to copy code");
    }
  };

  // Add copy buttons to code blocks
  const addCopyButtons = () => {
    if (!contentRef.current) return;

    const codeBlocks = contentRef.current.querySelectorAll("pre code");

    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;

      // Skip if copy button already exists
      if (pre.querySelector(".copy-btn")) return;

      // Create copy button container
      const copyBtnContainer = document.createElement("div");
      copyBtnContainer.className =
        "copy-btn-container absolute top-2 right-2 z-10";

      // Create copy button
      const copyBtn = document.createElement("button");
      copyBtn.className =
        "copy-btn flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-lg";
      copyBtn.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      `;
      copyBtn.title = "Copy code";

      // Add click handler
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const codeText = codeBlock.textContent || codeBlock.innerText;
        copyToClipboard(codeText);

        // Visual feedback
        copyBtn.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          Copied!
        `;
        copyBtn.classList.add("bg-green-600", "hover:bg-green-500");
        copyBtn.classList.remove("bg-gray-800", "hover:bg-gray-700");

        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          `;
          copyBtn.classList.remove("bg-green-600", "hover:bg-green-500");
          copyBtn.classList.add("bg-gray-800", "hover:bg-gray-700");
        }, 2000);
      });

      // Style the pre element
      pre.style.position = "relative";
      pre.style.paddingTop = "3rem";
      pre.classList.add("code-block-container");

      // Add copy button to container and container to pre
      copyBtnContainer.appendChild(copyBtn);
      pre.appendChild(copyBtnContainer);
    });
  };

  // Apply syntax highlighting and add copy buttons
  const applyCodeHighlighting = () => {
    if (!contentRef.current) return;

    // Apply syntax highlighting
    const codeBlocks = contentRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block);
    });

    // Add copy buttons
    addCopyButtons();
  };

  // Fetch blog by ID
  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${server}/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setBlog(response.data.blog);
      } else {
        throw new Error("Failed to fetch blog");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.response?.data?.message || "Something went wrong");

      if (err.response?.status === 404) {
        toast.error("Blog not found");
        navigate("/blogs");
      } else if (err.response?.status === 403) {
        toast.error("You are not authorized to view this blog");
        navigate("/blogs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  // Apply highlighting when blog content is loaded
  useEffect(() => {
    if (blog && contentRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        applyCodeHighlighting();
      }, 100);
    }
  }, [blog]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/blogs")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {blog && (
          <article className="max-w-4xl mx-auto">
            {/* Header Section */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Author Info */}
                  <div className="flex items-center space-x-2">
                    {blog.author.avatar && (
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {blog.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blog Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{blog.views} views</span>
                  <span>{blog.likes} likes</span>
                </div>
              </div>

              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                {blog.tags &&
                  blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {blog.description}
              </p>

              {/* Thumbnail */}
              {blog.thumbnail && (
                <div className="mb-8">
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </header>

            {/* Content Section with Syntax Highlighting */}
            <div className="prose prose-lg max-w-none">
              <div
                ref={contentRef}
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>

            {/* Footer Actions */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate("/")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  ← Back to Blogs
                </button>

                <div className="flex space-x-4">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                    ♥ Like ({blog.likes})
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Share
                  </button>
                </div>
              </div>
            </footer>
          </article>
        )}
      </div>

      {/* Additional CSS for better code block styling */}
      <style jsx>{`
        .blog-content pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .blog-content pre code {
          background: transparent;
          color: inherit;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .blog-content .code-block-container {
          position: relative;
        }

        .copy-btn-container {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }

        .code-block-container:hover .copy-btn-container {
          opacity: 1;
        }

        .copy-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </Layout>
  );
};

export default BlogsDetail;
