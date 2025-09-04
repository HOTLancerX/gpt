import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, slug, password, photo, type, status, info } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ email }, { slug }] 
    });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await db.collection('users').insertOne({
      name,
      email,
      phone: phone || '',
      slug: slug || '',
      password: hashedPassword,
      photo: photo || '',
      type: type || 'user',
      status: status || 'active',
      info: info || [{ bio: '' }, { tagline: '' }],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      id: result.insertedId, 
      name, 
      email 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}