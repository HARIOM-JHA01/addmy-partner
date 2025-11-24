import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { BackButton } from "@twa-dev/sdk/react";

const WelcomePage = () => {
  useEffect(() => {
    <BackButton onClick={() => window.history.back()} />;
  }, []);
  return (
    <Layout>
      <div className="animate-fadeIn relative">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-16 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-10 -left-16 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Hero text */}
          <div className="space-y-6">
            <h1 className="text-xl md:text-5xl text-center font-bold leading-tight bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to addmyco Partner Program
            </h1>
            <p className="text-gray-600 text-center md:text-lg">
              Please buy your credits to start over and get your referral code.
            </p>
          </div>
          {/* Right: Cards with actions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">User Credits</div>
                  <div className="text-xl font-semibold">Buy User Credits</div>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Allow users to join from your referral.
              </p>
              <div className="flex items-center">
                <Link
                  to="/partner/packages?type=USER_CREDITS"
                  className="w-full py-2 bg-blue-600 text-white text-center rounded-lg font-semibold shadow-md"
                >
                  Buy User Credits
                </Link>
                {/* <Link
                  to="/partner/packages"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold border border-blue-100"
                >
                  View Plans
                </Link> */}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-gray-500">Renewal Credits</div>
                  <div className="text-xl font-semibold">
                    Buy Renewal Credits
                  </div>
                </div>
                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-white">
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
              <p className="text-gray-600 mb-4">
                Allows you to renew users membership quickly.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/partner/packages?type=RENEWAL_CREDITS"
                  className="w-full py-2 bg-purple-600 text-white text-center rounded-lg font-semibold shadow-md"
                >
                  Buy Renewal Credits
                </Link>
                {/* <Link
                  to="/partner/packages"
                  className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-semibold border border-purple-100"
                >
                  View Plans
                </Link> */}
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Your referral code will be visible in your profile after purchase.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WelcomePage;
