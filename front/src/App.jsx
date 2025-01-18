import { useState } from 'react'
import VideoWindow from './VideoWindow'
import VideoTextEditWindow from './VideoTextEditWindow'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState('upload') // 'upload' or 'edit'

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className="button-container">

        <button className="open-button" onClick={() => setIsOpen(true)}>
          Upload Video
        </button>
        {isOpen && (
          <VideoWindow onClose={handleClose} />
        )}
      </div>
    </>
  )
}

export default App
