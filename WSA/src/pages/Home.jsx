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
} from "react-icons/fa";
import SafetyScore from "../components/SafetyScore";
import RecentAlerts from "../components/RecentAlerts";

const Home = () => {
  // Dummy data for emergency contacts and safety tips
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

  // State for live location sharing
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  // State for safety check-in
  const [safetyCheckInTime, setSafetyCheckInTime] = useState(null);

  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // State for safety score
  const [safetyScore, setSafetyScore] = useState(85); // Example score

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  // Set initial dark mode state on component mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  // Handle live location sharing
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

  // Handle safety check-in
  const handleSafetyCheckIn = () => {
    setSafetyCheckInTime(new Date().toLocaleTimeString());
    alert("Safety check-in completed.");
  };

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle (Top Center) */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full shadow-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
        >
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Safety Score Bar (Top) */}
        <SafetyScore isDarkMode={isDarkMode} />

        {/* SOS Button and Location Sharing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <QuickActions isDarkMode={isDarkMode} />

          {/* Emergency Contacts */}
          <div
            className={`p-6 rounded-2xl shadow-xl transition-all duration-300 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2
              className={`text-2xl font-extrabold mb-4 ${
                isDarkMode ? "text-purple-400" : "text-purple-700"
              }`}
            >
              Emergency Contacts
            </h2>
            <ul className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-4 rounded-xl shadow-md transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-purple-300" : "text-purple-700"
                    }`}
                  >
                    {contact.name}: {contact.number}
                  </span>
                  <a
                    href={`tel:${contact.number}`}
                    className="p-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-all"
                  >
                    <FaPhone />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location Sharing Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleLocationSharing}
            className={`p-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-md`}
          >
            <FaMapMarkerAlt className="inline-block mr-2" />
            {isSharingLocation ? "Stop Sharing" : "Share Live Location"}
          </button>
        </div>

        {/* Safety Tips and Recent Alerts */}
        <RecentAlerts isDarkMode={isDarkMode} />

        {/* Profile Link */}
        <div className="flex justify-center mt-8">
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
