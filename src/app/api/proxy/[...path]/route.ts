import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res);
    
    if (!accessToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    
    const pathParams = await context.params;
    
    // Safety check - handle missing path
    const targetPath = Array.isArray(pathParams?.path) ? pathParams.path.join('/') : 'v1/whoami';
    
    const apiUrl = process.env.IRONCLAD_API_URL || process.env.NEXT_PUBLIC_IRONCLAD_API_URL || 'http://localhost:3000';
    
    // Ponytail ultra: just fetch what we need and return it. No extra boilerplate.
    const response = await fetch(`${apiUrl}/${targetPath}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error: any) {
    // Ponytail comment: minimal error bubbling
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
