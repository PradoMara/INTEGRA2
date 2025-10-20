// src/features/marketplace/ui/CrearPublicacionPage.tsx
import React from "react";
import { useMemo } from 'react'
import { Sidebar } from './components/Sidebar'
import { CreatePostForm } from './components/create-post/CreatePostForm'

export default function CrearPublicacionPage() {
  const title = useMemo(() => 'Crear publicación', [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-gray-300 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-r">
        <Sidebar active="crear" />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 backdrop-blur border-b">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">Completa los campos y publica tu producto</p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-0">
          <CreatePostForm />
        </main>
      </div>
    </div>
  )
}
