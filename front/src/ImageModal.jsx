import './App.css';

export default function ImageModal({ images, title, significance, onClose }) {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
            <div className="image-grid">
              {images.map((image, index) => (
                <img key={index} src={image} alt={`Generated ${index + 1}`} />
              ))}
            </div>
            <div className="image-info">
              <h2 className="image-title">{title}</h2>
              <p className="image-significance">{significance}</p>
            </div>
            </div>
        </div>
    );
}
