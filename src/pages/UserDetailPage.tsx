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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <button
            onClick={() => navigate("/partner/users")}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Back to Users
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <p className="mt-1 text-lg text-gray-900">
                @{user.user.username}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name (English)
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {user.user.nameEnglish}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name (Chinese)
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {user.user.nameChinese}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Telegram ID
              </label>
              <p className="mt-1 text-lg text-gray-900">{user.user.tgid}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {user.user.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Contact
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {user.user.contact || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Membership Status Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Membership Status
            </h2>
            {!user.isExpired && (
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
            {user.isExpired && (
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Expired
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Join Date
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {format(new Date(user.joinDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Expiry Date
              </label>
              <p className="mt-1 text-lg text-gray-900">
                {format(new Date(user.membershipExpiryDate), "MMM dd, yyyy")}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Days Until Expiry
              </label>
              <p
                className={`mt-1 text-lg font-bold ${
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
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Renewal Count
              </label>
              <p className="mt-1 text-lg text-gray-900">{user.renewalCount}</p>
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
