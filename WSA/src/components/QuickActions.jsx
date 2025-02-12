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
        // Trigger emergency protocols
        navigator.vibrate([500, 250, 500, 250, 500]); // Vibration pattern
        // Start alarm sound
        const alarmSound = new Audio("/siren.mp3");
        alarmSound.loop = true;
        alarmSound.play();

        // Auto cancel after 30 seconds
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
        // Send location to backend/emergency contacts
        alert(`Sharing live location: ${latitude}, ${longitude}`);
      });
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-purple-400" : "text-purple-800"
        }`}
      >
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* SOS Button */}
        <button
          onClick={handleSOS}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
            isSOSActive
              ? "bg-red-600 text-white animate-pulse"
              : `${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`
          }`}
        >
          <FaExclamationTriangle className="text-2xl mb-2" />
          {isSOSActive ? "Cancel SOS" : "Emergency SOS"}
        </button>

        {/* Emergency Call */}
        <a
          href="tel:100"
          className={`flex flex-col items-center justify-center p-4 rounded-lg ${
            isDarkMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
        >
          <FaPhone className="text-2xl mb-2" />
          Emergency Call
        </a>

        {/* Flashlight */}
        <button
          onClick={toggleFlashlight}
          className={`flex flex-col items-center justify-center p-4 rounded-lg ${
            flashlightOn
              ? "bg-yellow-500 text-black"
              : `${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`
          }`}
        >
          <FaLightbulb className="text-2xl mb-2" />
          {flashlightOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
        </button>

        {/* Sound Alarm */}
        <button
          className={`flex flex-col items-center justify-center p-4 rounded-lg ${
            isDarkMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
        >
          <FaBell className="text-2xl mb-2" />
          Sound Alarm
        </button>
      </div>

      {/* Safety Check Status */}
      <div className="mt-4 text-sm text-center">
        <p className={isDarkMode ? "text-purple-300" : "text-purple-700"}>
          Last safety check: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
