import type { StoreType } from 'polotno/model/store'; 
import {nanoid, z} from 'zod'
import { observer } from "mobx-react-lite";
import { RSSImgObject, RSSPanelProps, RSSTickerObject } from '@/lib/type';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { rssObj, rssObjRenderList, rssObjRenderSchema, rssObjSchemaList } from '@/schemas/assets';
import { Button } from '../ui/button';
import { CloudIcon, PlusCircleIcon } from 'lucide-react';
import { fileURLToPath } from 'url';
import { render } from '@fullcalendar/core/preact.js';
import { ImagesGrid } from 'polotno/side-panel/images-grid';
import { headers } from 'next/headers';

// upload also refreshes
export const RSSPanel = observer(({store, rssObjs, uploadRSS} : RSSPanelProps) => {
  const [rssUrl, setRssUrl] = useState<string>("");
  const [rssItems, setRSSItems] = useState<rssObjRenderList>([])

  //const [rawTagsInput, setRawTagsInput] = useState<string>(rssObj.tags?.join(", "));

  const renderRSS = async () => {
    const RSSItems = await Promise.all(
      rssObjs.map(async (item) => {
        const resp1 = await fetch(`/api/rss/image?url=${encodeURIComponent(item.url)}`);
        const resp2 = await fetch(`/api/rss/headlines?url=${encodeURIComponent(item.url)}`);

        // assume top_item has an image
        const {data : top_item} : {data : RSSImgObject} = await resp1.json(); 
        const {data : headlines_data} : {data : RSSTickerObject} = await resp2.json(); 

        console.log("RSS headlines", headlines_data)
        console.log("latest RSS item", top_item)

        const headlines = headlines_data.items.map((it) => (it.title))

        return {
          id: nanoid(),
          name: top_item.rss_item.title,
          fileUrl: `/api/image-proxy?url=${encodeURIComponent(top_item.rss_item.image?.url ?? "")}`,
          width: top_item.content_width,
          height: top_item.content_height,
          sourceUrl: top_item.rss_item.url,
          headlines
        };
      })
    );

    setRSSItems(RSSItems);
  }

  useEffect(() => {
      renderRSS();
  }, [rssObjs])

  return (
    <div className='flex flex-col h-full'>
      <div className='flex flex-row gap-2'>
        <Input
          value={rssUrl}
          onChange={(e) => setRssUrl(e.target.value)}
          placeholder='RSS URL'
          />
        <Button
          variant="default"
          onClick={() => uploadRSS(rssUrl)}
        >
          Save
        </Button>
      </div>
      {rssItems.length > 0 && (
      <ImagesGrid
        images={rssItems}
        getPreview={(item) => `${item?.fileUrl}`}
        onSelect={async (item, pos, element, event) => {
          // image - an item from your array
          // pos - relative mouse position on drop. undefined if user just clicked on image
          // element - model from your store if images was dropped on an element.
          //    Can be useful if you want to change some props on existing element instead of creating a new one
          // event - will have additional data such as
          //      elements - list of all elements under the mouse
          //      page - page where user dropped the image
          const canvasWidth = store.activePage.width as number;
          const canvasHeight = store.activePage.height as number;

          const rawW = item.width as number;   
          const rawH = item.height as number;

          if (!rawW || !rawH) {
            console.warn('Missing image dimensions on item:', item);
            return;
          }

          const imgMargin = 50;
          const imgWidth  = Math.min(rawW,  canvasWidth  - imgMargin * 2);
          const imgHeight = Math.min(rawH,   canvasHeight - imgMargin * 2);

          const img_x_coord = (canvasWidth - imgWidth) / 2;
          const img_y_coord = (canvasHeight - imgHeight) / 2;

          const barHeight = 80;
          const bar_y_coord = img_y_coord + imgHeight - (barHeight/2);

          const img_elem = store.activePage.addElement({
            type: 'image',
            src: item?.fileUrl ?? "",
            width: imgWidth,
            height: imgHeight,
            x: img_x_coord,
            y: img_y_coord + 40,
            custom: {
              sourceUrl: item?.sourceUrl
            }
          });

          store.activePage.addElement({
            type: 'figure',
            subType: 'rect',
            x: img_x_coord,
            y: bar_y_coord,
            width: imgWidth,
            height: barHeight,
            fill: 'rgba(177, 177, 177, 0.77)',
            cornerRadius: 0,
            custom: { backgroundFor: img_elem.id }
          });

          store.activePage.addElement({
            type: 'text',
            text: item?.name || "Untitled",
            fontFamily: "Arial",
            fontSize: 30,
            width : imgWidth,
            x: img_x_coord,
            y: bar_y_coord + (barHeight/4),
            custom: {
              sourceUrl: item?.sourceUrl
            }
          });

        }}
        rowsNumber={2}
        isLoading={!rssItems.length} // TODO dynamic skeleton loading
        loadMore={false}
      />
      )}

    </div>
  );
});
