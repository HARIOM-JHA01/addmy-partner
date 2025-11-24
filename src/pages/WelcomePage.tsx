import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-10 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to addmyco partner programme
        </h1>
        <p className="text-gray-600 mb-6">
          Please buy your credits to start over and get your referral code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Buy user credits</h2>
            <p className="text-gray-600 mb-4">
              Allow users to join from your referral.
            </p>
            <Link
              to="/partner/packages"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Buy user credits
            </Link>
          </div>

          <div className="p-6 border rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Buy Renewal credits</h2>
            <p className="text-gray-600 mb-4">
              Allows you to renew users membership.
            </p>
            <Link
              to="/partner/packages"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md"
            >
              Buy renewal credits
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Your referral code will be visible in your profile after purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
