import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('settings').find({}).toArray();
    
    const settingsMap: Record<string, string> = {};
    settings.forEach(setting => {
      settingsMap[setting.name] = setting.content;
    });
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, content } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Setting name is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('settings').updateOne(
      { name },
      { $set: { content, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Setting saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 });
  }
}