import { Message, VoiceChannel } from 'discord.js';
import Command from '../Command';
import ParsedMessage from '../../utility/MessageParser/ParsedMessage';
import getVoiceChannelByID from '../../utility/getVoiceChannelByID';
import ChannelID from '../../utility/ChannelID';

export default class JoinCommand extends Command {
  constructor() {
    super('join', 'util');
    this.description = 'Lade den Bot in einen Voice-Channel ein';
    this.usage = `${this.prefix} // joins your voice channel\n${this.prefix} [<#VOICE_CHANNEL_ID>]\n${this.prefix} --channel <#VOICE_CHANNEL_ID>`;
    this.example = `${this.prefix}\n${this.prefix} <#12345>\n${this.prefix} --channel <#12345>`;
  }

  async run(message: Message, parsedMessage: ParsedMessage): Promise<void> {
    const channelID = parsedMessage.getArg('channel', 1);
    let channel: VoiceChannel;
    // if channelID is passed, join there
    // otherwise join user in their channel
    if (channelID) {
      const cleanedID = new ChannelID(channelID).id;
      channel = await getVoiceChannelByID(cleanedID);
    } else {
      channel = message.member.voice.channel;
    }
    if (!channel) throw new Error('no channel found to join');
    await channel.join();
  }
}
