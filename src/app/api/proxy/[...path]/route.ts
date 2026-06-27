import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async (req: NextRequest, { params }: any) => {
  try {
    const { accessToken } = await getAccessToken();
    const pathParams = await params;
    
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
});
