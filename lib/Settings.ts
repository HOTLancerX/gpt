import clientPromise from './db';

export async function Settings() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('settings').find({}).toArray();
    
    const settingsMap: Record<string, string> = {};
    settings.forEach(setting => {
      settingsMap[setting.name] = setting.content;
    });
    
    return settingsMap;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return {};
  }
}