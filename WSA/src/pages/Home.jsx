import { useState, useEffect } from "react";
import SOSButton from "../components/SOSButton";
import LocationSharing from "../components/LocationSharing";
import QuickActions from "../components/QuickActions";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaUser,
  FaClock,
  FaSun,
  FaMoon,
  FaShieldAlt,
} from "react-icons/fa";
import SafetyScore from "../components/SafetyScore";
import RecentAlerts from "../components/RecentAlerts";
import DarkModeToggle from "../components/DarkModeToggle";

const Home = () => {
  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
    { name: "Women Helpline", number: "1091" },
  ];

  const safetyTips = [
    "Always share your live location with trusted contacts.",
    "Avoid walking alone in isolated areas at night.",
    "Keep your phone charged and emergency numbers saved.",
    "Trust your instincts and stay aware of your surroundings.",
  ];

  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [safetyCheckInTime, setSafetyCheckInTime] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [safetyScore, setSafetyScore] = useState(85);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const handleLocationSharing = () => {
    setIsSharingLocation(!isSharingLocation);
    if (!isSharingLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
          alert(`Share this link with your trusted contacts: ${url}`);
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Location sharing stopped.");
    }
  };

  const handleSafetyCheckIn = () => {
    setSafetyCheckInTime(new Date().toLocaleTimeString());
    alert("Safety check-in completed.");
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-700 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className=" absolute top-6 right-6 z-10">
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      <div className="max-w-4xl mx-auto pt-12">
        {/* App Title */}
        <div className="text-center mb-10 relative">
          <h1
            className={`text-5xl font-extrabold tracking-tight ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
            }`}
          >
            GUARDIFY
          </h1>
          <p
            className={`mt-2 text-lg font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your Personal Safety Companion
          </p>
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
              isDarkMode ? "bg-purple-400" : "bg-indigo-500"
            }`}
          />
        </div>

        {/* Safety Score */}
        <div className="mb-12">
          <SafetyScore isDarkMode={isDarkMode} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <QuickActions isDarkMode={isDarkMode} />

          {/* Emergency Contacts */}
          <div
            className={`p-6 rounded-3xl shadow-xl transition-all duration-300 backdrop-blur-lg ${
              isDarkMode
                ? "bg-gray-800/90 border border-gray-700/50"
                : "bg-white/95 border border-gray-100"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 flex items-center ${
                isDarkMode ? "text-purple-300" : "text-indigo-700"
              }`}
            >
              <FaShieldAlt className="mr-3" /> Emergency Contacts
            </h2>
            <ul className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700/60 hover:bg-gray-600/80 border-l-4 border-purple-500"
                      : "bg-gray-50 hover:bg-gray-100 border-l-4 border-indigo-400"
                  }`}
                >
                  <div>
                    <span
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-purple-200" : "text-indigo-600"
                      }`}
                    >
                      {contact.name}
                    </span>
                    <span
                      className={`block text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {contact.number}
                    </span>
                  </div>
                  <a
                    href={`tel:${contact.number}`}
                    className={`p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                    }`}
                    aria-label={`Call ${contact.name}`}
                  >
                    <FaPhone />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location Sharing Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={handleLocationSharing}
            className={`group relative px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden ${
              isSharingLocation
                ? "bg-gradient-to-r from-red-500 to-rose-600"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
            }`}
          >
            <span className="relative z-10 flex items-center">
              <div
                className={`p-2 rounded-full mr-3 transition-all ${
                  isSharingLocation
                    ? "bg-white/30 animate-pulse"
                    : "bg-white/20 group-hover:bg-white/30"
                }`}
              >
                <FaMapMarkerAlt
                  className={`${isSharingLocation ? "text-lg" : "text-base"}`}
                />
              </div>
              {isSharingLocation
                ? "Stop Sharing Location"
                : "Share Live Location"}
            </span>
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isSharingLocation
                  ? "from-red-400/20 to-rose-400/20"
                  : "from-purple-400/20 to-blue-400/20"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
          </button>
        </div>

        {/* Recent Alerts */}
        <RecentAlerts isDarkMode={isDarkMode} />

        {/* Profile Link */}
        <div className="flex justify-center mt-14 mb-8">
          <a
            href="/profile"
            className={`relative group flex items-center py-3 px-8 rounded-full font-medium shadow-md transition-all duration-300 overflow-hidden ${
              isDarkMode
                ? "bg-gray-800/80 text-purple-300 hover:text-purple-200"
                : "bg-white/90 text-indigo-700 hover:text-indigo-600"
            }`}
          >
            <FaUser className="mr-2" />
            View Your Profile
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                isDarkMode
                  ? "from-purple-500/10 to-indigo-500/10"
                  : "from-indigo-500/10 to-blue-500/10"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
