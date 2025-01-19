import { useState, useEffect } from 'react';
import {BACK_URL} from "./VideoWindow"

function ImageResults({ onClose, videoText }) {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const [significance, setSignificance] = useState("");

  useEffect(() => {
    generateImages();
  }, []);

  const generateImages = async () => {
    console.log(videoText, BACK_URL)
    try {
      setIsLoading(true);
      const res = await fetch(BACK_URL + "/generate_image", {
        method: 'POST',
        body: JSON.stringify({
          "text": videoText.slice(0, 500),
        }),
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      console.log(data)
      // setImages(data.images);
      if (typeof data.response === "string") {
        alert(data.response);
        return;
      }
      setImages(data.response.map(imgurl => "data:image/png;base64," + imgurl));
      setTitle(data.title);
      setSignificance(data.significance);
    } catch (err) {
      setError('Failed to generate images ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Generating images...</p>
          </div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="image-grid">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Generated ${index + 1}`} />
              ))}
            </div>
            <div className="image-info">
              <h2 className="image-title">{title}</h2>
              <p className="image-significance">{significance}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageResults;