import { useState, useEffect } from "react";

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
      className={`p-6 rounded-2xl shadow-xl transition-all duration-300 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2
        className={`text-3xl font-extrabold mb-6 ${
          isDarkMode ? "text-purple-400" : "text-purple-700"
        }`}
      >
        Emergency Contacts
      </h2>
      <ul className="space-y-4">
        {contacts.map((contact, index) => {
          const isCustomContact = index >= emergencyContacts.length;
          return (
            <li
              key={index}
              className={`flex justify-between items-center p-4 rounded-xl shadow-md transition-all duration-300 ${
                contact.isImportant ? "border-l-4 border-red-500" : ""
              } ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex flex-col space-y-1">
                <span
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-purple-300" : "text-purple-700"
                  }`}
                >
                  {contact.name}
                </span>
                <span className="text-sm">📞 {contact.number}</span>
                {contact.category && (
                  <span
                    className={`text-sm px-2 py-1 rounded-full inline-block ${
                      isDarkMode ? "bg-purple-900" : "bg-purple-100"
                    }`}
                  >
                    🏷️ {contact.category}
                  </span>
                )}
                {contact.notes && (
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    📝 {contact.notes}
                  </span>
                )}
                {contact.lastContacted && (
                  <span className="text-xs text-gray-500">
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
                    className={`p-2 rounded-full transition-all ${
                      contact.isImportant
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    ⚡
                  </button>
                )}
                <button
                  onClick={() =>
                    onToggleFavorite(index - emergencyContacts.length)
                  }
                  className={`p-2 rounded-full transition-all ${
                    contact.isFavorite
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  ⭐
                </button>
                <a
                  href={`tel:${contact.number}`}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
                >
                  📞
                </a>
                {isCustomContact && (
                  <>
                    <button
                      onClick={() =>
                        onEdit(index - emergencyContacts.length, contact)
                      }
                      className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(index - emergencyContacts.length)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
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
  const [filter, setFilter] = useState("all"); // all, favorites, important
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

      // Show success message
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
      className={`min-h-screen p-10 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          Contact saved successfully! ✅
        </div>
      )}

      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 left-4 p-3 rounded-full shadow-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
      >
        {isDarkMode ? "🌞" : "🌙"}
      </button>

      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-5xl font-extrabold text-center mb-10 ${
            isDarkMode ? "text-purple-400" : "text-purple-700"
          }`}
        >
          Emergency Contacts
        </h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 p-4 rounded-2xl shadow-md border transition-all focus:ring-2 focus:ring-purple-500 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-purple-300 text-gray-900"
            }`}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`p-4 rounded-2xl shadow-md border transition-all ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-purple-300 text-gray-900"
            }`}
          >
            <option value="all">All Contacts</option>
            <option value="favorites">Favorites</option>
            <option value="important">Important</option>
          </select>
        </div>

        <div
          className={`p-6 rounded-2xl shadow-lg mb-6 transition-all ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              value={newContact.name}
              onChange={(e) =>
                setNewContact({ ...newContact, name: e.target.value })
              }
              className={`p-4 border rounded-xl shadow-md transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newContact.number}
              onChange={(e) =>
                setNewContact({ ...newContact, number: e.target.value })
              }
              className={`p-4 border rounded-xl shadow-md transition-all ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
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
            className={`w-full p-4 border rounded-xl mb-4 shadow-md transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <textarea
            placeholder="Notes"
            value={newContact.notes}
            onChange={(e) =>
              setNewContact({ ...newContact, notes: e.target.value })
            }
            className={`w-full p-4 border rounded-xl mb-4 shadow-md transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <button
            onClick={handleAddContact}
            className="w-full p-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-md"
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
