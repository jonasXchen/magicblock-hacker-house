# Notion Integration Setup

This guide will help you set up Notion to store user registrations for the MagicBlock Hacker House.

## Step 1: Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"New integration"**
3. Fill in the details:
   - **Name:** `MagicBlock Hacker House` (or any name)
   - **Logo:** (optional)
   - **Associated workspace:** Select your workspace
4. Click **"Submit"**
5. You'll see your **API Key** - copy this and save it somewhere safe

## Step 2: Create a Notion Database

1. In your Notion workspace, create a new page
2. Add a database as a "Table" view
3. Name it something like "Hacker House Registrations"
4. Set up the following columns:

### Required Columns:

| Column Name | Type | Description |
|---|---|---|
| Name | Title | User's full name |
| PublicKey | Text | Solana wallet public key (unique identifier) |
| Email | Email | User's email address |
| Company | Text | Company or project name |
| Description | Text | Project description |
| X Handle | Text | Twitter/X handle |
| Joined At | Date | Registration timestamp |

**To add columns:**
- Click the **"+"** button next to existing columns
- Enter the column name
- Select the appropriate type from the dropdown

## Step 3: Share Database with Integration

1. Click **"Share"** button (top right of your database)
2. Click **"Invite"**
3. Search for your integration name (e.g., "MagicBlock Hacker House")
4. Select it from the dropdown
5. Click **"Invite"**
6. Confirm the permissions

## Step 4: Get Your Database ID

1. Open your database in Notion
2. Look at the URL in your browser: `https://www.notion.so/WORKSPACE_ID/DATABASE_ID?v=VIEW_ID`
3. Copy the `DATABASE_ID` (the long alphanumeric string after the `/`)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

## Step 5: Set Environment Variables

Add these to your `.env.local` file in the project root:

```env
NOTION_API_KEY=your_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

Replace:
- `your_api_key_here` with the API key from Step 1
- `your_database_id_here` with the database ID from Step 4

## Step 6: Restart Your Development Server

```bash
yarn dev
```

## Verification

1. Go to http://localhost:3000
2. Click "Join Virtual Office"
3. Connect your Solana wallet
4. Fill out the form
5. Submit
6. Check your Notion database - you should see a new row with your information

## Troubleshooting

**Error: "Server configuration error"**
- Make sure both `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set in `.env.local`
- Restart your development server after adding environment variables

**Error: "Failed to submit form"**
- Verify the database ID is correct (should be the long string from the URL)
- Make sure the integration has access to the database (check Share permissions)
- Check browser console for more details

**Public key not showing up in database**
- Verify that the "PublicKey" column exists and is of type "Text"
- Make sure the integration has edit permissions on the database

## Column Customization

You can add additional columns to your database if needed. Just make sure:
- The columns in this app match your Notion database
- If you add new columns, update the API route (`app/api/join/route.ts`) to include them
