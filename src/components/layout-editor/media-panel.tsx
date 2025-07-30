import { observer } from 'mobx-react-lite';
import { BookText } from 'lucide-react';
import { ImagesGrid, Section, TextSection } from 'polotno/side-panel';
import { SectionTab } from 'polotno/side-panel';
import React from 'react';
import { AssetsPanelProps } from '@/lib/type';
import { CreativeList } from "@/schemas/assets"
import { getImageSize } from 'polotno/utils/image';
import { nanoid } from 'nanoid';

export const MediaPanel = observer(({ store, creatives, onRefresh, deleteAsset, uploadAsset } : AssetsPanelProps) => {
  const [assets, setAssets] = React.useState<CreativeList>(creatives);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p>Demo images: </p>
      {/* you can create yur own custom component here */}
      {/* but we will use built-in grid component */}
      <ImagesGrid
        images={assets}
        getPreview={(asset) => `/api/r2/${asset.fileUrl}`}
        onSelect={async (asset, pos, element, event) => {
          // image - an item from your array
          // pos - relative mouse position on drop. undefined if user just clicked on image
          // element - model from your store if images was dropped on an element.
          //    Can be useful if you want to change some props on existing element instead of creating a new one
          // event - will have additional data such as
          //      elements - list of all elements under the mouse
          //      page - page where user dropped the image
          const { width, height } = asset
          store.activePage.addElement({
            id: nanoid(),
            type: 'image',
            src: `/api/r2/${asset.fileUrl}`,
            width,
            height,
            x: pos?.x || 0,
            y: pos?.y || 0,
          });
        }}
        rowsNumber={2}
        isLoading={!assets.length}
        loadMore={false}
      />
    </div>
  );
});

