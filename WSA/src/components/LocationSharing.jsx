const LocationSharing = () => {
  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        alert(`Share this link with your trusted contacts: ${url}`);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <button
      onClick={shareLocation}
      className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
    >
      Share Location
    </button>
  );
};

export default LocationSharing;
