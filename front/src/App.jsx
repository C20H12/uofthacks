import { useState } from 'react';
import VideoWindow from './VideoWindow';
import ImageResults from './ImageResults';
import Profile from './Profile';
import './App.css'
import './landing.css'


function App() {
  const [currentView, setCurrentView] = useState(''); // 'video' or 'results'
  const [resultData, setResultData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleNext = (data) => {
    setResultData(data);
    setCurrentView('results');
  };

  return (
    <>
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
      />
    )}

    {showProfile && (
      <Profile onClose={() => setShowProfile(false)} />
    )}

    <div className="landing-page">

      <div className="content">
        <h2>Want to see your everyday experience through an alternative Perspective?</h2>
        <h3>Look no further than...</h3>
        <h1>AltSim</h1>
        <p>A place where you could transform your everyday experiences to comical adventures!</p>
        <h4>and add your twist to it!</h4>
        
        <div className="powered-by">
          <p>Powered by <span className="google">Google Gemini 1.5 Pro</span> API</p>
          <p>#BuildwithAI</p>
        </div>

        <img src="/logo.png" alt="logo" />

      </div>
      <div className="buttons-container">
        <button className="open-button" onClick={() => setCurrentView("video")}>
          Get Started
        </button>
        <button className="open-button" onClick={() => setShowProfile(true)}>
          View Gallery
        </button>
      </div>
    </div>
  </>
  );
}

export default App;
