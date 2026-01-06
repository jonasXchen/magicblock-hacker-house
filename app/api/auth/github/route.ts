import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_ID;
  const pubkey = request.nextUrl.searchParams.get('pubkey');
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub ID not configured' },
      { status: 500 }
    );
  }

  const redirectUri = new URL('/api/auth/github/callback', request.nextUrl.origin);
  const scopes = 'user:email';
  const state = pubkey ? Buffer.from(pubkey).toString('base64') : '';
  
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.append('client_id', clientId);
  githubAuthUrl.searchParams.append('redirect_uri', redirectUri.toString());
  githubAuthUrl.searchParams.append('scope', scopes);
  githubAuthUrl.searchParams.append('login', '');
  if (state) {
    githubAuthUrl.searchParams.append('state', state);
  }

  return NextResponse.redirect(githubAuthUrl.toString());
}
