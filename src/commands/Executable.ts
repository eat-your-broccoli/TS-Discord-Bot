import { CommandInteraction } from 'discord.js';
import type DiscordBot from '../DiscordBot';

/**
 * interface for executable entities
 */
export default interface Executable {
  prefix: string
  execute: (interaction: CommandInteraction) => Promise<void>
  go: (interaction: CommandInteraction) => Promise<any>
  configure?: ({ context }: { context: DiscordBot }) => void
}
