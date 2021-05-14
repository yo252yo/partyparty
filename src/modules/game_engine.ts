import * as GamesLoader from './games_loader.js';
import * as Themes from './themes.js';
import { Scoreboard } from '../classes/scoreboard.js';

var mainScore = new Scoreboard();

export var memory: any = {};

export function startGame(maxigame?:string) {
  memory = {};
  Themes.pickTheme();
  GamesLoader.loadMaxigame(maxigame);
  mainScore = new Scoreboard();
}

export function getScoreboard(){
  return mainScore;
}

export function broadcastScores(){
  mainScore.broadcastScores();
}
