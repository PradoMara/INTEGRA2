import React from 'react';

type Props = {
  price?: number | string;
  stock?: number;
  onBuy?: () => void;
};

export const PriceBuyBox: React.FC<Props> = ({ price, stock, onBuy }) => {
  const disabled = stock === 0;
  return (
    <aside className="mt-6 p-4 border rounded-md bg-white shadow-sm">
      <div className="text-2xl font-semibold text-gray-900">
        {price != null ? `$ ${price}` : 'Consultar precio'}
      </div>
      {typeof stock === 'number' && (
        <div className={`mt-1 text-sm ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock > 0 ? `Stock: ${stock}` : 'Sin stock'}
        </div>
      )}
      <button
        onClick={onBuy}
        disabled={disabled}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
        aria-disabled={disabled}
      >
        Comprar
      </button>
    </aside>
  );
};