import React from 'react'
import Header from './Header'


export const PageLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="page-layout">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        {children}
      </main>
    </div>
  )
}

export default PageLayout
