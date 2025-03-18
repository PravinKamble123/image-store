import { useState } from "react";
import { uploadImage } from "../api";
import { motion, AnimatePresence } from "framer-motion";

function UploadImageModal({ isOpen, onClose, onSuccess }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);

    try {
      await uploadImage(image);
      onSuccess(); 
      onClose();
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setImage(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 w-96"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Upload Image
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {image ? image.name : "Click to select an image"}
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                disabled={!image || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UploadImageModal;
