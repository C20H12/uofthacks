import { useState } from 'react'
import VideoWindow from './VideoWindow'
import './App.css'

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    <div className="button-container">

      <button className="open-button" onClick={() => setIsOpen(true)}>
        Upload Video
      </button>
      {isOpen && <VideoWindow onClose={() => setIsOpen(false)} />}
    </div>
    </>
  )
}

export default App
