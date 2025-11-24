import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { partner, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const quickActions = [
    {
      name: "View Users",
      path: "/partner/users",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      color: "from-blue-600 to-blue-700",
    },
    {
      name: "Buy Credits",
      path: "/partner/packages",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      ),
      color: "from-purple-600 to-pink-600",
    },
    {
      name: "Payment History",
      path: "/partner/payments",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-green-600 to-emerald-600",
    },
    {
      name: "My Profile",
      path: "/partner/profile",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "from-indigo-600 to-purple-600",
    },
  ];

  return (
    <nav className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-500 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/partner/dashboard"
              className="flex items-center space-x-3 group"
            >
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold text-white drop-shadow-lg">
                Partner Portal
              </span>
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link
                to="/partner/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/partner/dashboard")
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/partner/users"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/partner/users")
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                Users
              </Link>
              <Link
                to="/partner/packages"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/partner/packages")
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                Packages
              </Link>
              <Link
                to="/partner/payments"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/partner/payments")
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                Payments
              </Link>
              <Link
                to="/partner/profile"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/partner/profile")
                    ? "bg-white text-purple-600 shadow-lg"
                    : "text-white hover:bg-white hover:bg-opacity-20"
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {partner && (
              <>
                <span className="text-sm text-white font-medium hidden md:block bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  {partner.name}
                </span>
                <button
                  onClick={logout}
                  className="hidden md:block px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Logout
                </button>
                {/* Hamburger Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-200 shadow-2xl animate-slideDown">
          <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Navigation Links */}
            <div className="space-y-2 mb-4">
              <Link
                to="/partner/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/partner/dashboard")
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/partner/users"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/partner/users")
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>Users</span>
              </Link>
              <Link
                to="/partner/packages"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/partner/packages")
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <span>Packages</span>
              </Link>
              <Link
                to="/partner/payments"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/partner/payments")
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Payments</span>
              </Link>
              <Link
                to="/partner/profile"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/partner/profile")
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Profile</span>
              </Link>
            </div>

            {/* Quick Actions Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.path}
                    to={action.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold bg-linear-to-r ${action.color} text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102`}
                  >
                    {action.icon}
                    <span>{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {partner?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {partner?.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-red-500 to-red-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
