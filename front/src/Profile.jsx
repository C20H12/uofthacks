import { useState, useEffect } from 'react';
import { BACK_URL } from './VideoWindow';
import ImageModal from './ImageModal';


function Profile({ onClose }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titles, setTitles] = useState([]);
  const [significances, setSignificances] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedSignificance, setSelectedSignificance] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      //setImages([1,2,3,4,5,6,7,8,9,10])
      const response = await fetch(`${BACK_URL}/get_images`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      console.log("Test", data);
      setImages(data.histories.map(history => history.images.map(imgurl => "data:image/png;base64," + imgurl)));
      setTitles(data.histories.map(history => history.title));
      setSignificances(data.histories.map(history => history.significance));
    } catch (err) {
      // setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="profile-content">
          <h2>Your Generated Images</h2>
          
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading images...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="image-grid">
              {images.map((image, index) => (
                <div key={index} className="image-item">
                    <img src={image} alt={`Generated ${index + 1}`} 
                            onClick={() => {setShowImageModal(true); 
                                          setSelectedImage(image); setSelectedTitle(titles[index]); 
                                          setSelectedSignificance(significances[index]);}} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    {showImageModal && (
      <ImageModal
        images={selectedImage}
        title={selectedTitle}
        significance={selectedSignificance}
        onClose={() => setShowImageModal(false)}
      />
    )}
    </>
  );
}

export default Profile;