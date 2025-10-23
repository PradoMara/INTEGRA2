import React from 'react';
import type { Publication } from '../../../types/publication';
import { DetailImage } from './DetailImage';
import { DetailDescription } from './DetailDescription';
import { DetailAttributes } from './DetailAttributes';
import { SellerInfo } from './SellerInfo';
import { PriceBuyBox } from './PriceBuyBox';

type Props = {
  publication: Publication;
  onBuy?: (id: string) => void;
};

export const PublicationDetails: React.FC<Props> = ({ publication, onBuy }) => {
  const mainImage = publication.images?.[0];

  return (
    <article className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <DetailImage src={mainImage} alt={publication.title} />
        <DetailDescription title={publication.title} description={publication.description} />
        <DetailAttributes attributes={publication.attributes} />
      </div>

      <div className="lg:col-span-1">
        <PriceBuyBox
          price={publication.price}
          stock={publication.stock}
          onBuy={() => onBuy?.(publication.id)}
        />
        <SellerInfo
          name={publication.seller?.name}
          avatarUrl={publication.seller?.avatarUrl}
          sellerId={publication.seller?.id}
        />
      </div>
    </article>
  );
};