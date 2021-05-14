There's easy and hard things to do for all talents!

# Things we can always use more of
## Themes

This you can do without programming expertise whatsoever, just put new files in the folder [`src/client/assets/avatars/`](src/client/assets/avatars/). Everything is picked up automatically. [`REAMDE.md`](src/client/assets/avatars/REAMDE.md) has more info.

You can always add more themes, more modifiers, or expand the existing ones!

## Games

Check out [`src/minigames`](src/minigames) or [`src/maxigames`](src/maxigames) to make your own. You probably want to add whatever you do to [`minigamechoser`](src/maxigames/minigamechoser) for easy debugging.


### New minigames ideas
* countdown (le compte est bon)
* family feud
* all minigames from uther party (run kitty run)
* all minigames from mario party
* all minigames from jackbox
* wikihow game https://damn.dog/#135
* wikipedia race (could be maxigame)


# Things we need to improve/fix

## click the square
* maybe have it move ?
* where's waldo
* click the most times
* find invisible square

## riddle
* remplacer les chiffre aussi
* better clue algorithm
* avoid clue all
* didnt validate: "it had too many problems" for "It had too many problems." wtf?

## deslettres
* concurrency issue?
* accents in french

## trivia
add categories ? https://www.randomtriviagenerator.com/

## Geoguess
* mb the confirmation cross is not public anymore
* FIX!!!!!!!!!!!!!!!!!

## gfeud
* if a word is fully tipped out it can still count towards score

## dixitmodule
* quote and captionstock dont present propositions all together grouped by player
* quote has a leading space in the real answer

## aidungeon
* i think they forbid iframing now, can we do anything?

## engine

* can we do some sort of boardgamearena integration
* "you are" and "reroll" divs in maxigames could be a shared template like playerlist
* scoreboard sucks at handling ties what about equality!!
