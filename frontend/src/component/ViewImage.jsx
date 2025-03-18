import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewImage } from "../api";

function ViewImage() {
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      const url = await viewImage(id);
      if (url) setImageUrl(url);
    };
    fetchImage();
  }, [id]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {imageUrl ? (
        <img src={imageUrl} alt="Full View" className="max-w-full max-h-screen" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default ViewImage;
