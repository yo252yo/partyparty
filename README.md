# Welcome to PartyParty!

PartyParty is a modular "mario-party" type of game to play in browser with your friends.

## Setting up!

* Get the files from this repository
* Install node
* Type `npm install` in the directory to fetch all the libraries
* Make sure that the environment-specific files are the way you want them. They are:
  * `bin/`
  * `src/client/init_environment.js`
  * `src/environment.ts`

Then you can run your own PartyParty instance with `bin/run`.

## Code runthrough

So for now this codebase is relatively simple. Let me walk you through the core concepts.
You'll see two kinds of code:
* Server side, it's in typescript `.ts` and it gets compiled and typed.
* Client side, it's in javascript `.js` which is the same without types.
All the code is in [src](`/src/`)

The server side is essentially split between:
* [`/modules/`](`/src/modules/`) which contains all singletons.
* [`/classes/`](`/src/classes/`), objects you can have several of.

The client side is essentially in [`/client/`](`/src/client/`) which is served directly to the clients (that's where images, scripts, etc... are).

The architecture is pretty simple: the platform loads packages of code called games that execute both on client side and server side. Each package is a folder containing the following elements:

- client.js will be executed by clients
- server.ts will be executed by the server
- client.html will be rendered in html body of clients
- setup.html will be rendered in html body of clients while there is a readycheck going on (for minigames).

All of them are optional. They'll be executed once when the game is loaded, but GameEngine.memory can hold info for you through the game if needed.

But an example is worth a thousand words, so do check out the code :)

## Helping out!

So you want to help? Check out [TODO.md](TODO.md)!
