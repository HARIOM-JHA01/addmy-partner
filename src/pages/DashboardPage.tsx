import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import type { DashboardStats } from "../types";
import WebApp from "@twa-dev/sdk";

import userIcon from "../assets/user-icon.jpeg";
import referralIcon from "../assets/renewal-icon.jpeg";

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<
    typeof WebApp.initDataUnsafe.user | null | undefined
  >(null);
  useEffect(() => {
    fetchDashboard();
    const user = WebApp.initDataUnsafe?.user;
    setUser(user);
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
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800">
            Dashboard of {user?.first_name} {user?.last_name}
          </h1>
        </div>
        {stats.credits.availableUserCredits === 0 && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 animate-fadeIn"
            role="alert"
          >
            <span className="block sm:inline">
              You do not have any user credits therefor your referral link has
              been disabled till renew.
            </span>
          </div>
        )}

        {/* Referral Section */}
        <div
          className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Referral Information
            </h3>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
              <span className="text-gray-700 font-medium">Referral Code</span>
              <span className="text-xl font-mono font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.referral.referralCode}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={stats.referral.referralUrl}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-mono text-sm"
              />
              <button
                onClick={copyReferralUrl}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Status</span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                  stats.referral.isActive
                    ? "bg-linear-to-r from-green-400 to-emerald-500 text-white"
                    : "bg-linear-to-r from-red-400 to-pink-500 text-white"
                }`}
              >
                {stats.referral.isActive ? "✓ Active" : "✗ Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Credits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-stagger-container">
          <div className="bg-linear-to-br from-blue-500 to-blue-700 p-8 rounded-2xl shadow-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">User Credits</h3>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img src={userIcon} alt="User Icon" className="rounded-full" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Total Credits</span>
                <span className="text-3xl font-bold">
                  {stats.credits.userCredits}
                </span>
              </div>
              <div className="h-px bg-white bg-opacity-20"></div>
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Used</span>
                <span className="text-xl font-semibold">
                  {stats.credits.usedUserCredits}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-20">
                <span className="text-white font-semibold">Available</span>
                <span className="text-3xl font-bold text-green-300">
                  {stats.credits.availableUserCredits}
                </span>
              </div>
              <Link
                to="/partner/packages"
                className="mt-4 w-full bg-white bg-opacity-20 text-black py-2 px-4 rounded-lg text-center font-semibold hover:bg-opacity-30 transition-all duration-200 block"
              >
                Buy More Credits
              </Link>
            </div>
          </div>

          <div
            className="bg-linear-to-br from-purple-500 to-purple-700 p-8 rounded-2xl shadow-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-3xl animate-slideUp"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Renewal Credits</h3>
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <img
                  src={referralIcon}
                  alt="Renewal Icon"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Total Credits</span>
                <span className="text-3xl font-bold">
                  {stats.credits.renewalCredits}
                </span>
              </div>
              <div className="h-px bg-white bg-opacity-20"></div>
              <div className="flex justify-between items-center">
                <span className="text-purple-100">Used</span>
                <span className="text-xl font-semibold">
                  {stats.credits.usedRenewalCredits}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-20">
                <span className="text-white font-semibold">Available</span>
                <span className="text-3xl font-bold text-green-300">
                  {stats.credits.availableRenewalCredits}
                </span>
              </div>
              <Link
                to="/partner/packages"
                className="mt-4 w-full bg-white bg-opacity-20 text-black py-2 px-4 rounded-lg text-center font-semibold hover:bg-opacity-30 transition-all duration-200 block"
              >
                Buy More Credits
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <h2 className="font-bold text-2xl text-center">Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-stagger-container">
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500 animate-slideUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total Users Joined
              </h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-900">
              {stats.users.total}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-500 animate-slideUp"
            style={{ animationDelay: "0.35s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Active Users
              </h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {stats.users.active}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-red-500 animate-slideUp"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Membership Expired
              </h3>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-red-600">
              {stats.users.expired}
            </p>
          </div>
          <div
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-500 animate-slideUp"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                User Joined This Month
              </h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-purple-600">
              {stats.users.joinedThisMonth}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-stagger-container">
          <div
            className="bg-linear-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-orange-200 animate-slideUp"
            style={{ animationDelay: "0.55s" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Pending Payments
              </h3>
              <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-700"
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
              </div>
            </div>
            <p className="text-4xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {stats.payments.pending}
            </p>
            {stats.payments.pending > 0 && (
              <Link
                to="/partner/payments"
                className="text-sm text-orange-600 hover:text-orange-700 font-semibold mt-3 inline-flex items-center space-x-1 group"
              >
                <span>View Payments</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp"
          style={{ animationDelay: "0.6s" }}
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/partner/users"
              className="group px-6 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white text-center rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>View Users</span>
            </Link>
            <Link
              to="/partner/packages"
              className="group px-6 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white text-center rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span>Buy Credits</span>
            </Link>
            <Link
              to="/partner/payments"
              className="group px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white text-center rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Payment History</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
