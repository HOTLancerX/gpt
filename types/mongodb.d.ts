declare module 'mongodb' {
  export interface MongoClientOptions {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
    [key: string]: any;
  }

  export class MongoClient {
    constructor(url: string, options?: MongoClientOptions);
    connect(): Promise<MongoClient>;
    db(name?: string): Db;
    close(): Promise<void>;
  }

  export interface Db {
    collection(name: string): Collection;
    listCollections(): any;
  }

  export interface Collection {
    find(query?: any, options?: any): Cursor;
    findOne(query?: any, options?: any): Promise<any>;
    insertOne(doc: any, options?: any): Promise<InsertOneResult>;
    updateOne(filter: any, update: any, options?: any): Promise<UpdateResult>;
    deleteOne(filter: any, options?: any): Promise<DeleteResult>;
    countDocuments(query?: any, options?: any): Promise<number>;
  }

  export interface Cursor {
    toArray(): Promise<any[]>;
    limit(n: number): Cursor;
    skip(n: number): Cursor;
  }

  export interface InsertOneResult {
    insertedId: any;
    acknowledged: boolean;
  }

  export interface UpdateResult {
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    acknowledged: boolean;
  }

  export interface DeleteResult {
    deletedCount: number;
    acknowledged: boolean;
  }

  export class ObjectId {
    constructor(id?: string | number | ObjectId);
    toHexString(): string;
    static createFromTime(time: number): ObjectId;
    static createFromHexString(hexString: string): ObjectId;
    static isValid(id: string | number | ObjectId): boolean;
  }

  export interface WithId<T> {
    _id: ObjectId;
  }
}