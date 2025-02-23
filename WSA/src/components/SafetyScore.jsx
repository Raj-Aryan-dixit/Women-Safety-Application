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
  const [crimeImpact, setCrimeImpact] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState("sunny");
  const [crowdDensity, setCrowdDensity] = useState("medium");
  const [lightingCondition, setLightingCondition] = useState("good");
  const [userState, setUserState] = useState("");
  const [loading, setLoading] = useState(true);

  // Replace with your API keys
  const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Get from OpenWeatherMap
  const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Get from Google Cloud Console

  // Fetch crime impact data
  const fetchCrimeImpact = async (state) => {
    try {
      const response = await axios.get("http://localhost:5000/api/crime-data");
      const stateCrimeData = response.data.find((item) => item.State === state);
      setCrimeImpact(stateCrimeData ? stateCrimeData.CrimeImpact : 0);
    } catch (error) {
      console.error("Error fetching crime data:", error);
      setCrimeImpact(0); // Default fallback
    }
  };

  // Fetch weather data
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const weather = response.data.weather[0].main.toLowerCase();
      if (weather.includes("rain")) setWeatherCondition("rain");
      else if (weather.includes("storm") || weather.includes("thunder"))
        setWeatherCondition("storm");
      else setWeatherCondition("sunny");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherCondition("sunny"); // Default fallback
    }
  };

  // Fetch crowd density (using Google Places API as a proxy)
  const fetchCrowdDensity = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&key=${GOOGLE_API_KEY}`
      );
      const places = response.data.results.length;
      if (places > 20) setCrowdDensity("high");
      else if (places > 5) setCrowdDensity("medium");
      else setCrowdDensity("low");
    } catch (error) {
      console.error("Error fetching crowd density:", error);
      setCrowdDensity("medium"); // Default fallback
    }
  };

  // Fetch all data based on user's location
  const fetchData = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Get state from reverse geocoding
            const geoResponse = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const state = geoResponse.data.principalSubdivision;
            setUserState(state);

            // Fetch all data concurrently
            await Promise.all([
              fetchCrimeImpact(state),
              fetchWeatherData(latitude, longitude),
              fetchCrowdDensity(latitude, longitude),
            ]);

            // Infer lighting condition
            const currentHour = new Date().getHours();
            setIsDaytime(currentHour >= 6 && currentHour < 18);
            setLightingCondition(
              isDaytime && weatherCondition === "sunny"
                ? "good"
                : isDaytime
                ? "moderate"
                : "poor"
            );
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const calculateSafetyScore = () => {
      let score = 100 - crimeImpact;
      if (!isDaytime) score -= 20;
      if (weatherCondition === "rain") score -= 10;
      if (weatherCondition === "storm") score -= 20;
      if (crowdDensity === "low") score -= 15;
      if (lightingCondition === "poor") score -= 10;
      if (lightingCondition === "moderate") score -= 5;
      score = Math.max(0, Math.min(100, score));
      setSafetyScore(score);
    };
    calculateSafetyScore();
  }, [
    crimeImpact,
    isDaytime,
    weatherCondition,
    crowdDensity,
    lightingCondition,
  ]);

  useEffect(() => {
    fetchData();
  }, []);

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
        Your Safety Score
      </h2>

      {loading ? (
        <p className="text-center text-lg font-medium animate-pulse">
          Calculating Safety Score...
        </p>
      ) : (
        <>
          <div className="w-full bg-gray-300/50 rounded-full h-5 mb-6 overflow-hidden">
            <div
              className={`h-5 rounded-full transition-all duration-700 ${
                safetyScore >= 80
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : safetyScore >= 60
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                  : safetyScore >= 40
                  ? "bg-gradient-to-r from-orange-500 to-amber-600"
                  : "bg-gradient-to-r from-red-500 to-rose-600"
              }`}
              style={{ width: `${safetyScore}%` }}
            ></div>
          </div>

          <div className="text-center">
            <p
              className={`text-5xl font-extrabold ${
                isDarkMode ? "text-purple-200" : "text-indigo-800"
              } mb-3`}
            >
              {safetyScore}%
            </p>
            <p
              className={`text-xl font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } mb-6`}
            >
              Safety Level:{" "}
              <span
                className={`font-semibold ${
                  safetyScore >= 80
                    ? "text-green-500"
                    : safetyScore >= 60
                    ? "text-yellow-500"
                    : safetyScore >= 40
                    ? "text-orange-500"
                    : "text-red-500"
                }`}
              >
                {safetyScore >= 80
                  ? "Very Safe"
                  : safetyScore >= 60
                  ? "Safe"
                  : safetyScore >= 40
                  ? "Moderate"
                  : safetyScore >= 20
                  ? "Risky"
                  : "Very Risky"}
              </span>
            </p>
            <p
              className={`text-lg flex items-center justify-center ${
                isDarkMode ? "text-purple-300" : "text-indigo-600"
              }`}
            >
              {isDaytime ? (
                <>
                  <FaSun className="mr-2 text-2xl" /> Daytime
                </>
              ) : (
                <>
                  <FaMoon className="mr-2 text-2xl" /> Nighttime
                </>
              )}
            </p>
          </div>

          <div
            className={`mt-8 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <p className="font-medium">Safety score factors:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <li className="flex items-center">
                <FaUsers className="mr-2 text-indigo-500" />
                Crime Impact:{" "}
                <span className="font-semibold ml-1">{crimeImpact}</span>
              </li>
              <li className="flex items-center">
                <FaCloudRain className="mr-2 text-indigo-500" />
                Weather:{" "}
                <span className="font-semibold ml-1 capitalize">
                  {weatherCondition}
                </span>
              </li>
              <li className="flex items-center">
                <FaUsers className="mr-2 text-indigo-500" />
                Crowd Density:{" "}
                <span className="font-semibold ml-1 capitalize">
                  {crowdDensity}
                </span>
              </li>
              <li className="flex items-center">
                <FaLightbulb className="mr-2 text-indigo-500" />
                Lighting:{" "}
                <span className="font-semibold ml-1 capitalize">
                  {lightingCondition}
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SafetyScore;
