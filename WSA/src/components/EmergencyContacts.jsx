import { useState } from "react";
import { FaPhone, FaTrash, FaEdit, FaDownload, FaUpload, FaSun, FaMoon } from "react-icons/fa";

// EmergencyContacts Component
const EmergencyContacts = ({ contacts, isDarkMode, onEdit, onDelete }) => {
  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-2xl font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-800"} mb-4`}>
        Emergency Contacts
      </h2>
      <ul className="space-y-2">
        {contacts.map((contact, index) => (
          <li
            key={index}
            className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} p-3 rounded-lg flex justify-between items-center`}
          >
            <span className={`font-medium ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
              {contact.name}: {contact.number}
            </span>
            <div className="flex space-x-2">
              <a
                href={`tel:${contact.number}`}
                className={`${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 hover:bg-purple-700"} text-white p-2 rounded-lg transition-colors`}
              >
                <FaPhone />
              </a>
              <button
                onClick={() => onEdit(index)}
                className={`${isDarkMode ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white p-2 rounded-lg transition-colors`}
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(index)}
                className={`${isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"} text-white p-2 rounded-lg transition-colors`}
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Contacts Component
const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customContacts, setCustomContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", number: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Predefined emergency contacts
  const emergencyContacts = [
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "102" },
    { name: "Women Helpline", number: "1091" },
  ];

  // Combine predefined and custom contacts
  const allContacts = [...emergencyContacts, ...customContacts];

  // Filter contacts based on search query
  const filteredContacts = allContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.number.includes(searchQuery)
  );

  // Add or update a contact
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

  // Edit a contact
  const handleEditContact = (index) => {
    const contactToEdit = customContacts[index];
    setNewContact(contactToEdit);
    setIsEditing(index);
  };

  // Delete a contact
  const handleDeleteContact = (index) => {
    const updatedContacts = customContacts.filter((_, i) => i !== index);
    setCustomContacts(updatedContacts);
  };

  // Import contacts from a JSON file
  const handleImportContacts = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedContacts = JSON.parse(e.target.result);
      setCustomContacts(importedContacts);
    };
    reader.readAsText(file);
  };

  // Export contacts to a JSON file
  const handleExportContacts = () => {
    const data = JSON.stringify(customContacts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "emergency_contacts.json";
    link.click();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-purple-50 to-purple-100"} p-6`}>
      {/* Dark Mode Toggle (Top Left) */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-4 left-4 p-3 rounded-full shadow-lg ${isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-white hover:bg-gray-100"} transition-colors`}
      >
        {isDarkMode ? <FaSun className="text-white" /> : <FaMoon className="text-purple-800" />}
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold ${isDarkMode ? "text-purple-400" : "text-purple-800"} mb-8`}>
          Emergency Contacts
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-3 border ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-purple-300 bg-white"} rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />

        {/* Add/Edit Contact Form */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className={`w-full p-3 border ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-purple-300 bg-white"} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContact.number}
            onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
            className={`w-full p-3 border ${isDarkMode ? "border-gray-700 bg-gray-800 text-white" : "border-purple-300 bg-white"} rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <button
            onClick={handleAddContact}
            className={`w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors`}
          >
            {isEditing !== null ? "Update Contact" : "Add Contact"}
          </button>
        </div>

        {/* Import/Export Buttons */}
        <div className="flex space-x-4 mb-6">
          <input
            type="file"
            accept=".json"
            onChange={handleImportContacts}
            className="hidden"
            id="import-contacts"
          />
          <label
            htmlFor="import-contacts"
            className={`flex items-center justify-center w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer`}
          >
            <FaUpload className="mr-2" />
            Import Contacts
          </label>
          <button
            onClick={handleExportContacts}
            className={`flex items-center justify-center w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors`}
          >
            <FaDownload className="mr-2" />
            Export Contacts
          </button>
        </div>

        {/* Display Contacts */}
        <EmergencyContacts
          contacts={filteredContacts}
          isDarkMode={isDarkMode}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
        />
      </div>
    </div>
  );
};

export default Contacts;