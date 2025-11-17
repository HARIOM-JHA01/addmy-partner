import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WebApp from "@twa-dev/sdk";

const LoginPage = () => {
  const { login, partner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (partner) {
      navigate("/partner/dashboard");
    }
  }, [partner, navigate]);

  useEffect(() => {
    WebApp.ready();
  }, []);

  const handleTelegramLogin = async () => {
    try {
      const user = WebApp.initDataUnsafe?.user;

      if (!user) {
        WebApp.showAlert("Unable to get Telegram user data. Please try again.");
        return;
      }

      const telegramUsername = user.username || `tg_${user.id}`;
      await login(
        user.id.toString(),
        `${user.first_name} ${user.last_name || ""}`.trim(),
        telegramUsername,
        ""
      );

      navigate("/partner/dashboard");
    } catch (error: any) {
      WebApp.showAlert(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center px-4 justify-center bg-linear-to-br from-blue-100 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Partner Portal
          </h1>
          <p className="text-gray-600">Sign in with your Telegram account</p>
        </div>

        <button
          onClick={handleTelegramLogin}
          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all duration-150 font-semibold"
        >
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          Login with Telegram
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
