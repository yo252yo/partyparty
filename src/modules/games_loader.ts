import { HtmlPage } from "../types/io";

import * as Fs from "fs";

import * as SocketManager from './server_socket_manager.js';
import * as GameEngine from './game_engine.js';
import { ServerSocket } from '../classes/server_socket.js';

let currentMaxiGame = "minigamechoser";
let pendingMiniGame: string|undefined = undefined;

function getFile(path: string) {
  if (Fs.existsSync('./src/' + path)){
    return Fs.readFileSync('./src/' + path).toString();
  }
  return undefined;
}

function getGamePage(folder: string, name: string){
  var r: HtmlPage = {};
  var html = getFile(folder + '/' +  name + '/client.html');
  var script = getFile(folder + '/' +  name + '/client.js');
  if (html) {
    r.html = html;
  }
  if (script) {
    r.script = script;
  }

  return r;
}

function loadGame(folder: string, name: string){
  ServerSocket.resetExtraListeners();

  console.log(`[[[game_loader]]] LOADING GAME: ${folder} / ${name}`);

  // Client work
  var page = getGamePage(folder, name);
  SocketManager.broadcast(page);

  // Server work
  var serverCodePath = folder + '/' +  name + '/server';
  if (Fs.existsSync('./src/' + serverCodePath + '.ts')){
    var file = '../' + serverCodePath + '.js';
    delete require.cache[require.resolve(file)]; // Otherwise the server.ts stays cached and is not reexecuted.
    require(file);
  }
}

export function loadMaxigame (name?:  string){
  if(name){
    currentMaxiGame = name;
  }
  loadGame("maxigames", currentMaxiGame);
  GameEngine.broadcastScores(); // maxigames often need score at setup.
}

export function getMaxigamePage() {
  return getGamePage("maxigames", currentMaxiGame);
}

export function setupMinigame(name: string) {
  if (pendingMiniGame){
    return false; // No setting up while a minigame is pending
  }

  var html = getFile('minigames/' +  name + '/setup.html');
  if (!html){
    return;
  }
  console.log("[[[game_loader]]] Setting up minigame:" + name);
  pendingMiniGame = name;
  SocketManager.broadcast({html: html}); // note: this doesnt affect the extra listeners

  // This is shared between all minigames.
  // Right now we broadcast two objects for cleaner code but it may be good to merge them.
  loadGame('othergames', 'readycheck'); // this affects the extra listeners
}

export function setupRandomMinigame(){
  var games = Fs.readdirSync("./src/minigames");
  var name = games[Math.floor(Math.random() * games.length)];
  setupMinigame(name);
}

export function startPendingMinigame(){
  if(!pendingMiniGame){
    return;
  }
  loadGame('minigames', pendingMiniGame);
  pendingMiniGame = undefined;
}

export function endMinigame(){
  loadMaxigame();
}
