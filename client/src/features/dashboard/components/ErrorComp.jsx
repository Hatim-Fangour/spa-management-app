import React from 'react'

const ErrorComp = () => {
  return (
    <div
        className="w-full h-screen flex items-center justify-center text-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: light background
          zIndex: 9999, // Optional: ensure it's on top
        }}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          Error loading data !
        </div>
      </div>
  )
}

export default ErrorComp