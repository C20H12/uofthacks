import { useState, useRef } from 'react';

function VideoWindow({ onClose, onNext }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        uploadVideo(file);
      } else {
        alert('Please upload a video file');
      }
    }
  };

  const uploadVideo = async (file) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Add your actual upload logic here
      console.log('Video uploaded:', file.name);
      setIsUploaded(true);
    } catch (error) {
      alert("error: " + error);
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="video-window">
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploaded && fileInputRef.current.click()}
          >
            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            ) : isUploaded ? (
              <div className="upload-success">
                <p>Upload Complete!</p>
                <button className="next-button" onClick={onNext}>
                  Next
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept="video/*"
                  style={{ display: 'none' }}
                />
                <p>Drag and drop a video file here</p>
                <p>or click to select</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoWindow;