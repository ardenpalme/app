import type { StoreType } from 'polotno/model/store'; 
import {nanoid, z} from 'zod'
import { observer } from "mobx-react-lite";
import { RSSPanelProps } from '@/lib/type';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { rssObj, rssObjRenderList, rssObjRenderSchema, rssObjSchemaList } from '@/schemas/assets';
import { Button } from '../ui/button';
import { CloudIcon, PlusCircleIcon } from 'lucide-react';
import { fileURLToPath } from 'url';
import { render } from '@fullcalendar/core/preact.js';
import { ImagesGrid } from 'polotno/side-panel/images-grid';

// upload also refreshes
export const RSSPanel = observer(({store, rssObjs, uploadRSS} : RSSPanelProps) => {
  const [rssUrl, setRssUrl] = useState<string>("");
  const [images, setImages] = useState<rssObjRenderList>([])

  //const [rawTagsInput, setRawTagsInput] = useState<string>(rssObj.tags?.join(", "));

  const renderImages = async () => {
    const ImageItems = await Promise.all(
      rssObjs.map(async (item) => {
        const res = await fetch(`/api/rss/${encodeURIComponent(item.url)}`);
        const data = await res.json();
        console.log(data)
        const image = data.items?.[0];
        if (!image) return null;

        return {
          id: nanoid(),
          name: image.name,
          fileUrl: `/api/image-proxy?url=${encodeURIComponent(image.fileUrl)}`,
          width: image.width,
          height: image.height,
          sourceUrl: item.url,
        };
      })
    );

    setImages(ImageItems.filter(Boolean));
  };

  useEffect(() => {
      renderImages();
  }, [rssObjs])

  return (
    <div className='flex flex-col h-full'>
      <Input
        value={rssUrl}
        onChange={(e) => setRssUrl(e.target.value)}
        placeholder='RSS URL'
        />
      <Button
        variant="ghost"
        onClick={() => uploadRSS(rssUrl)}
      >
        <div className='flex flex-col'>
          <p>Upload</p>
          <CloudIcon/>
        </div>
      </Button>
      {images.length > 0 && (
      <ImagesGrid
        images={images}
        getPreview={(img) => `${img?.fileUrl}`}
        onSelect={async (img, pos, element, event) => {
          // image - an item from your array
          // pos - relative mouse position on drop. undefined if user just clicked on image
          // element - model from your store if images was dropped on an element.
          //    Can be useful if you want to change some props on existing element instead of creating a new one
          // event - will have additional data such as
          //      elements - list of all elements under the mouse
          //      page - page where user dropped the image

          const canvasWidth = store.activePage.width;
          const canvasHeight = store.activePage.height;
          if (canvasWidth === "auto" || canvasHeight === "auto") {
            console.log("Canvas dimensions not resolved");
            return;
          }

          const img_margin = 50
          const img_width =  (img.width >= canvasWidth) ? canvasWidth - (img_margin*2): img.width
          const img_height = (img.height >= canvasHeight) ? canvasHeight - (img_margin*2) : img.height

          const img_x_coord = (canvasWidth - img_width) / 2;
          const img_y_coord = (canvasHeight - img_height) / 2;

          const barHeight = 80;
          const bar_y_coord = img_y_coord + img_height - (barHeight/2);

          const img_elem = store.activePage.addElement({
            type: 'image',
            src: img?.fileUrl,
            width: img_width,
            height: img_height,
            x: img_x_coord,
            y: img_y_coord + 40,
            custom: {
              sourceUrl: img?.sourceUrl
            }
          });

          store.activePage.addElement({
            type: 'figure',
            subType: 'rect',
            x: img_x_coord,
            y: bar_y_coord,
            width: img_width,
            height: barHeight,
            fill: 'rgba(177, 177, 177, 0.77)',
            cornerRadius: 0,
            custom: { backgroundFor: img_elem.id }
          });

          store.activePage.addElement({
            type: 'text',
            text: img?.name || "Untitled",
            fontFamily: "Arial",
            fontSize: 30,
            width : img_width,
            x: img_x_coord,
            y: bar_y_coord + (barHeight/4),
            custom: {
              sourceUrl: img?.sourceUrl
            }
          });

        }}
        rowsNumber={2}
        isLoading={!images.length}
        loadMore={false}
      />
      )}

    </div>
  );
});
