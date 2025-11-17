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
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <p className="mt-1 text-lg text-gray-900">@{profile.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {profile.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Telegram ID
              </label>
              <p className="mt-1 text-lg text-gray-900">{profile.tgid}</p>
            </div>
            {profile.joinDate && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Join Date
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {format(new Date(profile.joinDate), "MMM dd, yyyy")}
                </p>
              </div>
            )}
            {profile.lastActive && (
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Active
                </label>
                <p className="mt-1 text-lg text-gray-900">
                  {format(new Date(profile.lastActive), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Referral Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Referral Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Referral Code
              </label>
              <p className="text-2xl font-mono font-bold text-blue-600">
                {profile.referralCode}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Referral URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={profile.referralUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <button
                  onClick={copyReferralUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                >
                  Copy URL
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  profile.isReferralActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile.isReferralActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Credits Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Credits Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                User Credits
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{profile.userCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-semibold">
                    {profile.usedUserCredits}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-900 font-medium">Available:</span>
                  <span className="font-bold text-blue-600">
                    {profile.availableUserCredits}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Renewal Credits
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">
                    {profile.renewalCredits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-semibold">
                    {profile.usedRenewalCredits}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-900 font-medium">Available:</span>
                  <span className="font-bold text-purple-600">
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
