import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ajusta las rutas si no usas alias "@"
import { Sidebar } from './components/Sidebar'
import { useUser } from '@/features/auth/hooks/useUser';
import { useUserPosts } from '@/hooks/useUserPosts';
import { Post } from '@/features/auth/entities/Post';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';

// Simulación de una función de actualización de API
const updatePost = async (updatedPost: Partial<Post> & { id: number }): Promise<Post> => {
  const response = await fetch(`/api/posts/${updatedPost.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar la publicación');
  }
  return response.json();
};

export default function MisPublicacionesPage() {
  const { data: user } = useUser();
  const { data: posts, isLoading, isError, error } = useUserPosts(user?.id);
  const queryClient = useQueryClient();

  // Estado para el modal de edición
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const mutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost: Partial<Post> & { id: number }) => {
      // Cancelar cualquier refetch pendiente para que no sobreescriba la actualización optimista
      await queryClient.cancelQueries({ queryKey: ['posts', { authorId: user?.id }] });

      // Guardar el estado anterior
      const previousPosts = queryClient.getQueryData(['posts', { authorId: user?.id }]);

      // Actualizar el cache de forma optimista
      queryClient.setQueryData(['posts', { authorId: user?.id }], (old: any) => {
        if (!old) return old;
        return {
            ...old,
            posts: old.posts.map((post: Post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
          ),
        }
      });

      // Devolver el estado anterior para hacer rollback en caso de error
      return { previousPosts };
    },
    onError: (err, updatedPost, context) => {
      // Revertir al estado anterior si la mutación falla
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', { authorId: user?.id }], context.previousPosts);
      }
    },
    onSettled: () => {
      // Invalidar y refetchear la query para asegurar que los datos son consistentes
      queryClient.invalidateQueries({ queryKey: ['posts', { authorId: user?.id }] });
    },
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editingPost && (editTitle !== editingPost.title || editDescription !== editingPost.description)) {
      mutation.mutate({ id: editingPost.id, title: editTitle, description: editDescription });
    }
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <Sidebar active="mis-publicaciones" />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Mis publicaciones</h1>
              <p className="text-sm text-gray-600">
                {posts?.posts?.length ?? 0} resultado{posts?.posts?.length === 1 ? '' : 's'}
              </p>
            </div>
            <Link
              to="/crear"
              className="inline-flex items-center rounded-xl border bg-white hover:bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900"
            >
              Crear publicación
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isLoading && <div>Cargando...</div>}
          {isError && <div>Error: {error.message}</div>}
          {posts && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {posts?.posts?.map((post: Post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.description}</p>
                    <button
                      onClick={() => handleEdit(post)}
                      className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Modal de edición */}
        <Modal open={isEditing} onClose={handleCancelEdit}>
          <h2 className="text-lg font-semibold mb-4">Editar publicación</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
