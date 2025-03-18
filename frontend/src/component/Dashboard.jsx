import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImages, viewImage } from "../api";
import UploadImageModal from "./UploadImageModal";

function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const imageData = await getImages();
      const imagesWithUrls = await Promise.all(
        imageData.map(async (img) => {
          const imageUrl = await viewImage(img.id);
          return { ...img, imageUrl };
        })
      );
      setImages(imagesWithUrls);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-700">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </header>

      <div className="px-6 py-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md shadow-md transition"
        >
          Upload Image
        </button>
      </div>

      <UploadImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchImages}
      />

      <div className="px-6 pb-8">
        {loading ? (
          <p className="text-center text-gray-600">Loading images...</p>
        ) : images.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img, index) => (
              <Link key={img.id} to={`/view/${img.id}`}>
                <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-xl transition">
                  {img.imageUrl ? (
                    <img
                      src={img.imageUrl}
                      alt={`Uploaded ${index}`}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      Loading...
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No images uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
