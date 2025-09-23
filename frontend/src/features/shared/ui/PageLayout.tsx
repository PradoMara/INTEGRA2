import React from 'react'
import Header from './Header.tsx'
import { Outlet } from 'react-router-dom'

export const PageLayout: React.FC = () => {
  return (
    <div className="page-layout">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default PageLayout
