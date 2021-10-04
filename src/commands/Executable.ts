import { Message } from 'discord.js';
import type DiscordBot from '../DiscordBot';

/**
 * interface for executable entities
 */
export default interface Executable {
  prefix: string
  execute: (message: Message) => Promise<void>
  configure?: ({ context }: { context: DiscordBot }) => void
}
