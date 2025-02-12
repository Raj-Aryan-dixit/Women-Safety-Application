import { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle } from "react-icons/fa";

const RecentAlerts = ({ isDarkMode }) => {
  const [alerts, setAlerts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch alerts based on user's location
  useEffect(() => {
    if (userLocation) {
      const fetchAlerts = async () => {
        try {
          const response = await axios.get(
            "https://api.crimeometer.com/v1/incidents/raw-data",
            {
              params: {
                lat: userLocation.latitude,
                lon: userLocation.longitude,
                distance: 5, // 5km radius
              },
              headers: {
                "x-api-key": import.meta.env.VITE_CRIMEOMETER_API_KEY,
              },
            }
          );
          setAlerts(response.data.incidents);
        } catch (error) {
          console.error("Error fetching alerts:", error);
        }
      };

      fetchAlerts();
    }
  }, [userLocation]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md mb-8`}
    >
      <h2
        className={`text-2xl font-semibold ${
          isDarkMode ? "text-purple-400" : "text-purple-800"
        } mb-4`}
      >
        <FaExclamationTriangle className="inline-block mr-2" />
        Recent Alerts
      </h2>

      <div className="space-y-3">
        {alerts.slice(0, 5).map((alert, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              isDarkMode
                ? "bg-gray-700 text-purple-200"
                : "bg-purple-50 text-purple-800"
            }`}
          >
            <h3 className="font-semibold">{alert.type}</h3>
            <p className="text-sm">{alert.description}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(alert.datetime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
