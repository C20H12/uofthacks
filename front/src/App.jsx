import { useState } from 'react';
import VideoWindow from './VideoWindow';
import ImageResults from './ImageResults';
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState(''); // 'video' or 'results'
  const [resultData, setResultData] = useState(null);

  const handleNext = (data) => {
    setResultData(data);
    setCurrentView('results');
  };

  return (
    <div className="button-container">
      <button className="open-button" onClick={() => setCurrentView('video')}>
        Upload Video
      </button>
      
      {currentView === 'video' && (
        <VideoWindow 
          onClose={() => setCurrentView(null)} 
          onNext={handleNext}
        />
      )}
      
      {currentView === 'results' && (
        <ImageResults
          onClose={() => setCurrentView(null)}
          videoText={resultData?.videoText}
          selectedOptions={resultData?.checkedItems}
        />
      )}
    </div>
  );
}

export default App;
