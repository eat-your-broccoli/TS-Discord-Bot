import { TextChannel, VoiceChannel } from 'discord.js';
import Queue from './Queue';

const queues: Record<string, Queue> = {};

export function getSongQueue(guildId: string): Queue | null {
  return queues[guildId];
}

export function getOrCreateSongQueue(guildId: string, text: TextChannel, voice: VoiceChannel)
  : Queue {
  const existingQueue = getSongQueue(guildId);
  if (existingQueue) return existingQueue;

  console.debug('creating queue for guild:', guildId);
  queues[guildId] = new Queue(guildId, text, voice);
  return queues[guildId];
}

export function deleteQueue(guildId: string): void {
  console.debug('deleting queue for guild:', guildId);
  queues[guildId] = undefined;
}
