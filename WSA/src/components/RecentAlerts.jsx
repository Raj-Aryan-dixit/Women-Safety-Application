import { useState, useEffect } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaNewspaper } from "react-icons/fa";

const RecentAlerts = ({ isDarkMode }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch crime news for India
  const fetchCrimeNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "in", // India
          apiKey: import.meta.env.VITE_NEWSAPI_KEY, // Replace with your NewsAPI key
        },
      });
      console.log("API Response:", response.data); // Log the response
      if (response.data.articles.length === 0) {
        setError("No crime news found at the moment.");
      } else {
        setNews(response.data.articles);
      }
    } catch (error) {
      console.error("Error fetching crime news:", error);
      setError("Failed to load crime news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch news on component mount
  useEffect(() => {
    fetchCrimeNews();
  }, []);

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-6 rounded-lg shadow-md mb-8 transition-all duration-300`}
    >
      <h2
        className={`text-2xl font-semibold ${
          isDarkMode ? "text-purple-400" : "text-purple-800"
        } mb-4`}
      >
        <FaExclamationTriangle className="inline-block mr-2" />
        Latest Crime News in India
      </h2>

      {loading && (
        <div className="text-center text-purple-600 animate-pulse">
          <FaNewspaper className="inline-block mr-2" />
          Loading news...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
          {error}
          <button
            onClick={fetchCrimeNews}
            className="ml-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="text-center text-gray-500">
          No crime news found at the moment.
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <div className="space-y-3">
          {news.slice(0, 5).map((article, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 text-purple-200"
                  : "bg-purple-50 text-purple-800"
              }`}
            >
              <h3 className="font-semibold">{article.title}</h3>
              <p className="text-sm">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${
                  isDarkMode ? "text-purple-300" : "text-purple-600"
                } hover:underline`}
              >
                Read more →
              </a>
              <p className="text-xs opacity-75 mt-1">
                Source: {article.source.name} | Published:{" "}
                {new Date(article.publishedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
