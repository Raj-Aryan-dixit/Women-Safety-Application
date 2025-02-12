import { useState, useEffect } from "react";
import {
  FaSun,
  FaMoon,
  FaCloudRain,
  FaUsers,
  FaLightbulb,
} from "react-icons/fa";
import axios from "axios";

const SafetyScore = ({ isDarkMode }) => {
  const [safetyScore, setSafetyScore] = useState(0);
  const [isDaytime, setIsDaytime] = useState(true);
  const [criminalRate, setCriminalRate] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("sunny");
  const [crowdDensity, setCrowdDensity] = useState("medium");
  const [lightingCondition, setLightingCondition] = useState("good");

  // Fetch weather data
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
          import.meta.env.VITE_OPENWEATHERMAP_API_KEY
        }`
      );
      const weather = response.data.weather[0].main.toLowerCase();
      setWeatherCondition(weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Fetch crime data
  const fetchCrimeData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.crimeometer.com/v1/incidents/raw-data?lat=${latitude}&lon=${longitude}&distance=5km`,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_CRIMEOMETER_API_KEY,
          },
        }
      );
      const crimeCount = response.data.incidents.length;
      setCriminalRate(crimeCount > 10 ? 30 : 10); // Example logic
    } catch (error) {
      console.error("Error fetching crime data:", error);
    }
  };

  // Fetch crowd density data
  const fetchCrowdDensity = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&key=${
          import.meta.env.VITE_GOOGLE_PLACES_API_KEY
        }`
      );
      const places = response.data.results;
      const density =
        places.length > 20 ? "high" : places.length > 10 ? "medium" : "low";
      setCrowdDensity(density);
    } catch (error) {
      console.error("Error fetching crowd density:", error);
    }
  };

  // Fetch lighting data (mock implementation)
  const fetchLightingData = async (latitude, longitude) => {
    // Mock logic: Assume lighting is poor at night
    const currentHour = new Date().getHours();
    setLightingCondition(
      currentHour >= 18 || currentHour < 6 ? "poor" : "good"
    );
  };

  // Fetch all data based on user's location
  const fetchData = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          fetchCrimeData(latitude, longitude);
          fetchCrowdDensity(latitude, longitude);
          fetchLightingData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Calculate safety score
  useEffect(() => {
    const calculateSafetyScore = () => {
      let score = 100 - criminalRate;

      if (!isDaytime) {
        score -= 20;
      }

      if (weatherCondition === "rain") {
        score -= 10;
      } else if (weatherCondition === "storm") {
        score -= 20;
      }

      if (crowdDensity === "low") {
        score -= 15;
      } else if (crowdDensity === "medium") {
        score -= 5;
      }

      if (lightingCondition === "poor") {
        score -= 10;
      }

      score = Math.max(0, Math.min(100, score));
      setSafetyScore(score);
    };

    calculateSafetyScore();
  }, [
    criminalRate,
    isDaytime,
    weatherCondition,
    crowdDensity,
    lightingCondition,
  ]);

  // Determine if it's daytime or nighttime
  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsDaytime(currentHour >= 6 && currentHour < 18);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Get safety level based on score
  const getSafetyLevel = (score) => {
    if (score >= 80) return "Very Safe";
    if (score >= 60) return "Safe";
    if (score >= 40) return "Moderate";
    if (score >= 20) return "Risky";
    return "Very Risky";
  };

  // Get safety bar color based on score
  const getSafetyBarColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    if (score >= 40) return "bg-orange-600";
    if (score >= 20) return "bg-red-600";
    return "bg-red-800";
  };

  return (
    <div
      className={`${ 
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md mb-5 `}
    >
      <h2
        className={`text-2xl font-semibold ${
          isDarkMode ? "text-purple-400" : "text-purple-800"
        } mb-4`}
      >
        Your Safety Score
      </h2>

      {/* Safety Score Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className={`h-4 rounded-full ${getSafetyBarColor(safetyScore)}`}
          style={{ width: `${safetyScore}%` }}
        ></div>
      </div>

      {/* Safety Score Details */}
      <div className="text-center">
        <p
          className={`text-4xl font-bold ${
            isDarkMode ? "text-purple-400" : "text-purple-800"
          } mb-2`}
        >
          {safetyScore}%
        </p>
        <p
          className={`text-lg ${
            isDarkMode ? "text-purple-300" : "text-purple-700"
          } mb-4`}
        >
          Safety Level:{" "}
          <span
            className={`font-semibold ${
              safetyScore >= 80
                ? "text-green-600"
                : safetyScore >= 60
                ? "text-yellow-600"
                : safetyScore >= 40
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {getSafetyLevel(safetyScore)}
          </span>
        </p>
        <p className={isDarkMode ? "text-purple-300" : "text-gray-600"}>
          {isDaytime ? (
            <span className="flex items-center justify-center">
              <FaSun className="mr-2" /> Daytime
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FaMoon className="mr-2" /> Nighttime
            </span>
          )}
        </p>
      </div>

      {/* Additional Information */}
      <div
        className={`mt-6 text-sm ${
          isDarkMode ? "text-purple-300" : "text-gray-600"
        }`}
      >
        <p>Your safety score is calculated based on:</p>
        <ul className="list-disc list-inside mt-2">
          <li>
            Criminal Rate:{" "}
            <span className="font-semibold">{criminalRate}%</span>
          </li>
          <li>
            Weather: <span className="font-semibold">{weatherCondition}</span>
          </li>
          <li>
            Crowd Density: <span className="font-semibold">{crowdDensity}</span>
          </li>
          <li>
            Lighting: <span className="font-semibold">{lightingCondition}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SafetyScore;
