import { describe, it } from 'mocha';
import { expect } from 'chai';
import MessageParser from '../../../src/utility/MessageParser/MessageParser';

describe('MessageParser', () => {
  it('parses message with no arguments', () => {
    const message = '/help test foo bar';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(false);
    expect(parsedMessage.splitMessage.length).to.equal(4);
  });

  it('parses message with simple arguments', () => {
    const message = '/help --message test bla';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(true);
    expect(parsedMessage.splitMessage.length).to.equal(4);
    expect(parsedMessage.args.message).to.equal('test');
  });

  it('parses message with multiple simple arguments', () => {
    const message = '/help --message test --other foo';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(true);
    expect(parsedMessage.splitMessage.length).to.equal(5);
    expect(parsedMessage.args.message).to.equal('test');
    expect(parsedMessage.args.other).to.equal('foo');
  });

  it('parses message with empty simple argument', () => {
    const message = '/help --delete';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(true);
    expect(parsedMessage.splitMessage.length).to.equal(2);
    expect(parsedMessage.args.delete).to.equal('');
  });

  it('parses message with empty simple argument and other argument', () => {
    const message = '/help --delete --message test';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(true);
    expect(parsedMessage.splitMessage.length).to.equal(4);
    expect(parsedMessage.args.delete).to.equal('');
    expect(parsedMessage.args.message).to.equal('test');
  });

  it('parse message with argument values in quotation marks', () => {
    const message = '/help --message "This is a test value"';
    const parsedMessage = new MessageParser(message).parse();
    expect(parsedMessage.hasArgs).to.equal(true);
    expect(parsedMessage.splitMessage.length).to.equal(3);
    expect(parsedMessage.args.message).to.equal('This is a test value');
  });

  it('parses message and throws error bc unfinished quotation mark', () => {
    const message = '/help --message "This is a test value';
    expect(() => new MessageParser(message).parse()).to.throw();
  });
});
