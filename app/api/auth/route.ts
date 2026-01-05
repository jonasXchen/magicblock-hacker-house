import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';

const getNotionClient = () => {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is not set');
  }
  return new Client({
    auth: process.env.NOTION_API_KEY,
  });
};

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

function verifySignature(publicKey: string, signature: string, message: string): boolean {
  try {
    const publicKeyObj = new PublicKey(publicKey);
    const signatureBytes = Buffer.from(signature, 'base64');
    const messageBytes = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyObj.toBuffer()
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { publicKey, signature } = await request.json();

    if (!publicKey || !signature) {
      return NextResponse.json(
        { error: 'Missing publicKey or signature' },
        { status: 400 }
      );
    }

    // Verify the signature
    const message = 'Sign to join MagicBlock Hacker House';
    const isValid = verifySignature(publicKey, signature, message);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check if user exists in Notion database
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      console.error('Missing Notion environment variables');
      // If Notion is not configured, redirect to form
      return NextResponse.json(
        { redirect: '/join' },
        { status: 200 }
      );
    }

    try {
      const notion = getNotionClient();
      
      // Search for existing user with this public key
      const searchResponse = await notion.search({
        query: publicKey,
        filter: {
          value: 'page',
          property: 'object',
        },
      });

      // Filter results to find pages in our database with matching PublicKey
      let userPage: any = null;
      for (const result of searchResponse.results) {
        if (result.object === 'page' && result.parent.type === 'database_id' && result.parent.database_id === DATABASE_ID) {
          userPage = result;
          break;
        }
      }

      if (!userPage) {
        // User doesn't exist, send to form
        return NextResponse.json(
          { redirect: '/join' },
          { status: 200 }
        );
      }

      // Get full page details to check all properties
      const fullPage = await notion.pages.retrieve({ page_id: userPage.id });
      const properties = (fullPage as any).properties;

      const hasAllFields =
        properties.Name?.title?.[0]?.plain_text &&
        properties.Email?.email &&
        properties.Project?.rich_text?.[0]?.plain_text &&
        properties['X Handle']?.rich_text?.[0]?.plain_text &&
        properties.Description?.rich_text?.[0]?.plain_text;

      if (hasAllFields) {
        // All fields filled, go to office
        return NextResponse.json(
          { redirect: 'office' },
          { status: 200 }
        );
      } else {
        // Incomplete form, send back to form to fill missing fields
        return NextResponse.json(
          { redirect: '/join' },
          { status: 200 }
        );
      }
    } catch (notionError) {
      console.error('Notion query error:', notionError);
      // If Notion query fails, redirect to form
      return NextResponse.json(
        { redirect: '/join' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
