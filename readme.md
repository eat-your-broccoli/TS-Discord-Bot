#discord-ts

A Discord Bot written in TypeScript.

## Installation

1. run `npm i` to install dependencies
2. copy file `.env.example` to `.env`
3. enter your bot credentials in `.env`

## Build

run `npm run build` to transpile `.ts`-files to `.js`.
Built destination is `build/`.

## Docker

A `Dockerfile` is provided. To build the docker image, run `docker build -t <YOUR DOCKER IMAGE TAG NAME> .`

## Development

run `npm run start:dev` 

The bot will automatically restart on file changes within the `src`-directory.

## Bot Commands

The bot's prefix is `/`. By default, the bot reacts to messages in all text channels.

### Shorthands

Shorthands are shortcuts for Commands. A Shorthand has a one-character prefix.
The Shorthand-Char will be replaced with the Command-Name.

As an example, a Shorthand for the `help`-Command may be `?`.
`? /somecommand` will internally handled the same as `/help /somecommand`.

### Help Command

`/help`, `/help <Command name>`

The bot will display a list of all available commands.

If you append a command name, it will display detailed help about the command.
