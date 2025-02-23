import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaAddressBook,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay for Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-900 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white flex flex-col py-10 px-6 shadow-2xl md:hidden z-50 rounded-r-3xl backdrop-blur-md"
          >
            {/* Logo */}
            <div className="flex items-center mb-12 px-3">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center shadow-md">
                <span className="text-white text-2xl font-extrabold tracking-tight">
                  GS
                </span>
              </div>
              <span className="ml-4 text-2xl font-extrabold tracking-wide">
                Guardify
              </span>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-5 right-5 text-xl bg-white/10 p-3 rounded-full shadow-md hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </motion.button>

            {/* Navigation Links */}
            <div className="flex-1">
              <NavLinks
                user={user}
                handleLogout={handleLogout}
                setIsOpen={setIsOpen}
                isMobile={true}
              />
            </div>

            {/* Version */}
            <div className="text-xs text-white/40 mt-auto text-center font-light">
              Version 1.0.2
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${
          scrolled
            ? "bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-lg py-3 shadow-lg"
            : "bg-gradient-to-r from-indigo-800 via-purple-800 to-violet-800 py-4"
        } text-white fixed w-full z-40 transition-all duration-500`}
      >
        <div className="container mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/25 to-white/10 flex items-center justify-center mr-3 shadow-sm">
              <span className="text-white text-lg font-bold">GS</span>
            </div>
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight hover:text-indigo-200 transition-colors duration-300"
            >
              Guardify
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white text-xl bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 shadow-md"
            onClick={() => setIsOpen(true)}
          >
            <FaBars />
          </motion.button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks user={user} handleLogout={handleLogout} />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

/* Reusable Navigation Links Component */
const NavLinks = ({ user, handleLogout, setIsOpen, isMobile = false }) => {
  const linkClasses = isMobile
    ? "flex items-center py-4 px-5 w-full rounded-xl hover:bg-white/10 transition-all duration-300 mb-3 text-white font-semibold text-lg shadow-sm"
    : "flex items-center px-5 py-2.5 rounded-xl hover:bg-white/15 transition-all duration-300 text-white font-medium";

  return (
    <div
      className={`${
        isMobile ? "flex flex-col" : "flex items-center space-x-2"
      }`}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/"
          className={linkClasses}
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          <FaHome className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`} />
          Home
        </Link>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link
          to="/contacts"
          className={linkClasses}
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          <FaAddressBook className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`} />
          Contacts
        </Link>
      </motion.div>

      {user ? (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/profile"
              className={linkClasses}
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <FaUser className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`} />
              Profile
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen && setIsOpen(false);
              }}
              className={`${
                isMobile
                  ? "flex items-center w-full py-4 px-5 mt-6 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-md"
                  : "flex items-center ml-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-5 py-2.5 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 shadow-md"
              }`}
            >
              <FaSignOutAlt
                className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`}
              />
              Logout
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className={`${linkClasses} ${isMobile ? "mt-6" : ""}`}
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <FaSignInAlt
                className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`}
              />
              Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className={`${
                isMobile
                  ? "flex items-center py-4 px-5 mt-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md"
                  : "flex items-center ml-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-md"
              }`}
              onClick={() => setIsOpen && setIsOpen(false)}
            >
              <FaUserPlus className={`${isMobile ? "mr-4 text-xl" : "mr-2"}`} />
              Sign Up
            </Link>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Navbar;
