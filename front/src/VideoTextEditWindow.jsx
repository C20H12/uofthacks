import { useState } from 'react';

function VideoTextEditWindow({ onClose, onSave, textData = "" }) {
  const [editedText, setEditedText] = useState(textData);

  const handleSave = () => {
    onSave(editedText);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="video-text-edit">
          <h2>Edit Video Text</h2>
          <textarea
            className="text-edit-area"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Enter your text here..."
            rows={10}
          />
          <button className="fn-btns" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoTextEditWindow;