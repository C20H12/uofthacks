import { useState, useEffect } from 'react';

function VideoTextEditWindow({ onClose, onNext, textData = "" }) {
  const [editedText, setEditedText] = useState(textData);
  const [wordCount, setWordCount] = useState(0);
  const CHR_LIMIT = 500;

  useEffect(() => {
    const words = editedText.trim().replace(/\s/gm, "");
    setWordCount(words.length);
  }, [editedText]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setEditedText(newText);
  };

  const handleSave = () => {
    if (wordCount <= CHR_LIMIT) {
      onSave(editedText);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="video-text-edit">
          <h2>Edit Video Text</h2>
          <textarea
            className="text-edit-area"
            value={editedText}
            onChange={handleTextChange}
            placeholder="Enter your text here..."
            rows={10}
          />
          <div className="word-count">
            <span className={wordCount > CHR_LIMIT ? 'text-error' : ''}>
              {wordCount}/{CHR_LIMIT} words
            </span>
          </div>
          <button 
            className="fn-btns" 
            onClick={handleSave}
            disabled={wordCount > CHR_LIMIT}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoTextEditWindow;