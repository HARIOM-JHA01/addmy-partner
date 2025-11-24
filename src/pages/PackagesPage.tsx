import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import api from "../services/api";
import type { Package } from "../types";
import webApp from "@twa-dev/sdk";
const PackagesPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [purchaseModal, setPurchaseModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Keep selectedType in sync with the query parameter
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("type");
    if (p === "USER_CREDITS" || p === "RENEWAL_CREDITS") {
      setSelectedType(p);
    } else {
      setSelectedType("ALL");
    }
  }, [location.search]);

  // Read filter 'type' query param and initialize selected type
  const params = new URLSearchParams(location.search);
  const paramType = params.get("type");
  const initialType =
    paramType && typeof paramType === "string"
      ? (paramType.toUpperCase() as "USER_CREDITS" | "RENEWAL_CREDITS")
      : ("ALL" as "ALL");
  const [selectedType, setSelectedType] = useState<
    "ALL" | "USER_CREDITS" | "RENEWAL_CREDITS"
  >(initialType ?? "ALL");

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/partner/packages");
      if (response.data.success) {
        setPackages(
          response.data.data.filter((pkg: Package) => pkg.status === 1)
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (pkg: Package) => {
    try {
      console.log("handleBuyNow selected package:", pkg);
      setSelectedPackage(pkg);
      setPurchaseModal(true);
      setTransactionId("");
      setWalletAddress("");
    } catch (err) {
      console.error("handleBuyNow error", err);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    try {
      setSubmitting(true);
      const response = await api.post("/partner/purchase-package", {
        packageId: selectedPackage._id,
        transactionId,
        walletAddress,
      });

      if (response.data.success) {
        webApp.showAlert(
          "Payment submitted successfully! Waiting for admin approval."
        );
        setPurchaseModal(false);
        setTransactionId("");
        setWalletAddress("");
        setTimeout(() => {
          navigate("/partner/dashboard");
        }, 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
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

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        <div className="flex items-center justify-between animate-slideDown">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Credit Packages
              </h1>
              <p className="text-gray-600 mt-1">
                Choose the perfect package for your needs
              </p>
            </div>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white bg-opacity-70 backdrop-blur-lg p-12 rounded-2xl shadow-xl border border-white border-opacity-50 text-center animate-slideUp">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              No packages available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger-container">
            {/* Filter control */}
            <div className="col-span-full flex items-center space-x-3">
              <button
                onClick={() => {
                  setSelectedType("ALL");
                  navigate("/partner/packages");
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  selectedType === "ALL"
                    ? "bg-white text-purple-600 shadow"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setSelectedType("USER_CREDITS");
                  navigate("/partner/packages?type=USER_CREDITS");
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  selectedType === "USER_CREDITS"
                    ? "bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                User Credits
              </button>
              <button
                onClick={() => {
                  setSelectedType("RENEWAL_CREDITS");
                  navigate("/partner/packages?type=RENEWAL_CREDITS");
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                  selectedType === "RENEWAL_CREDITS"
                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white shadow"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                Renewal Credits
              </button>
            </div>
            {packages
              .filter((pkg) =>
                selectedType === "ALL" ? true : pkg.type === selectedType
              )
              .map((pkg, index) => (
                <div
                  key={pkg._id}
                  className="group bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-xl border border-white border-opacity-50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`h-2 ${
                      pkg.type === "USER_CREDITS"
                        ? "bg-linear-to-r from-blue-500 to-cyan-500"
                        : "bg-linear-to-r from-purple-500 to-pink-500"
                    }`}
                  ></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                          {pkg.name}
                        </h3>
                        <span
                          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            pkg.type === "USER_CREDITS"
                              ? "bg-linear-to-r from-blue-400 to-cyan-400 text-white"
                              : "bg-linear-to-r from-purple-400 to-pink-400 text-white"
                          }`}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          <span>
                            {pkg.type === "USER_CREDITS"
                              ? "User Credits"
                              : "Renewal Credits"}
                          </span>
                        </span>
                      </div>
                      {pkg.discount > 0 && (
                        <div className="bg-linear-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          {pkg.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-600 font-medium flex items-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          </svg>
                          <span>Credits</span>
                        </span>
                        <span className="font-bold text-gray-900 text-lg">
                          {pkg.credits}
                        </span>
                      </div>
                      {pkg.renewalMonths && (
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-600 font-medium flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Period</span>
                          </span>
                          <span className="font-bold text-gray-900">
                            {pkg.renewalMonths} months
                          </span>
                        </div>
                      )}
                      <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                        {pkg.discount > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 text-sm">
                              Original Price
                            </span>
                            <span className="line-through text-gray-400 text-sm">
                              $
                              {(
                                (pkg.price * 100) /
                                (100 - pkg.discount)
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">
                            Price
                          </span>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-3xl font-bold text-green-600">
                              ${pkg.price}
                            </span>
                            <span className="text-sm text-gray-600">USDT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-5 min-h-10">
                      {pkg.description}
                    </p>

                    <button
                      onClick={() => handleBuyNow(pkg)}
                      className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <Modal
        isOpen={purchaseModal}
        onClose={() => setPurchaseModal(false)}
        title="Purchase Package"
      >
        {!selectedPackage ? (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium">
              Preparing purchase details...
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setPurchaseModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePurchase} className="space-y-6">
            {/* Package Summary Card */}
            <div className="bg-linear-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedPackage.name}
                  </h4>
                  <p className="text-sm text-gray-600">Package Details</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Credits
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {selectedPackage.credits}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Amount
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${selectedPackage.price} USDT
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-linear-to-br from-yellow-50 to-orange-50 p-2 rounded-2xl border border-yellow-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <h4 className="text-xl font-bold text-gray-900 text-center flex-1">
                  Wallet Address
                </h4>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-500 text-center uppercase tracking-wide mb-2">
                  USDT (TRC20) Address
                </p>
                <div className="flex items-center flex-col">
                  <code className="flex-1 font-mono text-sm text-center bg-gray-100 p-3 rounded-lg break-all mb-2">
                    TK2TMn99SBCrdbZpSef7rFE3vTccvR6dCz
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "TK2TMn99SBCrdbZpSef7rFE3vTccvR6dCz"
                      );
                      alert("Wallet address copied to clipboard!");
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-semibold shadow-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
                  <h4 className="text-xl font-bold text-gray-900">
                    Payment Instructions
                  </h4>
                  <p className="text-sm text-gray-600">
                    Follow these steps to complete your purchase
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    1
                  </div>
                  <p className="text-sm text-gray-700">
                    Send{" "}
                    <span className="font-bold text-green-600">
                      ${selectedPackage.price} USDT
                    </span>{" "}
                    to the provided wallet address
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm text-gray-700">
                    Copy the transaction ID from your wallet
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm text-gray-700">
                    Enter the transaction ID and your wallet address below
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    4
                  </div>
                  <p className="text-sm text-gray-700">
                    Wait for admin approval
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Transaction ID</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  placeholder="0x1a2b3c4d5e6f7g8h9i0j"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span>Your Wallet Address</span>
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  placeholder="TXyz123abc456def789"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setPurchaseModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-sm"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Payment"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};

export default PackagesPage;
