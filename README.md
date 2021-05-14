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

So for now this codebase is relatively simple.

## Helping out!

So you want to help? Check out [TODO.md](TODO.md)!


! a note on the includes: at runtime everything is fine but during the loading sequence of course race conditions/circular dependencies can happen, so I've put the require statement next to their use cases in the base modules and not at the top when possible.



<!-- THIS FILE DEPENDS ON THE ENVIRONMENT.
<!-- YOU PROBABLY WANT TO HAVE IT IGNOREDBY GIT: -->
<!-- git update-index --assume-unchanged client.html -->

<!-- IF YOU CHANGE IT, MAKE SURE TO UPDATE THE IP OF THE SOCKET AND TO MAKE IT KNOWN TO GIT. -->
<!-- git update-index --no-assume-unchanged client.html -->








This mostly revolves around loading "games" which are in maxigames, minigames or othergames.
Each folder can have the following optional files :
- client.js will be executed by clients
- server.ts will be executed by the server
- client.html will be rendered in html body of clients
- setup.html will be rendered in html body of clients while there is a readycheck going on.

theyre executed once, but GameEngine.memory can hold info for you through the game

module vs class
