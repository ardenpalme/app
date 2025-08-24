// app/api/rss/[...url]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import probe from 'probe-image-size';

type MediaContent = { $?: { url?: string; type?: string; medium?: string } };
type CustomItem = {
  title?: string;
  link?: string;
  guid?: string;
  enclosure?: { url?: string; type?: string };
  content?: string;
  contentSnippet?: string;
  description?: string;
  ['media:content']?: MediaContent[] | MediaContent;
  ['media:thumbnail']?: any;
  ['media:group']?: any;
};

const parser: Parser<{}, CustomItem> = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail'],
      ['media:group', 'media:group'],
    ],
  },
});

// --- tiny helpers -------------------------------------------------
const IMAGE_EXT = /\.(avif|bmp|gif|jpe?g|png|webp|svg|tiff?)$/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|m4v|mov|mkv)$/i;

const isImageMime = (m?: string) => !!m && /^image\//i.test(m);
const isVideoMime = (m?: string) => !!m && /^video\//i.test(m);
const isImageUrl = (u?: string) => !!u && IMAGE_EXT.test(u.split('?')[0]);
const isVideoUrl = (u?: string) => !!u && VIDEO_EXT.test(u.split('?')[0]);

async function headMime(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    return res.headers.get('content-type') || undefined;
  } catch {
    return undefined;
  }
}

function extractFromHTML(html?: string): { kind: 'image' | 'video'; url: string }[] {
  if (!html) return [];
  const $ = cheerio.load(html);
  const out: { kind: 'image' | 'video'; url: string }[] = [];

  $('img[src]').each((_, el) => {
    const u = $(el).attr('src')?.trim();
    if (u && (isImageUrl(u))) out.push({ kind: 'image', url: u });
  });
  $('video[src]').each((_, el) => {
    const u = $(el).attr('src')?.trim();
    if (u && (isVideoUrl(u))) out.push({ kind: 'video', url: u });
  });
  $('video source[src]').each((_, el) => {
    const u = $(el).attr('src')?.trim();
    if (u && (isVideoUrl(u))) out.push({ kind: 'video', url: u });
  });
  // common embeds
  $('iframe[src]').each((_, el) => {
    const u = $(el).attr('src')?.trim();
    if (u && /youtube\.com|youtu\.be|player\.vimeo\.com/i.test(u)) {
      out.push({ kind: 'video', url: u });
    }
  });

  // dedupe
  const seen = new Set<string>();
  return out.filter(x => (seen.has(x.url) ? false : (seen.add(x.url), true)));
}

function extractFromItem(item: CustomItem) {
  const out: { kind: 'image' | 'video'; url: string; mime?: string }[] = [];

  // enclosure
  const eUrl = item.enclosure?.url?.trim();
  const eType = item.enclosure?.type?.trim();
  if (eUrl) {
    if (isImageMime(eType) || isImageUrl(eUrl)) out.push({ kind: 'image', url: eUrl, mime: eType });
    else if (isVideoMime(eType) || isVideoUrl(eUrl)) out.push({ kind: 'video', url: eUrl, mime: eType });
  }

  // media:content[]
  const medias = Array.isArray(item['media:content']) ? item['media:content'] : (item['media:content'] ? [item['media:content']] : []);
  for (const m of medias) {
    const url = m?.$?.url?.trim();
    const type = m?.$?.type?.trim();
    const medium = m?.$?.medium?.trim();
    if (!url) continue;

    if (isImageMime(type) || medium === 'image' || isImageUrl(url)) out.push({ kind: 'image', url, mime: type });
    else if (isVideoMime(type) || medium === 'video' || isVideoUrl(url)) out.push({ kind: 'video', url, mime: type });
  }

  // HTML fallbacks
  const html = item.content || item.contentSnippet || item.description;
  out.push(...extractFromHTML(html));

  // dedupe
  const seen = new Set<string>();
  return out.filter(x => (seen.has(x.url) ? false : (seen.add(x.url), true)));
}

// --- route -------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    // URL is encoded after /api/rss/
    const { pathname } = new URL(req.url);
    const encodedUrl = pathname.replace(/^\/api\/rss\//, '');
    const rssUrl = decodeURIComponent(encodedUrl);

    if (!rssUrl) {
      return NextResponse.json({ error: 'Missing RSS feed URL' }, { status: 400 });
    }

    const feed = await parser.parseURL(rssUrl);

    const items = (
      await Promise.all(
        (feed.items || []).map(async (item: CustomItem) => {
          const media = extractFromItem(item);
          if (media.length === 0) return [];

          const mapped = await Promise.all(
            media.map(async m => {
              const base = {
                id: item.guid || item.link || item.title || m.url,
                name: item.title || '',
                fileUrl: m.url,
                kind: m.kind as 'image' | 'video',
                mime: m.mime as string | undefined,
              };

              if (m.kind === 'image') {
                try {
                  const { width, height, type } = await probe(m.url);
                  if (!width || !height || width <= 1 || height <= 1) return null;
                  return { ...base, width, height, mime: base.mime || (type ? `image/${type}` : undefined) };
                } catch {
                  // probe failed — still return the link without dimensions
                  return base;
                }
              } else {
                // Try to confirm videos by HEAD when mime missing and extension uncertain
                if (!m.mime && !isVideoUrl(m.url)) {
                  const ct = await headMime(m.url);
                  if (ct && !/^video\//i.test(ct)) return null;
                  return { ...base, mime: ct || undefined };
                }
                return base;
              }
            })
          );

          return mapped.filter(Boolean) as any[];
        })
      )
    ).flat();

    // final dedupe by URL
    const seen = new Set<string>();
    const unique = items.filter(it => (seen.has(it.fileUrl) ? false : (seen.add(it.fileUrl), true)));

    return NextResponse.json({ message: 'Success', items: unique });
  } catch (error) {
    console.error('RSS error:', error);
    return NextResponse.json({ error: 'Failed to parse RSS feed' }, { status: 500 });
  }
}

