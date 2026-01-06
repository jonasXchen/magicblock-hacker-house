import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  
  let pubkey = '';
  if (state) {
    try {
      pubkey = Buffer.from(state, 'base64').toString('utf-8');
    } catch (e) {
      console.error('Failed to decode state:', e);
    }
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 }
    );
  }

  const clientId = process.env.GITHUB_ID;
  const clientSecret = process.env.GITHUB_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'GitHub credentials not configured' },
      { status: 500 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || 'Failed to get access token' },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    if (!userData.login) {
      return NextResponse.json(
        { error: 'Failed to get GitHub user info' },
        { status: 400 }
      );
    }

    // Return to join form with GitHub handle
    return NextResponse.redirect(
      new URL(`/join?pubkey=${pubkey}&github=${userData.login}`, request.nextUrl.origin)
    );
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with GitHub' },
      { status: 500 }
    );
  }
}
