import usePosts from '@/features/marketplace/Marketplace.Hooks/usePost'
import ItemCard from './ItemCard'

export default function ItemList() {
  const { data: posts, isLoading, isError } = usePosts()

  if (isLoading) return <p>Cargando publicaciones...</p>
  if (isError) return <p>Error al cargar publicaciones.</p>

  const list = (posts as any[]) ?? []
  return (
    <div className="grid grid-cols-3 gap-6">
      {list.map((post: any) => (
        <ItemCard key={post.id} {...post} />
      ))}
    </div>
  )
}
