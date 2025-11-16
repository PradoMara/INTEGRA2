import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Componente Skeleton base para efectos de carga
 */
export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}: SkeletonProps) {
  const baseClasses = 'bg-gray-300';
  const animationClasses = animation === 'pulse' ? 'animate-pulse' : animation === 'wave' ? 'animate-shimmer' : '';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
      role="status"
      aria-label="Cargando contenido"
    />
  );
}

/**
 * Skeleton para tarjetas de publicaciones/productos
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Imagen */}
      <div className="relative aspect-video w-full bg-gray-300" />
      
      <div className="p-4 md:p-5">
        {/* Usuario */}
        <div className="flex items-center mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 mr-3" />
          <div className="flex-1">
            <div className="h-3 md:h-4 bg-gray-300 rounded w-24 mb-1" />
            <div className="h-2 md:h-3 bg-gray-300 rounded w-16" />
          </div>
        </div>
        
        {/* Título y descripción */}
        <div className="h-4 md:h-5 bg-gray-300 rounded w-full mb-2" />
        <div className="h-4 md:h-5 bg-gray-300 rounded w-3/4 mb-3" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-full mb-2" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-5/6 mb-2" />
        <div className="h-3 md:h-4 bg-gray-300 rounded w-2/3 mb-4" />
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
          <div className="h-3 md:h-4 bg-gray-300 rounded w-24" />
          <div className="h-3 md:h-4 bg-gray-300 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton para listas (feed inicial)
 */
export function FeedLoadingSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}

/**
 * Skeleton para perfil de usuario
 */
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="flex-1">
          <Skeleton variant="text" height={24} width="60%" className="mb-2" />
          <Skeleton variant="text" height={16} width="40%" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton variant="text" height={20} width="100%" />
        <Skeleton variant="text" height={20} width="90%" />
        <Skeleton variant="text" height={20} width="80%" />
      </div>
    </div>
  );
}

/**
 * Skeleton para mensajes de chat
 */
export function ChatMessageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'} max-w-md`}>
            <Skeleton variant="circular" width={32} height={32} />
            <div className="flex flex-col gap-2">
              <Skeleton variant="rectangular" width={200} height={60} />
              <Skeleton variant="text" width={80} height={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton para detalle de publicación
 */
export function PublicationDetailSkeleton() {
  return (
    <div className="grid gap-5 animate-pulse">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Skeleton variant="rectangular" height={400} className="mb-4" />
        <Skeleton variant="text" height={32} width="70%" className="mb-2" />
        <Skeleton variant="text" height={20} width="90%" className="mb-4" />
        <div className="flex gap-4">
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={80} height={24} />
        </div>
      </div>
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton variant="text" height={24} width="40%" className="mb-4" />
        <Skeleton variant="text" height={16} width="100%" className="mb-2" />
        <Skeleton variant="text" height={16} width="95%" className="mb-2" />
        <Skeleton variant="text" height={16} width="85%" />
      </div>
    </div>
  );
}

/**
 * Skeleton para tabla de admin
 */
export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            {Array.from({ length: cols }, (_, i) => (
              <th key={i} className="p-3">
                <Skeleton variant="text" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i} className="border-b">
              {Array.from({ length: cols }, (_, j) => (
                <td key={j} className="p-3">
                  <Skeleton variant="text" height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
