import { NextRequest, NextResponse } from 'next/server';
import { get } from 'https';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  return new Promise((resolve) => {
    get(url, (res) => {
      const headers = new Headers({
        'Content-Type': res.headers['content-type'] || 'image/png',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      });

      resolve(
        new NextResponse(res, {
          status: res.statusCode || 200,
          headers,
        })
      );
    }).on('error', () => {
      resolve(new NextResponse('Image fetch error', { status: 500 }));
    });
  });
}

