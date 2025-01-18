import { useState, useEffect } from 'react';
import {BACK_URL} from "./VideoWindow"

function ImageResults({ onClose, videoText, selectedOptions }) {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateImages();
  }, []);

  const generateImages = async () => {
    console.log(videoText, selectedOptions, BACK_URL)
    try {
      setIsLoading(true);
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     text: videoText,
      //     options: selectedOptions
      //   }),
      // });
      await new Promise(resolve => setTimeout(resolve, 2000));
      // const data = await response.json();
      
      // setImages(data.images);
      setImages(["a", "a", "a", "a"]);
    } catch (err) {
      setError('Failed to generate images');
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
          <div className="image-grid">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Generated ${index + 1}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageResults;