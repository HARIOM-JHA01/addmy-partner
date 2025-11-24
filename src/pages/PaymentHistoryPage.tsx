import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import type { Payment, PaginationInfo } from "../types";
import { format } from "date-fns";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 20,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments(1);
  }, []);

  const fetchPayments = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/partner/payment-history?page=${page}&limit=20`
      );
      if (response.data.success) {
        setPayments(response.data.data.payments);
        setPagination(response.data.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-yellow-400 to-orange-400 text-white shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Pending</span>
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Approved</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-red-400 to-pink-500 text-white shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-400 text-white shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Unknown</span>
          </span>
        );
    }
  };

  if (loading && payments.length === 0)
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
            <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-gray-600 mt-1">
                Total:{" "}
                <span className="font-semibold text-green-600">
                  {pagination.totalRecords}
                </span>{" "}
                transactions
              </p>
            </div>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white bg-opacity-70 backdrop-blur-lg p-12 rounded-2xl shadow-xl border border-white border-opacity-50 text-center animate-slideUp">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No payment history found.</p>
          </div>
        ) : (
          <>
            <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-50 overflow-hidden animate-slideUp">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-linear-to-r from-green-500 to-emerald-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white bg-opacity-50 backdrop-blur-sm divide-y divide-gray-200">
                    {payments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className="hover:bg-white hover:bg-opacity-80 transition-all duration-200"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4 text-gray-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">
                              {format(
                                new Date(payment.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {payment.package.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              payment.package.type === "USER_CREDITS"
                                ? "bg-linear-to-r from-blue-400 to-cyan-400 text-white"
                                : "bg-linear-to-r from-purple-400 to-pink-400 text-white"
                            }`}
                          >
                            {payment.package.type === "USER_CREDITS"
                              ? "User"
                              : "Renewal"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                {payment.credits}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-bold text-green-600">
                              ${payment.amount}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-xs text-gray-700">
                            {payment.transactionId.length > 20
                              ? `${payment.transactionId.substring(0, 20)}...`
                              : payment.transactionId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(payment.status)}
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
                style={{ animationDelay: "0.1s" }}
              >
                <button
                  onClick={() => fetchPayments(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-6 py-3 border-2 border-green-300 rounded-xl text-sm font-bold text-green-700 bg-white hover:bg-green-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  ← Previous
                </button>
                <span className="px-6 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchPayments(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-6 py-3 border-2 border-green-300 rounded-xl text-sm font-bold text-green-700 bg-white hover:bg-green-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
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

export default PaymentHistoryPage;
