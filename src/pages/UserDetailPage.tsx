import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import api from "../services/api";
import type { UserDetail, RenewalPrice } from "../types";
import { format } from "date-fns";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [renewalPrices, setRenewalPrices] = useState<RenewalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [renewalModal, setRenewalModal] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<number>(0);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserDetail();
      fetchRenewalPrices();
    }
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/partner/users/${id}`);
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRenewalPrices = async () => {
    try {
      const response = await api.get("/renewal-prices");
      if (response.data.success) {
        setRenewalPrices(
          response.data.data.filter((rp: RenewalPrice) => rp.status === 1)
        );
      }
    } catch (err: any) {
      console.error("Failed to load renewal prices", err);
    }
  };

  const handleRenewalClick = () => {
    setRenewalModal(true);
    setSelectedMonths(0);
  };

  const handleRenewMembership = async () => {
    if (!selectedMonths || !user) return;

    try {
      setRenewing(true);
      const response = await api.post("/renew-membership", {
        partnerUserId: user.id,
        months: selectedMonths,
      });

      if (response.data.success) {
        alert(response.data.message);
        setRenewalModal(false);
        fetchUserDetail();
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to renew membership";
      alert(errorMsg);

      if (err.response?.data?.requiresPayment) {
        navigate("/partner/packages");
      }
    } finally {
      setRenewing(false);
    }
  };

  const getSelectedPrice = () => {
    return renewalPrices.find((rp) => rp.membershipMonths === selectedMonths);
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
  if (!user)
    return (
      <Layout>
        <ErrorMessage message="User not found" />
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between animate-slideDown">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
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
              <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                User Details
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage user information
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/partner/users")}
            className="px-6 py-3 text-purple-700 font-semibold border-2 border-purple-300 rounded-xl hover:bg-purple-50 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Users</span>
          </button>
        </div>

        {/* User Profile Card */}
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
            <h2 className="text-xl font-bold text-gray-800">
              Addmy Profile Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Addmy Username
              </label>
              <p className="text-xl font-bold text-gray-900">
                {user.user.username}
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Name (English)
              </label>
              <p className="text-xl font-bold text-gray-900">
                {user.user.nameEnglish}
              </p>
            </div>
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Name (Chinese)
              </label>
              <p className="text-xl font-bold text-gray-900">
                {user.user.nameChinese}
              </p>
            </div>
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Telegram ID
              </label>
              <p className="text-xl font-bold text-gray-900">
                {user.user.tgid}
              </p>
            </div>
            <div className="bg-linear-to-br from-rose-50 to-pink-50 p-5 rounded-xl border border-rose-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Contact
              </label>
              <p className="text-xl font-bold text-gray-900">
                {user.user.contact || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Membership Status Card */}
        <div
          className="bg-white bg-opacity-70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white border-opacity-50 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  user.isExpired
                    ? "bg-linear-to-br from-red-400 to-pink-500"
                    : "bg-linear-to-br from-green-400 to-emerald-500"
                }`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {user.isExpired ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Membership Status
              </h2>
            </div>
            {!user.isExpired && (
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-green-400 to-emerald-500 text-white shadow-md">
                <svg
                  className="w-4 h-4"
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
            )}
            {user.isExpired && (
              <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold bg-linear-to-r from-red-400 to-pink-500 text-white shadow-md">
                <svg
                  className="w-4 h-4"
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Join Date
              </label>
              <p className="text-xl font-bold text-gray-900">
                {format(new Date(user.joinDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Expiry Date
              </label>
              <p className="text-xl font-bold text-gray-900">
                {format(new Date(user.membershipExpiryDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div
              className={`p-5 rounded-xl border-2 ${
                user.isExpired
                  ? "bg-linear-to-br from-red-50 to-pink-50 border-red-300"
                  : user.daysUntilExpiry < 30
                  ? "bg-linear-to-br from-orange-50 to-red-50 border-orange-300"
                  : "bg-linear-to-br from-green-50 to-emerald-50 border-green-300"
              }`}
            >
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Days Until Expiry
              </label>
              <p
                className={`text-3xl font-bold ${
                  user.isExpired
                    ? "text-red-600"
                    : user.daysUntilExpiry < 30
                    ? "text-orange-600"
                    : "text-green-600"
                }`}
              >
                {user.isExpired ? "Expired" : `${user.daysUntilExpiry} days`}
              </p>
            </div>
            <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
              <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Renewal Count
              </label>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-700">
                    {user.renewalCount}
                  </span>
                </div>
              </div>
            </div>
            {user.lastRenewalDate && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Last Renewal Date
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {format(new Date(user.lastRenewalDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Last Renewal By
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.lastRenewalBy}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleRenewalClick}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Renew Membership
            </button>
          </div>
        </div>
      </div>

      {/* Renewal Modal */}
      <Modal
        isOpen={renewalModal}
        onClose={() => setRenewalModal(false)}
        title="Renew Membership"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              User: @{user.user.username}
            </h4>
            <p className="text-sm text-gray-600">
              Current Expiry:{" "}
              {format(new Date(user.membershipExpiryDate), "MMM dd, yyyy")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Renewal Period *
            </label>
            <select
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>-- Select months --</option>
              {renewalPrices.map((rp) => (
                <option key={rp._id} value={rp.membershipMonths}>
                  {rp.membershipMonths} month
                  {rp.membershipMonths > 1 ? "s" : ""} - {rp.creditCost} credit
                  {rp.creditCost > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {selectedMonths > 0 && getSelectedPrice() && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Renewal Period:</span>
                <span className="font-medium">
                  {selectedMonths} month{selectedMonths > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Credit Cost:</span>
                <span className="font-bold text-blue-600">
                  {getSelectedPrice()?.creditCost} credit
                  {(getSelectedPrice()?.creditCost || 0) > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setRenewalModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={renewing}
            >
              Cancel
            </button>
            <button
              onClick={handleRenewMembership}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!selectedMonths || renewing}
            >
              {renewing ? "Processing..." : "Confirm Renewal"}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserDetailPage;
