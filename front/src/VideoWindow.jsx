import { useState, useRef } from 'react';
import VideoTextEditWindow from './VideoTextEditWindow';

function VideoWindow({ onClose, onNext }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showTextEdit, setShowTextEdit] = useState(false);
  const [videoText, setVideoText] = useState("");
  const fileInputRef = useRef(null);

  const checklistItems = [
    'Object Detection',
    'Scene Description',
    'Action Recognition',
    'Emotion Detection',
    'Environmental Context',
    'Text Recognition (OCR)',
    'Anomaly Detection',
    'Object Counting',
    'Color Analysis',
    'Weather Conditions'
  ];

  const handleCheckItem = (item) => {
    setCheckedItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

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
  
  const handleTextEdit = () => {
    setShowTextEdit(true);
  };

  const handleTextSave = (text) => {
    setVideoText(text);
    setShowTextEdit(false);
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
      // Simulate upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVideoUrl(URL.createObjectURL(file));
      setIsUploaded(true);
    } catch (error) {
      alert("error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    onNext({
      videoText,
      checkedItems
    });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="left-section">
            {isUploaded ? (
              <video className="video-preview" src={videoUrl} controls />
            ) : (
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
            )}
          </div>

          <div className="right-section">
            <h3>Processing Options:</h3>
            <ul className="checklist">
              {checklistItems.map((item) => (
                <li key={item} className="checklist-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item)}
                      onChange={() => handleCheckItem(item)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
            {isUploaded && (
              <div className="bottom-buttons">
                <button className='fn-btns' onClick={handleTextEdit}>Edit Text</button>
                <button className='fn-btns' onClick={handleNext}>Generate Images</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {
        showTextEdit && (
          <VideoTextEditWindow 
            onClose={() => setShowTextEdit(false)}
            onSave={handleTextSave}
            textData={videoText}
          />
        )
      }
    </>
  );
}

export default VideoWindow;