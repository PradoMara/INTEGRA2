import { useState, useEffect, useCallback, useRef } from 'react'
import InfiniteFeed from './components/InfiniteFeed'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace UCT</h1>
          <p className="text-gray-600">Feed de publicaciones</p>
        </div>
      </header>
      
      <main>
        <InfiniteFeed />
      </main>
    </div>
  )
}

export default App