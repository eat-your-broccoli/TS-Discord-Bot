export default class ChannelID {
  id: string;

  constructor(id: string) {
    this.id = String(id).replace(/[^\d.-]/g, '');
  }
}
