import { useState, useEffect } from "react";
import {
  FaSun,
  FaMoon,
  FaCloudRain,
  FaUsers,
  FaLightbulb,
} from "react-icons/fa";

const SafetyScore = () => {
  // State for safety score
  const [safetyScore, setSafetyScore] = useState(0);

  // State for day/night mode
  const [isDaytime, setIsDaytime] = useState(true);

  // Mock data (replace with real-time API data)
  const criminalRate = 30; // Example: 30% criminal rate in the area
  const weatherCondition = "rain"; // Example: "sunny", "rain", "storm"
  const crowdDensity = "low"; // Example: "low", "medium", "high"
  const lightingCondition = "poor"; // Example: "good", "poor"

  // Calculate safety score
  useEffect(() => {
    const calculateSafetyScore = () => {
      // Base score (100 is safest, 0 is least safe)
      let score = 100 - criminalRate;

      // Adjust score based on day/night
      if (!isDaytime) {
        score -= 20; // Reduce safety score by 20% at night
      }

      // Adjust score based on weather conditions
      if (weatherCondition === "rain") {
        score -= 10; // Reduce safety score by 10% during rain
      } else if (weatherCondition === "storm") {
        score -= 20; // Reduce safety score by 20% during storms
      }

      // Adjust score based on crowd density
      if (crowdDensity === "low") {
        score -= 15; // Reduce safety score by 15% in low-density areas
      } else if (crowdDensity === "medium") {
        score -= 5; // Reduce safety score by 5% in medium-density areas
      }

      // Adjust score based on lighting conditions
      if (lightingCondition === "poor") {
        score -= 10; // Reduce safety score by 10% in poorly lit areas
      }

      // Ensure score is within 0-100 range
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
    setIsDaytime(currentHour >= 6 && currentHour < 18); // Daytime between 6 AM and 6 PM
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
    if (score >= 80) return "bg-green-600"; // Very Safe
    if (score >= 60) return "bg-yellow-600"; // Safe
    if (score >= 40) return "bg-orange-600"; // Moderate
    if (score >= 20) return "bg-red-600"; // Risky
    return "bg-red-800"; // Very Risky
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-5">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4">
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
        <p className="text-4xl font-bold text-purple-800 mb-2">
          {safetyScore}%
        </p>
        <p className="text-lg text-purple-700 mb-4">
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
        <p className="text-gray-600">
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
      <div className="mt-6 text-sm text-gray-600">
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
