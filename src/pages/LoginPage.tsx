import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WebApp from "@twa-dev/sdk";

const LoginPage = () => {
  const { login, partner } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (partner) {
      navigate("/partner/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    WebApp.ready();
  }, []);

  const handleTelegramLogin = async () => {
    setIsLoggingIn(true);
    try {
      const user = WebApp.initDataUnsafe?.user;

      if (!user) {
        WebApp.showAlert("Unable to get Telegram user data. Please try again.");
        return;
      }

      const telegramUsername = user.username || `tg_${user.id}`;
      const res = await login(
        user.id.toString(),
        `${user.first_name} ${user.last_name || ""}`.trim(),
        telegramUsername,
        ""
      );

      // If registration message or both credits are zero, show welcome page
      const registrationMessage =
        res?.message ===
        "Registration successful. Purchase a package to start.";
      console.log(res);
      const partnerData = res?.data?.partner || res?.data || null;
      const noCredits =
        partnerData &&
        typeof partnerData.userCredits !== "undefined" &&
        typeof partnerData.renewalCredits !== "undefined" &&
        partnerData.userCredits === 0 &&
        partnerData.renewalCredits === 0;
      console.log({ registrationMessage, noCredits });
      if (registrationMessage || noCredits) {
        console.log("Navigating to welcome page");
        navigate("/partner/welcome");
      } else {
        console.log("Navigating to dashboard");
        navigate("/partner/dashboard");
      }
    } catch (error: any) {
      WebApp.showAlert(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center px-4 justify-center bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white border-opacity-50 animate-scaleIn">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Partner Portal
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in with your Telegram account
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Secure Login</span>
          </div>
        </div>

        <button
          onClick={handleTelegramLogin}
          disabled={isLoggingIn}
          aria-busy={isLoggingIn}
          className={`w-full group relative flex items-center justify-center px-8 py-4 ${
            isLoggingIn ? "cursor-wait opacity-80" : ""
          } bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl active:scale-95 transition-all duration-300 font-bold text-lg overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          {isLoggingIn ? (
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 relative z-10">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
              </div>
              <span className="relative z-10">Signing you in...</span>
            </div>
          ) : (
            <>
              <svg
                className="w-7 h-7 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                Login with Telegram
              </span>
            </>
          )}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our</p>
          <p className="text-purple-600 font-semibold">
            Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
