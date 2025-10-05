import React from "react";
import { useUser } from '@/features/auth/hooks/useUser';
import { useUserPosts } from '@/features/marketplace/application/useUserPosts';
import { RatingStars } from '@/features/marketplace/ui/components/RatingStars';

const PerfilPage = () => {
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser, error: errorUser } = useUser();
  const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts, error: errorPosts } = useUserPosts(user?.id);

  if (isLoadingUser || isLoadingPosts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600" />
      </div>
    );
  }

  if (isErrorUser || isErrorPosts) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h4 className="font-medium text-lg">Error al cargar el perfil</h4>
        <p className="text-sm mt-1">
          {errorUser?.message || errorPosts?.message || 'Ha ocurrido un error inesperado.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mr-6" />
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">Campus: {user.campus}</p>
              <div className="flex items-center mt-2">
                <RatingStars rating={user.rating} />
                <span className="ml-2 text-gray-700 font-semibold">{user.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Mis Publicaciones ({posts?.length ?? 0})</h2>
        {/* Aquí se podría listar las publicaciones si fuera necesario */}
        {posts && posts.length > 0 ? (
          <ul>
            {posts.map(post => (
              <li key={post.id} className="border-b py-2">
                {post.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes publicaciones activas.</p>
        )}
      </div>
    </div>
  );
};

export default PerfilPage;
