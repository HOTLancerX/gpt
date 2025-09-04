import { ObjectId } from 'mongodb';

export interface Setting {
  _id: ObjectId;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}