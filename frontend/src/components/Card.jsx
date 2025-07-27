import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
// NEW: Added FiDownload icon
import { FiEdit, FiTrash2, FiSave, FiXCircle, FiDownload } from 'react-icons/fi'; 

const Card = ({ _id, name, caption, photo, handleDeletePost, handleUpdatePost }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedCaption, setEditedCaption] = useState(caption);
  // NEW: State to manage the download button's status
  const [isDownloading, setIsDownloading] = useState(false);
  
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  const handleMouseMove = (event) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      x.set(event.clientX - rect.left - rect.width / 2);
      y.set(event.clientY - rect.top - rect.height / 2);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const onSave = () => {
    if (!editedName.trim() || !editedCaption.trim()) {
      alert("Name and caption cannot be empty.");
      return;
    }
    handleUpdatePost(_id, { name: editedName, caption: editedCaption });
    setIsEditing(false);
  };

  const onCancel = () => {
    setEditedName(name);
    setEditedCaption(caption);
    setIsEditing(false);
  };

  // NEW: Function to handle the image download
  const handleDownload = async (e) => {
    e.stopPropagation(); // Stop event bubbling
    setIsDownloading(true);
    try {
      const response = await fetch(photo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Create a filename from the original photo URL
      const filename = photo.split('/').pop() || 'community-image.jpg';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Could not download the image.');
    } finally {
      setIsDownloading(false);
    }
  };

  const detailsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={cardRef}
      className="rounded-xl group relative shadow-card card overflow-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px', rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <img className="w-full h-auto object-cover rounded-xl" src={photo} alt={caption} />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 bg-black/40 backdrop-blur-[6px] p-4 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div key="editing" initial="hidden" animate="visible" exit="hidden" variants={detailsVariants} className="flex flex-col gap-2 h-full justify-center">
              <motion.input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full p-2 bg-gray-900/50 border border-gray-400 rounded-md text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" variants={itemVariants} placeholder="Your Name" />
              <motion.textarea value={editedCaption} onChange={(e) => setEditedCaption(e.target.value)} className="w-full p-2 bg-gray-900/50 border border-gray-400 rounded-md text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" rows="3" variants={itemVariants} placeholder="Image Caption" />
              <motion.div className="flex justify-end gap-2 mt-2" variants={itemVariants}>
                <button onClick={onSave} className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-semibold transition-colors"><FiSave /> Save</button>
                <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded-md font-semibold transition-colors"><FiXCircle /> Cancel</button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="display" initial="hidden" animate="visible" exit="hidden" variants={detailsVariants} className="flex flex-col h-full justify-end">
              <motion.p variants={itemVariants} className="text-white text-sm overflow-y-auto prompt">{caption}</motion.p>
              <motion.div variants={itemVariants} className="mt-4 flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold ring-2 ring-white/50">{name[0]}</div>
                  <p className="text-white text-sm font-medium">{name}</p>
                </div>
                {/* NEW: Container for the action buttons */}
                <div className="flex items-center gap-1">
                  <button type="button" onClick={handleDownload} disabled={isDownloading} className="p-2 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-wait">
                    <FiDownload className="text-blue-300"/>
                  </button>
                  <button type="button" onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <FiEdit className="text-white"/>
                  </button>
                  <button type="button" onClick={() => handleDeletePost(_id)} className="p-2 rounded-full hover:bg-white/20 transition-colors">
                    <FiTrash2 className="text-red-400"/>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none"></div>
    </motion.div>
  );
};

export default Card;