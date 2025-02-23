import { useState, useEffect } from "react";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaBell,
  FaLightbulb,
} from "react-icons/fa";

const QuickActions = ({ isDarkMode }) => {
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // SOS functionality with auto-cancel after 30 seconds
  const handleSOS = () => {
    if (!isSOSActive) {
      const confirm = window.confirm("Are you sure you want to activate SOS?");
      if (confirm) {
        setIsSOSActive(true);
        navigator.vibrate([500, 250, 500, 250, 500]);
        const alarmSound = new Audio("/siren.mp3");
        alarmSound.loop = true;
        alarmSound.play();

        setTimeout(() => {
          setIsSOSActive(false);
          alarmSound.pause();
        }, 30000);
      }
    } else {
      setIsSOSActive(false);
    }
  };

  // Flashlight toggle
  const toggleFlashlight = async () => {
    try {
      if (navigator.mediaDevices.getUserMedia && !flashlightOn) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        const track = stream.getVideoTracks()[0];
        await track.applyConstraints({
          advanced: [{ torch: true }],
        });
        setFlashlightOn(true);
      } else {
        setFlashlightOn(false);
      }
    } catch (error) {
      alert("Flashlight not supported on this device");
    }
  };

  // Share live location with emergency contacts
  const shareLiveLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        alert(`Sharing live location: ${latitude}, ${longitude}`);
      });
    }
  };

  return (
    <div
      className={`p-8 rounded-3xl shadow-xl transition-all duration-500 backdrop-blur-lg ${
        isDarkMode
          ? "bg-gray-800/90 border border-gray-700/50 text-white"
          : "bg-white/95 border border-gray-100 text-gray-900"
      }`}
    >
      <h2
        className={`text-3xl font-extrabold mb-8 ${
          isDarkMode ? "text-purple-300" : "text-indigo-700"
        }`}
      >
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* SOS Button */}
        <button
          onClick={handleSOS}
          className={`group relative flex flex-col items-center justify-center p-5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
            isSOSActive
              ? "bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
          }`}
        >
          <FaExclamationTriangle className="text-3xl mb-3" />
          <span className="text-lg font-medium">
            {isSOSActive ? "Cancel SOS" : "Emergency SOS"}
          </span>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              isSOSActive
                ? "from-red-400/20 to-rose-400/20"
                : "from-purple-400/20 to-indigo-400/20"
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />
        </button>

        {/* Emergency Call */}
        <a
          href="tel:100"
          className="group relative flex flex-col items-center justify-center p-5 rounded-xl shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaPhone className="text-3xl mb-3" />
          <span className="text-lg font-medium">Emergency Call</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>

        {/* Flashlight */}
        <button
          onClick={toggleFlashlight}
          className={`group relative flex flex-col items-center justify-center p-5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
            flashlightOn
              ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
          }`}
        >
          <FaLightbulb className="text-3xl mb-3" />
          <span className="text-lg font-medium">
            {flashlightOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
          </span>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${
              flashlightOn
                ? "from-yellow-400/20 to-amber-400/20"
                : "from-purple-400/20 to-indigo-400/20"
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />
        </button>

        {/* Sound Alarm */}
        <button
          onClick={shareLiveLocation}
          className="group relative flex flex-col items-center justify-center p-5 rounded-xl shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaMapMarkerAlt className="text-3xl mb-3" />
          <span className="text-lg font-medium">Share Location</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </div>

      {/* Safety Check Status */}
      <div className="mt-6 text-center">
        <p
          className={`text-sm font-medium ${
            isDarkMode ? "text-purple-300" : "text-indigo-600"
          }`}
        >
          Last safety check: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
