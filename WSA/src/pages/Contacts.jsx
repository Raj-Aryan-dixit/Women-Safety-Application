import { useState, useEffect } from "react";
import {
  FaPhone,
  FaTrash,
  FaEdit,
  FaDownload,
  FaUpload,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const EmergencyContacts = ({
  contacts,
  isDarkMode,
  onEdit,
  onDelete,
  emergencyContacts,
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
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span
                className={`text-lg font-semibold ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                }`}
              >
                {contact.name}: {contact.number}
              </span>
              <div className="flex space-x-3">
                <a
                  href={`tel:${contact.number}`}
                  className="p-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-all"
                >
                  <FaPhone />
                </a>
                {isCustomContact && (
                  <>
                    <button
                      onClick={() => onEdit(index - emergencyContacts.length)}
                      className="p-3 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 transition-all"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(index - emergencyContacts.length)}
                      className="p-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-all"
                    >
                      <FaTrash />
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
  const [newContact, setNewContact] = useState({ name: "", number: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
    { name: "Women Helpline", number: "1091" },
  ];

  useEffect(() => {
    const savedContacts =
      JSON.parse(localStorage.getItem("customContacts")) || [];
    setCustomContacts(savedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem("customContacts", JSON.stringify(customContacts));
  }, [customContacts]);

  const filteredContacts = [...emergencyContacts, ...customContacts].filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.includes(searchQuery)
  );

  const handleAddContact = () => {
    if (newContact.name && newContact.number) {
      if (isEditing !== null) {
        const updatedContacts = [...customContacts];
        updatedContacts[isEditing] = newContact;
        setCustomContacts(updatedContacts);
        setIsEditing(null);
      } else {
        setCustomContacts([...customContacts, newContact]);
      }
      setNewContact({ name: "", number: "" });
    }
  };

  return (
    <div
      className={`min-h-screen p-10 transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 left-4 p-3 rounded-full shadow-lg bg-purple-600 text-white hover:bg-purple-700 transition-all"
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-5xl font-extrabold text-center mb-10 ${
            isDarkMode ? "text-purple-400" : "text-purple-700"
          }`}
        >
          Emergency Contacts
        </h1>

        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-4 rounded-2xl shadow-md mb-6 border transition-all focus:ring-2 focus:ring-purple-500 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-purple-300 text-gray-900"
          }`}
        />

        <div
          className={`p-6 rounded-2xl shadow-lg mb-6 transition-all ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
            className={`w-full p-4 border rounded-xl mb-3 shadow-md transition-all ${
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
            className={`w-full p-4 border rounded-xl mb-3 shadow-md transition-all ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <button
            onClick={handleAddContact}
            className="w-full p-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all shadow-md"
          >
            {isEditing !== null ? "Update Contact" : "Add Contact"}
          </button>
        </div>

        <EmergencyContacts
          contacts={filteredContacts}
          isDarkMode={isDarkMode}
          onEdit={(index) => setIsEditing(index)}
          onDelete={(index) =>
            setCustomContacts(customContacts.filter((_, i) => i !== index))
          }
          emergencyContacts={emergencyContacts}
        />
      </div>
    </div>
  );
};

export default Contacts;
