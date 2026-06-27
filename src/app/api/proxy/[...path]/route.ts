import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

async function handleRequest(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);
    
    if (!accessToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    
    const pathParams = await context.params;
    const targetPath = Array.isArray(pathParams?.path) ? pathParams.path.join('/') : 'v1/whoami';
    const apiUrl = process.env.IRONCLAD_API_URL || process.env.NEXT_PUBLIC_IRONCLAD_API_URL || 'http://localhost:3000';
    
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: { 
        Authorization: `Bearer ${accessToken}`,
      },
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = await req.text();
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': req.headers.get('content-type') || 'application/json'
      };
    }

    const response = await fetch(`${apiUrl}/${targetPath}`, fetchOptions);
    const data = await response.text();
    let jsonData = data;
    try { jsonData = JSON.parse(data); } catch { /* ignore */ }

    return NextResponse.json(jsonData, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
