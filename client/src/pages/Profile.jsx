import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import BlogCard from "../components/BlogCard";
import { AuthContext } from "../context/AuthContext";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  Globe,
  Twitter,
  Linkedin,
  Github,
  BookOpen,
  Eye,
  Heart,
  Clock,
} from "lucide-react";
// import { server } from "../server";
const server = import.meta.env.VITE_SERVER_URL;

const Profile = () => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    website: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        website: user.website || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
        },
      });
    }
  }, [user]);

  // Fetch user blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${server}/blog/userblog`, {
          withCredentials: true,
        });
        setBlogs(res.data.data.blogs);
        setTotalBlogs(res.data.data.totalBlogs);
      } catch (error) {
        console.error("Failed to fetch user blogs", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserBlogs();
    }
  }, [user]);

  // Handle blog card click
  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    try {
      // API call to update profile would go here
      console.log("Updating profile with:", formData);
      const { name } = formData;
      if (!name) {
        alert("Name field can not be empty");
      } else if (name.length < 2) {
        alert("name must be greater than two character");
      } else {
        const response = await axios.put(
          `${server}/user/profile-update`,
          formData,
          { withCredentials: true }
        );
        console.log("here is response", response.data.data);
        setUser(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        website: user.website || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
        },
      });
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={
                  user.profilePicture ||
                  "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
                }
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your name"
                      required
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.name}
                    </h1>
                  )}

                  <div className="flex items-center text-gray-600 mb-2">
                    <Mail className="w-5 h-5 mr-2" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bio
                </h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">
                    {user.bio || "No bio added yet. Click edit to add one!"}
                  </p>
                )}
              </div>

              {/* Website & Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Website */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  ) : (
                    <div className="flex items-center text-blue-600 hover:text-blue-800">
                      <Globe className="w-4 h-4 mr-2" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website || "No website added"}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Social Links
                  </h4>
                  <div className="space-y-2">
                    {isEditing ? (
                      <>
                        <div className="flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-blue-400" />
                          <input
                            type="text"
                            name="socialLinks.twitter"
                            value={formData.socialLinks.twitter}
                            onChange={handleInputChange}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Twitter username"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-blue-700" />
                          <input
                            type="text"
                            name="socialLinks.linkedin"
                            value={formData.socialLinks.linkedin}
                            onChange={handleInputChange}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="LinkedIn profile"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Github className="w-4 h-4 text-gray-900" />
                          <input
                            type="text"
                            name="socialLinks.github"
                            value={formData.socialLinks.github}
                            onChange={handleInputChange}
                            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="GitHub username"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-4">
                        {user.socialLinks?.twitter && (
                          <a
                            href={`https://twitter.com/${user.socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Twitter className="w-5 h-5 text-blue-400 hover:text-blue-600" />
                          </a>
                        )}
                        {user.socialLinks?.linkedin && (
                          <a
                            href={user.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="w-5 h-5 text-blue-700 hover:text-blue-900" />
                          </a>
                        )}
                        {user.socialLinks?.github && (
                          <a
                            href={`https://github.com/${user.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="w-5 h-5 text-gray-900 hover:text-black" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Blogs Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              My Blogs ({totalBlogs})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onClick={() => handleBlogClick(blog._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No blogs yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start writing your first blog to share your thoughts with the
                world!
              </p>
              <button
                onClick={() => navigate("/create-blog")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write Your First Blog
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
