import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const updates = await request.json();
    delete updates.password;
    delete updates._id;
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const result = await db.collection('users').deleteOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}