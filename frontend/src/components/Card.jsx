import React, { useState } from 'react';

// The Card component now accepts handler functions for updating and deleting
const Card = ({ _id, name, caption, photo, handleDeletePost, handleUpdatePost }) => {
  // State to manage whether the card is in "edit mode"
  const [isEditing, setIsEditing] = useState(false);

  // State to hold the values of the input fields during editing
  const [editedName, setEditedName] = useState(name);
  const [editedCaption, setEditedCaption] = useState(caption);

  // Handler for the "Save" button
  const onSave = () => {
    // Basic validation to prevent empty fields
    if (!editedName.trim() || !editedCaption.trim()) {
      alert("Name and caption cannot be empty.");
      return;
    }
    // Call the update function passed from the Home component
    handleUpdatePost(_id, { name: editedName, caption: editedCaption });
    // Exit edit mode
    setIsEditing(false);
  };

  // Handler for the "Cancel" button
  const onCancel = () => {
    // Reset the input fields to their original values
    setEditedName(name);
    setEditedCaption(caption);
    // Exit edit mode
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
      <img
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={caption}
      />
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        
        {/* Conditional Rendering: Show either the edit form or the display info */}
        {isEditing ? (
          // --- EDITING VIEW ---
          <div className="flex flex-col gap-2">
            <label className="text-white text-sm font-semibold">Name:</label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="text-white text-sm font-semibold mt-2">Caption:</label>
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="w-full p-1 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={onSave} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded font-semibold">Save</button>
              <button onClick={onCancel} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded font-semibold">Cancel</button>
            </div>
          </div>
        ) : (
          // --- DEFAULT DISPLAY VIEW ---
          <>
            <p className="text-white text-sm overflow-y-auto prompt">{caption}</p>
            <div className="mt-5 flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">{name[0]}</div>
                <p className="text-white text-sm">{name}</p>
              </div>
              
              {/* Edit and Delete Buttons */}
              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(true)} 
                  className="outline-none bg-transparent border-none text-white text-sm hover:text-blue-400 font-medium"
                >
                  Edit
                </button>
                <button 
                  type="button" 
                  onClick={() => handleDeletePost(_id)} 
                  className="outline-none bg-transparent border-none text-red-500 text-sm hover:text-red-400 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Card;