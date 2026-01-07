import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pubkey = request.cookies.get('auth_session')?.value;
    
    console.log('Verify session called');
    console.log('Auth session pubkey:', pubkey);

    if (!pubkey) {
      console.log('No auth_session cookie found');
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    console.log('Session valid, pubkey:', pubkey);
    return NextResponse.json(
      { authenticated: true, pubkey },
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
