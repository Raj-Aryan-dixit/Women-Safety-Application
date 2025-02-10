import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-purple-600 p-4 text-white shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with hover effect */}
        <Link
          to="/"
          className="text-2xl font-bold hover:text-purple-200 transition duration-300"
        >
          Women Safety App
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4 flex items-center">
          <Link
            to="/"
            className="relative hover:text-purple-200 transition duration-300"
          >
            Home
            <motion.span
              whileHover={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300"
            />
          </Link>

          <Link
            to="/contacts"
            className="relative hover:text-purple-200 transition duration-300"
          >
            Emergency Contacts
            <motion.span
              whileHover={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300"
            />
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="relative hover:text-purple-200 transition duration-300"
              >
                Profile
                <motion.span
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300"
                />
              </Link>

              {/* Logout Button with Animation */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="relative hover:text-purple-200 transition duration-300"
              >
                Login
                <motion.span
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300"
                />
              </Link>

              <Link
                to="/signup"
                className="relative hover:text-purple-200 transition duration-300"
              >
                Signup
                <motion.span
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-200 transition-all duration-300"
                />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
