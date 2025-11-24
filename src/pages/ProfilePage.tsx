import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import api from "../services/api";
import type { Partner } from "../types";
import { format } from "date-fns";

const ProfilePage = () => {
  const [profile, setProfile] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/partner/profile");
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralUrl = () => {
    if (profile?.referralUrl) {
      navigator.clipboard.writeText(profile.referralUrl);
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
  if (!profile)
    return (
      <Layout>
        <ErrorMessage message="No profile data available" />
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex items-center space-x-4 animate-slideDown">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account information
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Personal Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Name
              </label>
              <p className="text-xl font-bold text-gray-900">{profile.name}</p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Username
              </label>
              <p className="text-xl font-bold text-gray-900">
                @{profile.username}
              </p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Email
              </label>
              <p className="text-xl font-bold text-gray-900">
                {profile.email || "Not provided"}
              </p>
            </div>
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Telegram ID
              </label>
              <p className="text-xl font-bold text-gray-900">{profile.tgid}</p>
            </div>
            {profile.joinDate && (
              <div className="bg-linear-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
                <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Join Date
                </label>
                <p className="text-xl font-bold text-gray-900">
                  {format(new Date(profile.joinDate), "MMM dd, yyyy")}
                </p>
              </div>
            )}
            {profile.lastActive && (
              <div className="bg-linear-to-br from-rose-50 to-pink-50 p-5 rounded-xl border border-rose-100">
                <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Last Active
                </label>
                <p className="text-xl font-bold text-gray-900">
                  {format(new Date(profile.lastActive), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Details */}
        <div
          className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Referral Details
            </h2>
          </div>
          <div className="space-y-5">
            <div className="bg-linear-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-200">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Referral Code
              </label>
              <p className="text-3xl font-mono font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profile.referralCode}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Referral URL
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={profile.referralUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all duration-200 font-mono text-sm"
                />
                <button
                  onClick={copyReferralUrl}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
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
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Status
              </label>
              <span
                className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold shadow-md ${
                  profile.isReferralActive
                    ? "bg-linear-to-r from-green-400 to-emerald-500 text-white"
                    : "bg-linear-to-r from-red-400 to-pink-500 text-white"
                }`}
              >
                {profile.isReferralActive ? (
                  <>
                    <svg
                      className="w-5 h-5"
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
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Inactive</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Credits Summary */}
        <div
          className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            <h2 className="text-2xl font-bold text-gray-800">
              Credits Summary
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">User Credits</h3>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-blue-100">
                  <span>Total</span>
                  <span className="text-xl font-semibold text-white">
                    {profile.userCredits}
                  </span>
                </div>
                <div className="flex justify-between items-center text-blue-100">
                  <span>Used</span>
                  <span className="text-xl font-semibold text-white">
                    {profile.usedUserCredits}
                  </span>
                </div>
                <div className="h-px bg-white bg-opacity-20"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Available</span>
                  <span className="text-3xl font-bold text-green-300">
                    {profile.availableUserCredits}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-700 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Renewal Credits</h3>
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-purple-100">
                  <span>Total</span>
                  <span className="text-xl font-semibold text-white">
                    {profile.renewalCredits}
                  </span>
                </div>
                <div className="flex justify-between items-center text-purple-100">
                  <span>Used</span>
                  <span className="text-xl font-semibold text-white">
                    {profile.usedRenewalCredits}
                  </span>
                </div>
                <div className="h-px bg-white bg-opacity-20"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold">Available</span>
                  <span className="text-3xl font-bold text-green-300">
                    {profile.availableRenewalCredits}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
