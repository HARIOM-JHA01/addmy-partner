import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { partner, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/partner/dashboard"
              className="text-xl font-bold text-blue-600"
            >
              Partner Portal
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/partner/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/partner/dashboard")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/partner/users"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/partner/users")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Users
              </Link>
              <Link
                to="/partner/packages"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/partner/packages")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Packages
              </Link>
              <Link
                to="/partner/payments"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/partner/payments")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Payments
              </Link>
              <Link
                to="/partner/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/partner/profile")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {partner && (
              <>
                <span className="text-sm text-gray-700 hidden md:block">
                  {partner.name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
