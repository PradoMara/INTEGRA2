import React from 'react'
import { usePostsWithFilters } from '../../Marketplace.Hooks/usePostsWithFilters'
import ItemCard from './ItemCard'
// 🛑 SOLUCIÓN: Importar el tipo Post para ItemList
import type { Post } from '../../Marketplace.Types/ProductInterfaces' 

export default function ItemList() {
  const { 
    posts, 
    isLoading, 
    isError 
  } = usePostsWithFilters({
    searchTerm: '', 
    categoryId: ''  
  }) 

  if (isLoading) return <p>Cargando publicaciones...</p>
  if (isError) return <p>Error al cargar publicaciones.</p>

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* 🛑 Se pasa el objeto 'post' completo a la prop 'post' */}
      {posts?.map((post: Post) => ( 
        <ItemCard key={post.id} post={post} /> 
      ))}
    </div>
  )
} 