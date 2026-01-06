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

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, x, github, description, publicKey } = await request.json();

    // Validate required fields
    if (!name || !email || !company || !x || !github || !description || !publicKey) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      console.error('Missing Notion environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // First check if user with this pubkey already exists
    const notion = getNotionClient();
    
    // Search for existing page with this public key
    let existingPageId: string | null = null;
    try {
      const searchResponse = await notion.search({
        query: publicKey,
        filter: {
          value: 'page',
          property: 'object',
        },
      });

      // Filter results to find pages in our database with matching PublicKey
      for (const result of searchResponse.results) {
        if (result.object === 'page' && 'parent' in result && result.parent.type === 'database_id' && result.parent.database_id === DATABASE_ID) {
          existingPageId = result.id;
          break;
        }
      }
    } catch (searchError) {
      console.log('Search error (non-fatal):', searchError);
    }

    if (existingPageId) {
      // Update existing page
      const pageId = existingPageId;
      await notion.pages.update({
        page_id: pageId,
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          Email: {
            email: email,
          },
          Project: {
            rich_text: [
              {
                text: {
                  content: company,
                },
              },
            ],
          },
          'X Handle': {
            rich_text: [
              {
                text: {
                  content: x,
                },
              },
            ],
          },
          GitHub: {
            url: github,
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: description,
                },
              },
            ],
          },
        },
      });

      return NextResponse.json(
        { success: true, pageId },
        { status: 200 }
      );
    }

    // Create a new page in the Notion database
    const response = await notion.pages.create({
      parent: {
        database_id: DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        Project: {
          rich_text: [
            {
              text: {
                content: company,
              },
            },
          ],
        },
        PublicKey: {
          rich_text: [
            {
              text: {
                content: publicKey,
              },
            },
          ],
        },
        'X Handle': {
          rich_text: [
            {
              text: {
                content: x,
              },
            },
          ],
        },
        GitHub: {
          url: github,
        },
        Description: {
          rich_text: [
            {
              text: {
                content: description,
              },
            },
          ],
        },
        'Joined At': {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, pageId: response.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating Notion page:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
