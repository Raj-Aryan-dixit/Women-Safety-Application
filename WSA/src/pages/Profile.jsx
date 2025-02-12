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
  }, []);

  // Handle Profile Picture Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    setUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/upload-profile-picture/${user._id}`, // Pass user ID
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-800 mb-8">Profile</h1>

        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : user ? (
          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* Profile Picture Upload Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <label htmlFor="profilePicUpload" className="cursor-pointer">
                  {profilePic ? (
                    <img
                      src={`http://localhost:5000${profilePic}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-purple-600 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-5xl text-purple-600" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full">
                    <FaCamera className="text-white text-lg" />
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
                <p className="text-purple-600 mt-2">Uploading...</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FaEnvelope className="text-purple-600" />
                <p className="text-gray-700">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <FaPhone className="text-purple-600" />
                <p className="text-gray-700">
                  <strong>Phone:</strong> {user.phone || "Not provided"}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <FaMapMarkerAlt className="text-purple-600" />
                <p className="text-gray-700">
                  <strong>Location:</strong>{" "}
                  {typeof user?.location === "object" &&
                  user.location?.coordinates
                    ? `Lat: ${user.location.coordinates[1]}, Lng: ${user.location.coordinates[0]}`
                    : user?.location || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-purple-800 mb-4">
                Emergency Contacts
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-700">
                  <strong>Police:</strong> 100
                </li>
                <li className="text-gray-700">
                  <strong>Ambulance:</strong> 102
                </li>
                <li className="text-gray-700">
                  <strong>Women Helpline:</strong> 1091
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-700">No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
