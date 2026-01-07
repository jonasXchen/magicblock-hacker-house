import { NextRequest, NextResponse } from 'next/server';
import { sessions } from '@/lib/sessions';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('auth_session')?.value;
    
    console.log('Verify session called');
    console.log('Session token:', sessionToken);

    if (!sessionToken) {
      console.log('No auth_session cookie found');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Look up session in memory (in production, use a database)
    const session = sessions.get(sessionToken);
    
    if (!session || session.expiresAt < Date.now()) {
      console.log('Session not found or expired');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    console.log('Session valid, pubkey:', session.pubkey);
    return NextResponse.json(
      { authenticated: true, pubkey: session.pubkey },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
