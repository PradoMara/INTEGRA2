import * as fs from 'fs';
import * as path from 'path';

export function loadProfanityList(): string[] {
  const filePath = path.join(__dirname, '../moderation/profanity-list.txt');
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').map((w: string) => w.trim()).filter(Boolean);
}