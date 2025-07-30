import { NextRequest, NextResponse } from "next/server"
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { getImageSize } from 'polotno/utils/image';
import probe from 'probe-image-size';
import Error from "next/error";

const parser = new Parser();

function extractImageFromHTML(html?: string): string | null {
  if (!html) return null;
  const $ = cheerio.load(html);
  return $('img').first().attr('src') || null;
}

export async function GET(req: NextRequest, res: NextResponse) {
  const { pathname } = new URL(req.url); 

  // Remove "/api/rss/" prefix and decode
  const encodedUrl = pathname.replace(/^\/api\/rss\//, '');
  const rssUrl = decodeURIComponent(encodedUrl);

  if (!rssUrl) {
    return NextResponse.json({ error: 'Missing RSS feed URL' }, { status: 400 })
  }

  try {
    const feed = await parser.parseURL(rssUrl);

    const itemPromises = feed.items
      .map(async (item) => {  // map(async) returns a list of promises!
        const imgUrl =
          item.enclosure?.url || extractImageFromHTML(item.content || item.contentSnippet || item.description);

        if (!imgUrl) return null;

        try {
          const {width, height} = await probe(imgUrl)
          
          if (!width || !height || width <= 1 || height <= 1) {
            console.warn(`Invalid image size for ${imgUrl}: ${width}x${height}`);
            return null;
          }

          console.log(imgUrl)
          return {
            id: item.guid || item.link || item.title,
            name: item.title || '',
            fileUrl: imgUrl,
            width,
            height,
          };
        }catch(err){
          console.warn(`probe failed for ${imgUrl}:`);
          return null;
        }
      });

    const items = (await Promise.all(itemPromises)).filter(Boolean);
    return NextResponse.json({ message: 'Success', items });

  } catch (error) {
    console.error('RSS error:', error);
    return NextResponse.json({ error: 'Failed to parse RSS feed' }, { status: 500 })
  }
}

