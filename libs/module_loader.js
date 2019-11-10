var Fs = require('fs');


class ModuleLoader {
  static getPage(folder, name, default_script){
    var document_html = "";
    var script = default_script;
    
    if (Fs.existsSync('./' + folder + '/' +  name + '/client.html')){
      document_html = Fs.readFileSync('./' + folder + '/' +  name + '/client.html').toString();
    }
    if (Fs.existsSync('./' + folder + '/' +  name + '/client.js')){
      script = Fs.readFileSync('./' + folder + '/' +  name + '/client.js').toString();
    }

    return {
      document_html: document_html,
      script: script
    };    
  }
  
  static loadModule(folder, name, default_script){
    var ServerSocket = require('./server_socket.js');
    ServerSocket.resetModuleListener();
      
    var page = ModuleLoader.getPage(folder, name, default_script);    
    var AllPlayers = require('./all_players.js');
    AllPlayers.broadcastObject(page);
    
    if (Fs.existsSync('./' + folder + '/' +  name + '/server.js')){
      eval(Fs.readFileSync('./' + folder + '/' +  name + '/server.js').toString());
    }
  }

  static loadMinigame = function (name) { 
    console.log("Starting minigame:" + name);
    ModuleLoader.loadModule('minigames', name + '/setup', "displayTimer(5);");    
    
    setTimeout(function() {
      ModuleLoader.loadModule('minigames', name);
    }, 5000);
  }
  
  static loadRandomMinigame = function (){
    var games = Fs.readdirSync("./minigames");
    var name = games[Math.floor(Math.random() * games.length)];
    ModuleLoader.loadMinigame(name);
  }
  
  static getMaxiGame() {
    return "minigamechoser";
  }
    
  static endMinigame(){
      ModuleLoader.loadModule("maxigames", ModuleLoader.getMaxiGame());
      // Remind everyone of player list 
      var AllPlayers = require('./all_players.js');
      var GameEngine = require('./game_engine.js');
      AllPlayers.broadcastMessage("CurrentPlayerList", GameEngine.getAllIds().toString());        
  }
}

module.exports = ModuleLoader;