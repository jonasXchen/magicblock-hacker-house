import { Client } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

const getNotionClient = () => {
  if (!process.env.NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY is not set');
  }
  return new Client({
    auth: process.env.NOTION_API_KEY,
  });
};

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

export async function GET(request: NextRequest) {
  try {
    const publicKey = request.nextUrl.searchParams.get('pubkey');

    if (!publicKey) {
      return NextResponse.json(
        { error: 'Missing publicKey' },
        { status: 400 }
      );
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiKey = process.env.NOTION_API_KEY;
    console.log('Searching for publicKey:', publicKey, 'in database:', DATABASE_ID);

    // Use raw Notion API to query the database
    let userPage: any = null;
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'PublicKey',
            rich_text: {
              equals: publicKey,
            },
          },
          sorts: [
            {
              property: 'Joined At',
              direction: 'descending',
            },
          ],
        }),
      });

      const data = await response.json();
      console.log('Query response status:', response.status);
      console.log('Query found:', data.results?.length || 0, 'pages');

      if (data.results && data.results.length > 0) {
        userPage = data.results[0];
        console.log('Found matching user page (latest)!');
      }
    } catch (err) {
      console.error('Error querying database:', err);
    }

    console.log('Found user page:', !!userPage);

    if (!userPage) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const properties = userPage.properties;

    const userData = {
      name: properties.Name?.title?.[0]?.plain_text || '',
      email: properties.Email?.email || '',
      company: properties.Project?.rich_text?.[0]?.plain_text || '',
      x: properties['X Handle']?.rich_text?.[0]?.plain_text || '',
      github: properties.GitHub?.url || '',
      description: properties.Description?.rich_text?.[0]?.plain_text || '',
    };

    return NextResponse.json(
      { user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
