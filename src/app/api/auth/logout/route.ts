import { NextResponse } from 'next/server';
import { TOKEN_NAME } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(TOKEN_NAME, '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
  });
  return response;
}
