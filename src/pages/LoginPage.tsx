import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WebApp from "@twa-dev/sdk";
import logo from "../assets/addmy-partner-logo.jpeg";

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
    <div className="min-h-screen flex items-center px-4 justify-center bg-linear-to-br bg-blue-400 relative overflow-hidden">
      {/* Animated background elements */}

      <div className="relative z-10 bg-white bg-opacity-80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white border-opacity-50 animate-scaleIn">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 animate-bounce-slow">
            <img
              src={logo}
              alt="addmyco Logo"
              className="w-24 h-24 rounded-3xl"
            />
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome to addmyco.!!! Partner Portal
          </h1>
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
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                Login to partner app
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
