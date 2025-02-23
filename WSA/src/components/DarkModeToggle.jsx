import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className=" z-50 fixed top-20 left-1.5 p-3 rounded-full shadow-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
    >
      {isDarkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default DarkModeToggle;
