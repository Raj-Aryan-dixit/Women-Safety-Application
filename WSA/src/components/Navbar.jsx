import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = ({ onNavigate, currentPath = "/", user = null, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 h-full w-72 bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800 text-white flex flex-col p-8 shadow-2xl md:hidden z-50 backdrop-blur-lg bg-opacity-95"
          >
            {/* Close Button */}
            <button
              className="text-2xl mb-8 self-end hover:text-purple-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* Navigation Links */}
            <NavLinks
              currentPath={currentPath}
              user={user}
              onLogout={onLogout}
              onNavigate={handleNavigation}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-4 text-white shadow-xl relative z-40 backdrop-blur-sm"
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold hover:text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 transition duration-300"
          >
            Women Safety App
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden text-white text-2xl hover:text-purple-200 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </motion.button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
            <NavLinks
              currentPath={currentPath}
              user={user}
              onLogout={onLogout}
              onNavigate={handleNavigation}
            />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

/* Reusable Navigation Links Component */
const NavLinks = ({ currentPath, user, onLogout, onNavigate }) => {
  const NavLink = ({ path, children, className = "" }) => (
    <Link
      to={path}
      className={`${className} ${
        currentPath === path ? "text-blue-200" : "text-white"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 items-center">
      <NavLink path="/" className="nav-link relative group">
        <span className="relative inline-block hover:text-blue-200 transition-colors duration-300">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
        </span>
      </NavLink>

      <NavLink path="/contacts" className="nav-link relative group">
        <span className="relative inline-block hover:text-blue-200 transition-colors duration-300">
          Contacts
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
        </span>
      </NavLink>

      {user ? (
        <>
          <NavLink path="/profile" className="nav-link relative group">
            <span className="relative inline-block hover:text-blue-200 transition-colors duration-300">
              Profile
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </NavLink>

          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg hover:shadow-xl"
          >
            Logout
          </motion.button>
        </>
      ) : (
        <>
          <NavLink path="/login" className="nav-link relative group">
            <span className="relative inline-block hover:text-blue-200 transition-colors duration-300">
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-200 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </NavLink>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              path="/signup"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
            >
              Signup
            </NavLink>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Navbar;
