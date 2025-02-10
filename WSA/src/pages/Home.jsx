import { useState } from "react";
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
} from "react-icons/fa";
import SafetyScore from "../components/SafetyScore";

const Home = () => {
  // Dummy data for emergency contacts, safety tips, and community alerts
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

  const communityAlerts = [
    {
      type: "Incident",
      message: "Suspicious activity reported near Main Street.",
    },
    { type: "Warning", message: "Heavy traffic on Highway 101." },
  ];

  // State for live location sharing
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  // State for safety check-in
  const [safetyCheckInTime, setSafetyCheckInTime] = useState(null);

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for safety score
  const [safetyScore, setSafetyScore] = useState(85); // Example score

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  // Handle live location sharing
  const handleLocationSharing = () => {
    setIsSharingLocation(!isSharingLocation);
    alert(
      isSharingLocation
        ? "Stopped sharing location."
        : "Started sharing location."
    );
  };

  // Handle safety check-in
  const handleSafetyCheckIn = () => {
    setSafetyCheckInTime(new Date().toLocaleTimeString());
    alert("Safety check-in completed.");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-purple-50 to-purple-100"
      } p-6`}
    >
      {/* Dark Mode Toggle (Top Left) */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 left-4 p-3 rounded-full shadow-lg ${
          isDarkMode
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-white hover:bg-gray-100"
        } transition-colors`}
      >
        {isDarkMode ? (
          <FaSun className="text-white" />
        ) : (
          <FaMoon className="text-purple-800" />
        )}
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Safety Score Bar (Top) */}
        <SafetyScore></SafetyScore>
        {/* SOS Button and Location Sharing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuickActions></QuickActions>

          {/* Emergency Contacts */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-md`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              } mb-4`}
            >
              Emergency Contacts
            </h2>
            <ul className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <li
                  key={index}
                  className={isDarkMode ? "text-purple-300" : "text-purple-700"}
                >
                  <strong>{contact.name}:</strong> {contact.number}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Tips and Recent Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Safety Tips */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-md`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              } mb-4`}
            >
              Safety Tips
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              {safetyTips.map((tip, index) => (
                <li
                  key={index}
                  className={isDarkMode ? "text-purple-300" : "text-purple-700"}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Alerts */}
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-md`}
          >
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-purple-400" : "text-purple-800"
              } mb-4`}
            >
              Recent Alerts
            </h2>
            <ul className="space-y-2">
              {communityAlerts.map((alert, index) => (
                <li
                  key={index}
                  className={isDarkMode ? "text-purple-300" : "text-purple-700"}
                >
                  <strong>{alert.type}:</strong> {alert.message}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Profile Link */}
        <div className="flex justify-center">
          <a
            href="/profile"
            className={`flex items-center ${
              isDarkMode
                ? "text-purple-400 hover:text-purple-300"
                : "text-purple-800 hover:text-purple-900"
            } transition-colors`}
          >
            <FaUser className="mr-2" />
            Go to Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
