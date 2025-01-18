import { useState } from 'react'
import VideoWindow from './VideoWindow'
import VideoTextEditWindow from './VideoTextEditWindow'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState('upload') // 'upload' or 'edit'

  const handleNext = () => {
    setCurrentView('edit')
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentView('upload')
  }

  return (
    <>
      <div className="button-container">

        <button className="open-button" onClick={() => setIsOpen(true)}>
          Upload Video
        </button>
        {isOpen && currentView === 'upload' && (
          <VideoWindow onClose={handleClose} onNext={handleNext} />
        )}
        {isOpen && currentView === 'edit' && (
          <VideoTextEditWindow onClose={handleClose} />
        )}
      </div>
    </>
  )
}

export default App
