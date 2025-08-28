import { NextRequest, NextResponse } from 'next/server';
import { parseFeed } from '@rowanmanning/feed-parser';
import probe from 'probe-image-size';

// Gets the latest item from the RSS feed & caption image dims
export async function GET(
  req: NextRequest,
  { params }: { params: { mode: 'headlines' | 'image' } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const rssUrl = searchParams.get("url"); 
    const {mode} = params;

    if (!rssUrl) {
      return NextResponse.json({ error: 'Missing RSS feed URL' }, { status: 400 });
    }

    const response = await fetch(rssUrl);
    const feed = parseFeed(await response.text());
    //console.log(feed);
    if(mode == "headlines") {
      const headlines_limit = 10;
      const items = (feed.items ?? [])
      .slice(0, headlines_limit)
      .map(it => ({ title: it.title ?? 'Untitled', url: it.url ?? '' }));

      return NextResponse.json({ message: 'Success', data: { items } });

    }else if(mode == "image") {
      const rss_item = feed.items[0];

      const {width, height} = await probe(rss_item.image?.url)
      return NextResponse.json({ 
        message: 'Success', 
        data: {
          rss_item,
          content_width: width,
          content_height: height
        }
      });
    }
    return NextResponse.json({ error: 'Unknown mode' }, { status: 400 });

  } catch (error) {
    console.error('RSS error:', error);
    return NextResponse.json({ error: 'Failed to parse RSS feed' }, { status: 500 });
  }
}

