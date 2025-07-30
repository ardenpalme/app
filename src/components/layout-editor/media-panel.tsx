import { observer } from 'mobx-react-lite';
import { BookText, CirclePlus, CloudyIcon, Trash2 } from 'lucide-react';
import { ImagesGrid, Section, TextSection } from 'polotno/side-panel';
import { SectionTab } from 'polotno/side-panel';
import React, { useRef, useState } from 'react';
import { AssetsPanelProps } from '@/lib/type';
import { CreativeList } from "@/schemas/assets"
import { getImageSize } from 'polotno/utils/image';
import { nanoid } from 'nanoid';
import { Button } from '../ui/button';

export const MediaPanel = observer(({ store, creatives, onRefresh, deleteAsset, uploadAsset } : AssetsPanelProps) => {
  const [assets, setAssets] = useState<CreativeList>(creatives);
  const [isUploading, setUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    await onRefresh();
    setAssets(creatives);
  };

  const handleFileInput = async (e : React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    for (const file of files) {
      await uploadAsset(file);
    }
    await onRefresh();
    setUploading(false);
    e.target.value = '';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".mp4,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 bg-transparent"
          onClick={() => fileInputRef.current?.click()}
        >
          <CirclePlus />
        </Button>
      </div>

      <p>Demo images: </p>
      {/* you can create yur own custom component here */}
      {/* but we will use built-in grid component */}
      <ImagesGrid
        images={assets}
        getPreview={(asset) => {
          if (asset.fileType.startsWith("video")) {
            const url = asset.fileUrl
            const thumbnailUrl = url.replace(/(\.[^/.]+)$/, '_thumbnail.jpg');
            console.log(thumbnailUrl)
          return `/api/r2/${thumbnailUrl}`;
          }
          return `/api/r2/${asset.fileUrl}`;
        }}
        getCredit={(asset) => (
          <div>
            <Button
              onClick={async (e) => {
                e.stopPropagation();
                if (
                  window.confirm('Are you sure you want to delete the image?')
                ) {
                  await deleteAsset(asset);
                  await load();
                }
              }}
            >
              <Trash2 /> 
            </Button>
          </div>
        )}
        onSelect={async (asset, pos, element, event) => {
          // image - an item from your array
          // pos - relative mouse position on drop. undefined if user just clicked on image
          // element - model from your store if images was dropped on an element.
          //    Can be useful if you want to change some props on existing element instead of creating a new one
          // event - will have additional data such as
          //      elements - list of all elements under the mouse
          //      page - page where user dropped the image
          const { width, height } = asset

          if(asset.fileType.startsWith("image")) {
            store.activePage.addElement({
              id: nanoid(),
              type: 'image',
              src: `/api/r2/${asset.fileUrl}`,
              width,
              height,
              x: pos?.x || 0,
              y: pos?.y || 0,
            });

          } else if(asset.fileType.startsWith("video")) {
            store.activePage.addElement({
              id: nanoid(),
              type: 'video',
              src: `/api/r2/${asset.fileUrl}`,
              startTime: 0,
              endTime: 1,
              width,
              height,
              x: pos?.x || 0,
              y: pos?.y || 0,
            });
          }

        }}
        rowsNumber={2}
        isLoading={!assets.length}
        loadMore={false}
      />
    </div>
  );
});

