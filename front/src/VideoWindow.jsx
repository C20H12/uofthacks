import { useState, useRef } from 'react';
import VideoTextEditWindow from './VideoTextEditWindow';

export const BACK_URL = "http://34.121.139.27:5000"; //"https://4163cb1d3bd36a.lhr.life";

function VideoWindow({ onClose, onNext }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({status: "Initializing..."});
  const [isUploaded, setIsUploaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showTextEdit, setShowTextEdit] = useState(false);
  const [videoText, setVideoText] = useState("");
  const [altText, setAltText] = useState([]);
  const fileInputRef = useRef(null);

  const options = {
    'Object Detection': "Identify all objects present in the frame.",
    'Scene Description': "Describe the scene depicted in the frame.",
    'Action Recognition': "What activity is the person engaging in?",
    'Emotion Detection': "Determine the emotions of the individuals shown.",
    'Environmental Context': "Identify the setting or location shown.",
    'Text Recognition (OCR)': "ext Recognition “Extract any text present in the frame.",
    'Anomaly Detection': "Identify any unusual elements in the frame.",
    'Object Counting': "Count the number of [specific object] present.",
    'Color Analysis': "Describe the color scheme of the scene.",
    'Weather Conditions': "Determine the weather depicted in the frame."
  };
  const checklistItems = Object.keys(options);

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
    const intId = setInterval(async () => {
      const status = await fetch(BACK_URL + "/status");
      setLoadingStatus(await status.json())
    }, 1000);
    try {
      const buffer = await file.arrayBuffer();
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64bytes = btoa(binary);
      // console.log("b64bytes")
      const res = await fetch(BACK_URL + "/upload_video", {
        method: 'POST',
        body: JSON.stringify({
          "video_file": b64bytes,
          "options": checkedItems.map(ci => options[ci])
        }),
        headers: {
          "Content-Type": "application/json",
        }
      });

      const txt = await res.json()
      clearInterval(intId)
      
      console.log(txt)
      setVideoText(txt.description);
      setAltText(txt.alternates)
      setVideoUrl(URL.createObjectURL(file));
      setIsUploaded(true);
    } catch (error) {
      alert("error: " + error);
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    onNext({
      videoText
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
                    <p>{loadingStatus.status}</p>
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
                    <p>or Click to Select</p>
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
            altData={altText}
          />
        )
      }
    </>
  );
}

export default VideoWindow;