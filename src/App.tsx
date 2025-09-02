import { useState, useEffect, useCallback, useRef } from 'react'
import VirtualizedFeed from './components/InfiniteFeed'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace UCT</h1>
          <p className="text-gray-600">Feed optimizado con virtualización</p>
        </div>
      </header>
      
      <main>
        <VirtualizedFeed />
      </main>
    </div>
  )
}

export default App