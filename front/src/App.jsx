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
        <h2 className="intro-text">AN ALTERNATE PERSPECTIVE</h2>
        {/* <h3>Look no further than...</h3> */}
        <div className="alt-sim-container">
          <h1>
            <span className="alt-sim">AltSim</span>
          </h1>
        </div>
        <p>A place where you could transform your everyday experiences to comical adventures! <b>Add your twist to it!</b></p>
        
        <div className="powered-by">
          <p>Powered by <span className="google">Google Gemini 1.5 Pro</span> API</p>
        </div>

        <div className="buttons-container">
        <button className="cta-button scale-in delay-300" onClick={() => setCurrentView("video")}>
          Get Started
        </button>
        <button className="cta-button scale-in delay-300" onClick={() => setShowProfile(true)}>
          View Gallery
        </button>
      </div>

        <img src="/logo.png" alt="logo" />

      </div>
    </div>
  </>
  );
}

export default App;
