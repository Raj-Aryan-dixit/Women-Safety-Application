import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import DarkModeToggle from "../components/DarkModeToggle";

const EmergencyContacts = ({
  contacts,
  isDarkMode,
  onEdit,
  onDelete,
  onToggleFavorite,
  emergencyContacts,
  onImportant,
}) => {
  return (
    <div
      className={`p-8 rounded-3xl shadow-xl transition-all duration-500 backdrop-blur-lg ${
        isDarkMode
          ? "bg-gray-800/90 border border-gray-700/50 text-white"
          : "bg-white/95 border border-gray-100 text-gray-900"
      }`}
    >
      <h2
        className={`text-3xl font-extrabold mb-8 flex items-center ${
          isDarkMode ? "text-purple-300" : "text-purple-700"
        }`}
      >
        Emergency Contacts
      </h2>
      <ul className="space-y-5">
        {contacts.map((contact, index) => {
          const isCustomContact = index >= emergencyContacts.length;
          return (
            <li
              key={index}
              className={`flex justify-between items-center p-5 rounded-xl shadow-md transition-all duration-300 ${
                contact.isImportant ? "border-l-4 border-red-500" : ""
              } ${
                isDarkMode
                  ? "bg-gray-700/60 hover:bg-gray-600/80"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex flex-col space-y-2">
                <span
                  className={`text-xl font-semibold ${
                    isDarkMode ? "text-purple-200" : "text-purple-700"
                  }`}
                >
                  {contact.name}
                </span>
                <span
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  📞 {contact.number}
                </span>
                {contact.category && (
                  <span
                    className={`text-sm px-3 py-1 rounded-full inline-block ${
                      isDarkMode
                        ? "bg-purple-900/80 text-purple-200"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    🏷️ {contact.category}
                  </span>
                )}
                {contact.notes && (
                  <span
                    className={`text-sm italic ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    📝 {contact.notes}
                  </span>
                )}
                {contact.lastContacted && (
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Last contacted: {contact.lastContacted}
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                {isCustomContact && (
                  <button
                    onClick={() =>
                      onImportant(index - emergencyContacts.length)
                    }
                    className={`p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
                      contact.isImportant
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-400 hover:bg-gray-500 text-white"
                    }`}
                  >
                    ⚡
                  </button>
                )}
                <button
                  onClick={() =>
                    onToggleFavorite(index - emergencyContacts.length)
                  }
                  className={`p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 ${
                    contact.isFavorite
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                >
                  ⭐
                </button>
                <a
                  href={`tel:${contact.number}`}
                  className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-110"
                >
                  📞
                </a>
                {isCustomContact && (
                  <>
                    <button
                      onClick={() =>
                        onEdit(index - emergencyContacts.length, contact)
                      }
                      className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-md hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 transform hover:scale-110"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(index - emergencyContacts.length)}
                      className="p-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full shadow-md hover:from-red-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-110"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customContacts, setCustomContacts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [newContact, setNewContact] = useState({
    name: "",
    number: "",
    category: "",
    notes: "",
    isFavorite: false,
    isImportant: false,
    lastContacted: null,
  });
  const [isEditing, setIsEditing] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const emergencyContacts = [
    { name: "Police", number: "100", category: "Emergency" },
    { name: "Ambulance", number: "102", category: "Emergency" },
    { name: "Women Helpline", number: "1091", category: "Emergency" },
  ];

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const savedContacts =
      JSON.parse(localStorage.getItem("customContacts")) || [];
    setCustomContacts(savedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem("customContacts", JSON.stringify(customContacts));
  }, [customContacts]);

  const filteredContacts = [...emergencyContacts, ...customContacts].filter(
    (contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.number.includes(searchQuery);

      if (filter === "favorites") return contact.isFavorite && matchesSearch;
      if (filter === "important") return contact.isImportant && matchesSearch;
      return matchesSearch;
    }
  );

  const handleAddContact = () => {
    if (newContact.name && newContact.number) {
      if (isEditing !== null) {
        const updatedContacts = [...customContacts];
        updatedContacts[isEditing] = {
          ...newContact,
          lastContacted: newContact.lastContacted || null,
        };
        setCustomContacts(updatedContacts);
        setIsEditing(null);
      } else {
        setCustomContacts([
          ...customContacts,
          {
            ...newContact,
            lastContacted: new Date().toLocaleDateString(),
          },
        ]);
      }
      setNewContact({
        name: "",
        number: "",
        category: "",
        notes: "",
        isFavorite: false,
        isImportant: false,
        lastContacted: null,
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const handleToggleImportant = (index) => {
    const updatedContacts = [...customContacts];
    updatedContacts[index].isImportant = !updatedContacts[index].isImportant;
    setCustomContacts(updatedContacts);
  };

  return (
    <div
      className={`min-h-screen p-12 transition-all duration-700 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-950 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 text-gray-900"
      }`}
    >
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-out">
          Contact saved successfully! ✅
        </div>
      )}

      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6">
        <DarkModeToggle
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </div>

      <div className="max-w-3xl mx-auto pt-8">
        <h1
          className={`text-5xl font-extrabold text-center mb-12 ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"
          }`}
        >
          Emergency Contacts
        </h1>

        <div className="flex gap-5 mb-8">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 p-4 rounded-xl shadow-md border transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700 text-gray-200 placeholder-gray-400"
                : "bg-white/90 border-purple-200 text-gray-800 placeholder-gray-500"
            }`}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-4 rounded-xl shadow-md border transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800/80 border-gray-700 text-gray-200"
                : "bg-white/90 border-purple-200 text-gray-800"
            }`}
          >
            <option value="all">All Contacts</option>
            <option value="favorites">Favorites</option>
            <option value="important">Important</option>
          </select>
        </div>

        <div
          className={`p-8 rounded-3xl shadow-xl mb-8 transition-all duration-500 backdrop-blur-lg ${
            isDarkMode
              ? "bg-gray-800/90 border border-gray-700/50 text-white"
              : "bg-white/95 border border-gray-100 text-gray-900"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({ ...newContact, name: e.target.value })
              }
              className={`p-4 border rounded-xl shadow-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700/80 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white/90 border-gray-200 text-gray-800 placeholder-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newContact.number}
              onChange={(e) =>
                setNewContact({ ...newContact, number: e.target.value })
              }
              className={`p-4 border rounded-xl shadow-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDarkMode
                  ? "bg-gray-700/80 border-gray-600 text-gray-200 placeholder-gray-400"
                  : "bg-white/90 border-gray-200 text-gray-800 placeholder-gray-500"
              }`}
            />
          </div>
          <input
            type="text"
            placeholder="Category (e.g., Family, Friends)"
            value={newContact.category}
            onChange={(e) =>
              setNewContact({ ...newContact, category: e.target.value })
            }
            className={`w-full p-4 border rounded-xl mb-6 shadow-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isDarkMode
                ? "bg-gray-700/80 border-gray-600 text-gray-200 placeholder-gray-400"
                : "bg-white/90 border-gray-200 text-gray-800 placeholder-gray-500"
            }`}
          />
          <textarea
            placeholder="Notes"
            value={newContact.notes}
            onChange={(e) =>
              setNewContact({ ...newContact, notes: e.target.value })
            }
            className={`w-full p-4 border rounded-xl mb-6 shadow-md transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              isDarkMode
                ? "bg-gray-700/80 border-gray-600 text-gray-200 placeholder-gray-400"
                : "bg-white/90 border-gray-200 text-gray-800 placeholder-gray-500"
            }`}
          />
          <button
            onClick={handleAddContact}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            {isEditing !== null ? "Update Contact ✏️" : "Add Contact ➕"}
          </button>
        </div>

        <EmergencyContacts
          contacts={filteredContacts}
          isDarkMode={isDarkMode}
          onEdit={(index, contact) => {
            setNewContact(contact);
            setIsEditing(index);
          }}
          onDelete={(index) =>
            setCustomContacts(customContacts.filter((_, i) => i !== index))
          }
          onToggleFavorite={(index) => {
            const updatedContacts = [...customContacts];
            updatedContacts[index].isFavorite =
              !updatedContacts[index].isFavorite;
            setCustomContacts(updatedContacts);
          }}
          onImportant={handleToggleImportant}
          emergencyContacts={emergencyContacts}
        />
      </div>
    </div>
  );
};

export default Contacts;
