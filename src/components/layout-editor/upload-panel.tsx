import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@blueprintjs/core';
import { ImagesGrid } from 'polotno/side-panel';
import { getImageSize } from 'polotno/utils/image';
import { CreativeList, CreativeObj, CampaignList } from "@/schemas/assets"

import { UploadPanelProps } from '@/lib/type';

export const UploadPanel = observer(({ store, creatives, onRefresh, uploadAsset, deleteAsset }: UploadPanelProps) => {
  const [assets, setAssets] = React.useState<CreativeList>([])
  const [isUploading, setUploading] = React.useState(false);

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

  React.useEffect(() => {
    onRefresh();
    load();
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="input-file">
          <Button
            icon="upload"
            style={{ width: '100%' }}
            onClick={() => {
              document.querySelector('#input-file')?.click();
            }}
            loading={isUploading}
          >
            Upload Image (use small image for demo)
          </Button>
          <input
            type="file"
            id="input-file"
            style={{ display: 'none' }}
            onChange={handleFileInput}
            multiple
          />
        </label>
      </div>
      <ImagesGrid
        images={assets}
        getPreview={(asset) => `/api/r2/${asset.fileUrl}`}
        crossOrigin="anonymous"
        getCredit={(asset) => (
          <div>
            <Button
              icon="trash"
              onClick={async (e) => {
                e.stopPropagation();
                if (
                  window.confirm('Are you sure you want to delete the image?')
                ) {
                  await deleteAsset(asset.id);
                  await load();
                }
              }}
            ></Button>
          </div>
        )}
        onSelect={async (asset, pos, element) => {
          const { fileUrl } = asset;
          let { width, height } = await getImageSize(fileUrl);
          const isSVG = fileUrl.indexOf('svg+xml') >= 0 || fileUrl.indexOf('.svg') >= 0;

          const type = isSVG ? 'svg' : 'image';

          if (
            element &&
            element.type === 'svg' &&
            !element.locked &&
            type === 'image'
          ) {
            element.set({ maskSrc: fileUrl });
            return;
          }

          if (
            element &&
            element.type === 'image' &&
            !element.locked &&
            type === 'image'
          ) {
            element.set({ src: fileUrl });
            return;
          }

          const scale = Math.min(store.width / width, store.height / height, 1);
          width = width * scale;
          height = height * scale;

          const x = (pos?.x || store.width / 2) - width / 2;
          const y = (pos?.y || store.height / 2) - height / 2;

          store.activePage?.addElement({
            type,
            src: fileUrl,
            x,
            y,
            width,
            height,
          });
        }}
      />
    </div>
  );
});

