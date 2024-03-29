import { SocketPlayerData } from "../types/io";

import * as Fs from "fs";

import * as SocketManager from './server_socket_manager.js';
import * as GameEngine from './game_engine.js';

var current_theme = "algebra";
var usedIds: string[] = [];

function getAllPossibleColors(){
  return ['#F0F8FF','#FAEBD7','#00FFFF','#7FFFD4','#F0FFFF','#F5F5DC','#FFE4C4','#000000','#FFEBCD','#0000FF','#8A2BE2','#A52A2A','#DEB887','#5F9EA0','#7FFF00','#D2691E','#FF7F50','#6495ED','#FFF8DC','#DC143C','#00FFFF','#00008B','#008B8B','#B8860B','#A9A9A9','#006400','#BDB76B','#8B008B','#556B2F','#FF8C00','#9932CC','#8B0000','#E9967A','#8FBC8F','#483D8B','#2F4F4F','#00CED1','#9400D3','#FF1493','#00BFFF','#696969','#1E90FF','#B22222','#FFFAF0','#228B22','#FF00FF','#DCDCDC','#F8F8FF','#FFD700','#DAA520','#BEBEBE','#808080','#00FF00','#008000','#ADFF2F','#F0FFF0','#FF69B4','#CD5C5C','#4B0082','#FFFFF0','#F0E68C','#E6E6FA','#FFF0F5','#7CFC00','#FFFACD','#ADD8E6','#F08080','#E0FFFF','#FAFAD2','#D3D3D3','#90EE90','#FFB6C1','#FFA07A','#20B2AA','#87CEFA','#778899','#B0C4DE','#FFFFE0','#00FF00','#32CD32','#FAF0E6','#FF00FF','#B03060','#800000','#66CDAA','#0000CD','#BA55D3','#9370DB','#3CB371','#7B68EE','#00FA9A','#48D1CC','#C71585','#191970','#F5FFFA','#FFE4E1','#FFE4B5','#FFDEAD','#000080','#FDF5E6','#808000','#6B8E23','#FFA500','#FF4500','#DA70D6','#EEE8AA','#98FB98','#AFEEEE','#DB7093','#FFEFD5','#FFDAB9','#CD853F','#FFC0CB','#DDA0DD','#B0E0E6','#A020F0','#800080','#663399','#FF0000','#BC8F8F','#4169E1','#8B4513','#FA8072','#F4A460','#2E8B57','#FFF5EE','#A0522D','#C0C0C0','#87CEEB','#6A5ACD','#708090','#FFFAFA','#00FF7F','#4682B4','#D2B48C','#008080','#D8BFD8','#FF6347','#40E0D0','#EE82EE','#F5DEB3','#FFFFFF','#F5F5F5','#FFFF00','#9ACD32'];
}

export function getRandomColor(){
  var colors = getAllPossibleColors();
  return colors[Math.floor(Math.random() * colors.length)];
}

function getModifiers(){
  var raw = Fs.readdirSync("./src/client/assets/avatars/modifiers");

  var modules = [];

  for (var i in raw){
    var s = raw[i].split("_")[0];
    if (raw.includes(s + "_above.png") && raw.includes(s + "_below.png")){
      modules.push(s);
    }
  }
  return modules;
}

export function pickTheme(name?: string) {
  var themes =  Fs.readdirSync("./src/client/assets/avatars/nouns");
  if(!name || ! themes.includes(name)){
    name = themes[Math.floor(Math.random() * themes.length)].split(".")[0];
  }
  current_theme = name;
  console.log("[[[themes]]] setting up theme: " + current_theme);
  SocketManager.renameExistingPlayers();
  GameEngine.broadcastScores();
  return current_theme;
}

function getNouns(theme: string) {
  var raw = Fs.readdirSync("./src/client/assets/avatars/nouns/" + theme);

  var nouns = [];
  for (var i in raw){
    nouns.push(raw[i].split(".")[0]);
  }
  return nouns;
}

export function getNewId(){
  var modifiers = getModifiers();
  var nouns = getNouns(current_theme);

  var rollProposal = function(){
    return modifiers[Math.floor(Math.random()*modifiers.length)] + nouns[Math.floor(Math.random()*nouns.length)];
  }

  var proposal = rollProposal();
  while (proposal in usedIds){
    proposal = rollProposal();
  }
  usedIds.push(proposal);
  return proposal;
}

export function getCurrentTheme(){
  return current_theme;
}

export function getNewPlayerData() {
  var r: SocketPlayerData = {
    player_id: getNewId(),
    color: getRandomColor()
  };
  return r;
}
