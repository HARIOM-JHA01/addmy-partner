import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    WebApp.ready();
  }, []);

  const handleClick = () => {
    WebApp.showAlert("Button clicked!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-100 to-purple-200">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">
        Hello World
      </h1>
      <p className="text-lg text-gray-700 mb-8">Testing Testing</p>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-all duration-150 font-semibold"
      >
        Click Me!
      </button>
    </div>
  );
}

export default App;
