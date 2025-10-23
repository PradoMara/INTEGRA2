import React from 'react';

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export const DetailImage: React.FC<Props> = ({ src, alt = 'Imagen del producto', className }) => {
  return (
    <div className={`w-full max-w-xl mx-auto ${className ?? ''}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover rounded-md shadow-sm"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          Sin imagen
        </div>
      )}
    </div>
  );
};