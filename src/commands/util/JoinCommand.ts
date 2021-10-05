import { Message, StageChannel, VoiceChannel } from 'discord.js';
import Command from '../Command';
import ParsedMessage from '../../utility/MessageParser/ParsedMessage';
import getVoiceChannelByID from '../../utility/getVoiceChannelByID';
import ChannelID from '../../utility/ChannelID';
import ScopedLanguageHandler from '../../utility/Lang/ScopedLanguageHandler';
import join from '../../utility/Voice/join';

export default class JoinCommand extends Command {
  private lang: ScopedLanguageHandler;

  constructor() {
    super('join', 'util');
    this.lang = new ScopedLanguageHandler('commands.util.join');
    this.description = this.lang.get('description');
    this.usage = `${this.prefix} // joins your voice channel\n${this.prefix} [<#VOICE_CHANNEL_ID>]\n${this.prefix} --channel <#VOICE_CHANNEL_ID>`;
    this.example = `${this.prefix}\n${this.prefix} <#12345>\n${this.prefix} --channel <#12345>`;
  }

  async run(message: Message, parsedMessage: ParsedMessage): Promise<void> {
    const channelID = parsedMessage.getArg('channel', 1);
    let channel: VoiceChannel | StageChannel;
    // if channelID is passed, join there
    // otherwise join user in their channel
    if (channelID) {
      const cleanedID = new ChannelID(channelID).id;
      channel = await getVoiceChannelByID(cleanedID);
    } else {
      channel = message.member.voice.channel;
    }
    if (!channel) throw new Error(this.lang.get('error.noChannel'));
    join(channel);
  }
}
