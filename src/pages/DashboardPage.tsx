import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import type { DashboardStats } from "../types";

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get("/partner/dashboard");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralUrl = () => {
    if (stats?.referral.referralUrl) {
      navigator.clipboard.writeText(stats.referral.referralUrl);
      alert("Referral URL copied to clipboard!");
    }
  };

  if (loading)
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
  if (!stats)
    return (
      <Layout>
        <ErrorMessage message="No data available" />
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Credits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              User Credits
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Credits:</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats.credits.userCredits}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Used:</span>
              <span className="text-lg text-gray-700">
                {stats.credits.usedUserCredits}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available:</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.credits.availableUserCredits}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Renewal Credits
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Credits:</span>
              <span className="text-2xl font-bold text-purple-600">
                {stats.credits.renewalCredits}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Used:</span>
              <span className="text-lg text-gray-700">
                {stats.credits.usedRenewalCredits}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available:</span>
              <span className="text-2xl font-bold text-green-600">
                {stats.credits.availableRenewalCredits}
              </span>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Referral Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referral Code:</span>
              <span className="text-lg font-mono font-bold text-blue-600">
                {stats.referral.referralCode}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={stats.referral.referralUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <button
                onClick={copyReferralUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stats.referral.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {stats.referral.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.users.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.users.active}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Expired Users
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {stats.users.expired}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              This Month
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.users.joinedThisMonth}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Renewals
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.renewals.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Pending Payments
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats.payments.pending}
            </p>
            {stats.payments.pending > 0 && (
              <Link
                to="/partner/payments"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                View Payments →
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/partner/users"
              className="px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium"
            >
              View Users
            </Link>
            <Link
              to="/partner/packages"
              className="px-6 py-3 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 font-medium"
            >
              Buy Credits
            </Link>
            <Link
              to="/partner/payments"
              className="px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 font-medium"
            >
              Payment History
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
