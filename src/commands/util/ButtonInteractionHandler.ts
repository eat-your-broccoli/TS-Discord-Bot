import { ButtonInteraction } from 'discord.js';
import RadioControlInteraction from '../radio/RadioControlInteraction';

export default class ButtonInteractionHandler {
  static handle(interaction: ButtonInteraction): void {
    const { customId } = interaction;
    if (customId.startsWith('radioControl.action.player')) {
      RadioControlInteraction.handle(interaction);
      return;
    }
    throw new Error(`unknown interaction: ${interaction}`);
  }
}
