import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/auth/profile/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data);
          setProfilePic(response.data.profilePicture || null);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationError(null);
        },
        (error) => {
          let errorMessage = "Unable to retrieve location. Please enable GPS.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please enable permissions.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
          }
          console.error("Geolocation error:", error);
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/upload-profile-picture/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePic(response.data.imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 p-8">
      <div className="mt-16 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-10 text-center tracking-tight">
          Your Profile
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse font-medium">
            Loading Profile...
          </p>
        ) : user ? (
          <div className="bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="flex flex-col items-center mb-10">
              <div className="relative group">
                <label
                  htmlFor="profilePicUpload"
                  className="cursor-pointer block"
                >
                  {profilePic ? (
                    <img
                      src={`http://localhost:5000${profilePic}`}
                      alt="Profile"
                      className="w-44 h-44 rounded-full border-4 border-indigo-500 object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-44 h-44 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-300 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <FaUser className="text-7xl text-indigo-500" />
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-indigo-600 p-3 rounded-full shadow-lg group-hover:bg-indigo-700 transition-all duration-300 transform group-hover:scale-110">
                    <FaCamera className="text-white text-xl" />
                  </div>
                </label>
                <input
                  type="file"
                  id="profilePicUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {uploading && (
                <p className="text-indigo-600 mt-3 text-sm font-medium animate-pulse">
                  Uploading Image...
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-5 p-5 bg-indigo-50/80 rounded-xl shadow-sm hover:bg-indigo-100/90 transition-all duration-300">
                <FaMapMarkerAlt className="text-indigo-600 text-2xl flex-shrink-0" />
                <p className="text-gray-800 text-lg">
                  <strong className="font-semibold">GPS Location:</strong>{" "}
                  {latitude && longitude ? (
                    <span>
                      Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                    </span>
                  ) : (
                    <span className="text-gray-600 italic">
                      {locationError || "Fetching location..."}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-5 p-5 bg-indigo-50/80 rounded-xl shadow-sm hover:bg-indigo-100/90 transition-all duration-300">
                <FaEnvelope className="text-indigo-600 text-2xl flex-shrink-0" />
                <p className="text-gray-800 text-lg">
                  <strong className="font-semibold">Email:</strong> {user.email}
                </p>
              </div>

              <div className="flex items-center space-x-5 p-5 bg-indigo-50/80 rounded-xl shadow-sm hover:bg-indigo-100/90 transition-all duration-300">
                <FaPhone className="text-indigo-600 text-2xl flex-shrink-0" />
                <p className="text-gray-800 text-lg">
                  <strong className="font-semibold">Phone:</strong>{" "}
                  {user.phone || (
                    <span className="text-gray-600 italic">Not provided</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg font-medium">
            No user data found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
