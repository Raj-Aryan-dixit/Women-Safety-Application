const SOSButton = () => {
  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        alert(`SOS Alert! Your location: ${latitude}, ${longitude}`);
        // You can also send this location to emergency contacts via an API
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <button
      onClick={handleSOS}
      className="bg-red-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
    >
      SOS
    </button>
  );
};

export default SOSButton;
