import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    tags: "",
  });
  const navigate = useNavigate();

  // Debounce function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Debounced search term - 500ms delay
  const debouncedSearchTerm = useDebounce(filters.search, 500);

  // Fetch blogs function
  const fetchBlogs = async (page = 1, searchFilters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "9", // 9 blogs per page for nice grid
        ...searchFilters,
      });

      // Remove empty filters
      Object.keys(queryParams).forEach((key) => {
        if (queryParams.get(key) === "") {
          queryParams.delete(key);
        }
      });

      const response = await fetch(`${server}/blog/getblogs?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.blogs);
        setCurrentPage(data.pagination.currentPage);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      setError("Error fetching blogs");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const searchFilters = {
        ...filters,
        search: debouncedSearchTerm,
      };
      fetchBlogs(1, searchFilters);
    }
  }, [debouncedSearchTerm, filters.category, filters.tags]);

  // Handle search input change
  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (filterType === "category") {
      fetchBlogs(1, newFilters);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const currentFilters = {
      ...filters,
      search: debouncedSearchTerm,
    };
    fetchBlogs(page, currentFilters);
  };

  // Handle blog card click
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: "", search: "", tags: "" });
    setCurrentPage(1);
    fetchBlogs(1);
  };

  // Get unique categories from blogs
  const categories = [...new Set(blogs.map((blog) => blog.category))];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to BlogSite
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Discover amazing stories, insights, and knowledge from our
                community
              </p>

              {/* Search Bar - Now with real-time debounced search */}
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[#fff]"
                    />
                    {filters.search && (
                      <button
                        onClick={() => handleSearchChange("")}
                        className="  absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {/* Search status indicator */}
                  {loading && filters.search && (
                    <div className="flex items-center px-4 py-3 bg-white bg-opacity-20 rounded-lg">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span className="text-sm">Searching...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-gray-700 font-medium">Filter by:</span>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Active filters indicator */}
              <div className="flex gap-2">
                {filters.search && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Search: "
                    {filters.search.length > 20
                      ? filters.search.substring(0, 20) + "..."
                      : filters.search}
                    "
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Category: {filters.category}
                  </span>
                )}
              </div>

              {/* Clear Filters */}
              {(filters.category || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Blogs Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {filters.search ? "Searching blogs..." : "Loading blogs..."}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchBlogs()}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {filters.search || filters.category
                  ? "No blogs found matching your criteria"
                  : "No blogs found"}
              </p>
              {(filters.search || filters.category) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear filters to see all blogs
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {filters.search || filters.category
                    ? "Search Results"
                    : "Latest Blogs"}
                </h2>
                <p className="text-gray-600">
                  Showing {blogs.length} of {totalPages * 9} blogs
                  {filters.search && ` for "${filters.search}"`}
                  {filters.category && ` in "${filters.category}"`}
                </p>
              </div>

              {/* Blog Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onClick={() => handleBlogClick(blog._id)}
                    searchTerm={filters.search} // Pass search term to highlight
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
