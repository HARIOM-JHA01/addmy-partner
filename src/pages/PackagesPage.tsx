import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Modal from "../components/Modal";
import api from "../services/api";
import type { Package } from "../types";

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
        alert("Payment submitted successfully! Waiting for admin approval.");
        setPurchaseModal(false);
        setTransactionId("");
        setWalletAddress("");
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Packages</h1>

        {packages.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">
              No packages available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      pkg.type === "USER_CREDITS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {pkg.type === "USER_CREDITS"
                      ? "User Credits"
                      : "Renewal Credits"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Credits:</span>
                    <span className="font-semibold text-gray-900">
                      {pkg.credits}
                    </span>
                  </div>
                  {pkg.renewalMonths && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Renewal Period:</span>
                      <span className="font-semibold text-gray-900">
                        {pkg.renewalMonths} months
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span
                      className={
                        pkg.discount > 0
                          ? "line-through text-gray-400"
                          : "font-semibold text-gray-900"
                      }
                    >
                      ${pkg.price}
                    </span>
                  </div>
                  {pkg.discount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-semibold text-green-600">
                          {pkg.discount}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Final Price:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ${pkg.finalPrice}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                <button
                  onClick={() => handleBuyNow(pkg)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Buy Now
                </button>
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
          <div className="space-y-4">
            <p className="text-gray-700">Preparing purchase details...</p>
            <div className="flex justify-end">
              <button
                onClick={() => setPurchaseModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePurchase} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                {selectedPackage.name}
              </h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-600">
                  Credits: {selectedPackage.credits}
                </p>
                <p className="text-gray-900 font-bold">
                  Amount: ${selectedPackage.finalPrice} USDT
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Payment Instructions:</strong>
              </p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>
                  Send ${selectedPackage.finalPrice} USDT to the provided wallet
                  address
                </li>
                <li>Copy the transaction ID from your wallet</li>
                <li>Enter the transaction ID and your wallet address below</li>
                <li>Wait for admin approval</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID *
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="0x1a2b3c4d5e6f7g8h9i0j"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Wallet Address *
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
                placeholder="TXyz123abc456def789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setPurchaseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Payment"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </Layout>
  );
};

export default PackagesPage;
