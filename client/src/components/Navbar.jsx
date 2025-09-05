import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Edit,
  PlusCircle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
const server = import.meta.env.VITE_SERVER_URL;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext); // Get user and logout from context
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = `${server}/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await logout(); // Use logout from context
      setIsOpen(false);
      setShowProfileDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeDropdown = () => {
    setShowProfileDropdown(false);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              BlogSite
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Auth Section */}
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Get Started</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Create Blog Button */}
                <Link
                  to="/create-blog"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <PlusCircle size={16} />
                  <span>Create Blog</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ring-2 ring-transparent hover:ring-gray-200"
                  >
                    <img
                      src={
                        user.avatar ||
                        user.picture ||
                        `https://ui-avatars.com/api/?name=${user.name}&background=random`
                      }
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <span className="text-sm font-medium text-gray-700 hidden lg:block">
                      {user.name}
                    </span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={closeDropdown}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Auth Section */}
            {!user ? (
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Get Started</span>
              </button>
            ) : (
              <div className="space-y-3">
                {/* Mobile Profile Info */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <img
                    src={
                      user.avatar ||
                      user.picture ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Mobile Create Blog Button */}
                <Link
                  to="/create-blog"
                  onClick={closeDropdown}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-md"
                >
                  <PlusCircle size={18} />
                  <span>Create Blog</span>
                </Link>

                {/* Mobile Menu Items */}
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={closeDropdown}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
