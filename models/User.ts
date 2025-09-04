import { ObjectId } from 'mongodb';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  slug: string;
  password: string;
  photo: string;
  type: 'admin' | 'user';
  status: 'active' | 'inactive';
  info: Array<{
    bio?: string;
    tagline?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}