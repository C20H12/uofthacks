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
    <>
      <div className="landing-page">
        <nav className="navbar">
          <div className="logo"></div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#profile">Profile</a>
            <a href="#login">Login</a>
          </div>
        </nav>

        <div className="content">
          <h2>Want to see your everyday experience through an alternative Perspective?</h2>
          <h3>Look no further than...</h3>
          <h1>AltSim - An AI Powered Story Maker!</h1>
          <p>A webpage where you could transform your everyday experiences to comical adventures!</p>
          <h4>and add your twist to it!</h4>
          
          <div className="powered-by">
            <p>Powered by <span className="google">Google Gemini 1.5 Pro</span> API</p>
            <p>#BuildwithAI</p>
          </div>

          <div className="get-started-box">
            <p>To get started</p>
            <button className="open-button" onClick={() => setIsOpen(true)}>
              Upload Video
            </button>
            {isOpen && (
              <VideoWindow onClose={handleClose} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
