import React from 'react'

function LocationSharing() {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <button
          onClick={handleLocationSharing}
          className={`${
            isDarkMode
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white px-8 py-4 rounded-full shadow-lg transition duration-300 transform hover:scale-105`}
        >
          <FaMapMarkerAlt className="inline-block mr-2" />
          {isSharingLocation ? "Stop Sharing" : "Share Live Location"}
        </button>
      </div>
      ;
    </div>
  );
}

export default LocationSharing
