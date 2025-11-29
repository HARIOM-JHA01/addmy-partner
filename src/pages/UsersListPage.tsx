import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import type { PartnerUser, PaginationInfo } from "../types";
import { format } from "date-fns";

const UsersListPage = () => {
  const [users, setUsers] = useState<PartnerUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 20,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchUsers(1, statusFilter);
  }, [statusFilter]);

  const fetchUsers = async (page: number, status: string) => {
    try {
      setLoading(true);
      const statusParam = status !== "all" ? `&status=${status}` : "";
      const response = await api.get(
        `partner/users?page=${page}&limit=20${statusParam}`
      );
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  if (loading && users.length === 0)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <ErrorMessage message={error} />
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center animate-slideDown">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                My Users
              </h1>
              <p className="text-gray-600 mt-1">
                Total:{" "}
                <span className="font-semibold text-blue-600">
                  {pagination.totalRecords}
                </span>{" "}
                users
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white bg-opacity-70 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white border-opacity-50 animate-slideUp">
          <label className="block text-sm font-bold text-gray-700 mb-3 items-center space-x-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <span>Filter by Status</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white font-medium"
          >
            <option value="all">📋 All Users</option>
            <option value="active">✅ Active Users</option>
            <option value="expired">⏰ Expired Users</option>
          </select>
        </div>

        {users.length === 0 ? (
          <div className="bg-white bg-opacity-70 backdrop-blur-lg p-12 rounded-2xl shadow-xl border border-white border-opacity-50 text-center animate-slideUp">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No users found.</p>
          </div>
        ) : (
          <>
            <div
              className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-50 overflow-hidden animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-linear-to-r from-blue-500 to-purple-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        TG Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Addmy Username
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Membership Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Expiry Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Renewals
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white bg-opacity-50 backdrop-blur-sm divide-y divide-gray-200">
                    {users.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-white hover:bg-opacity-80 transition-all duration-200"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              @{user.username}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Premium
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {format(new Date(user.joinDate), "MMM dd, yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {format(
                            new Date(user.membershipExpiryDate),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.isExpired ? (
                            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-red-400 to-pink-500 text-white shadow-md">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Expired</span>
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-md">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Active</span>
                              </span>
                              <div className="text-xs text-gray-600 mt-1 font-medium">
                                {user.daysUntilExpiry} days left
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-purple-600">
                                {user.renewalCount}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/partner/users/${user.id}`}
                            className="inline-flex items-center space-x-1 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                          >
                            <span>View</span>
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div
                className="flex justify-center items-center space-x-4 animate-slideUp"
                style={{ animationDelay: "0.2s" }}
              >
                <button
                  onClick={() =>
                    fetchUsers(pagination.currentPage - 1, statusFilter)
                  }
                  disabled={pagination.currentPage === 1}
                  className="px-6 py-3 border-2 border-purple-300 rounded-xl text-sm font-bold text-purple-700 bg-white hover:bg-purple-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  ← Previous
                </button>
                <span className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold shadow-lg">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    fetchUsers(pagination.currentPage + 1, statusFilter)
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-6 py-3 border-2 border-purple-300 rounded-xl text-sm font-bold text-purple-700 bg-white hover:bg-purple-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default UsersListPage;
