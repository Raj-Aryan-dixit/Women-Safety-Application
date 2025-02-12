import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 h-full w-60 bg-gradient-to-r from-blue-700 to-purple-700 text-white flex flex-col p-6 shadow-lg md:hidden"
          >
            {/* Close Button */}
            <button
              className="text-2xl mb-6 self-end"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>

            {/* Navigation Links */}
            <NavLinks
              user={user}
              handleLogout={handleLogout}
              setIsOpen={setIsOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white shadow-lg"
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold hover:text-blue-200 transition duration-300"
          >
            Women Safety App
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setIsOpen(true)}
          >
            <FaBars />
          </button>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            <NavLinks user={user} handleLogout={handleLogout} />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

/* Reusable Navigation Links Component */
const NavLinks = ({ user, handleLogout, setIsOpen }) => (
  <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
    <Link
      to="/"
      className="nav-link"
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      Home
    </Link>

    <Link
      to="/contacts"
      className="nav-link"
      onClick={() => setIsOpen && setIsOpen(false)}
    >
      Emergency Contacts
    </Link>

    {user ? (
      <>
        <Link
          to="/profile"
          className="nav-link"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          Profile
        </Link>

        <motion.button
          onClick={() => {
            handleLogout();
            setIsOpen && setIsOpen(false);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
        >
          Logout
        </motion.button>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="nav-link"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="nav-link"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          Signup
        </Link>
      </>
    )}
  </div>
);

export default Navbar;
