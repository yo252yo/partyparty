var Fs = require('fs');
var AllPlayers = require('./all_players.js');


class ModuleLoader {
  static getPage(folder, name){
    var document_html = "";
    var script = "";

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

  static loadModule(folder, name){
    var ServerSocket = require('./server_socket.js');
    ServerSocket.resetModuleListener();

    console.log('./' + folder + '/' +  name + '/server.js');
    var page = ModuleLoader.getPage(folder, name);
    var AllPlayers = require('./all_players.js');
    AllPlayers.broadcastObject(page);

    if (Fs.existsSync('./' + folder + '/' +  name + '/server.js')){
      eval(Fs.readFileSync('./' + folder + '/' +  name + '/server.js').toString());
    }
  }

  static loadMinigame(name) {
    console.log("Starting minigame:" + name);
    ModuleLoader.pendingMinigame = name;

    var page = ModuleLoader.getPage('minigames', name + '/setup');
    page.script = Fs.readFileSync('./libs/minigames/setup_client.js').toString();
    var AllPlayers = require('./all_players.js');
    AllPlayers.broadcastObject(page);

    eval(Fs.readFileSync('./libs/minigames/setup_server.js').toString());
  }

  static startMinigame(){
    ModuleLoader.loadModule('minigames', ModuleLoader.pendingMinigame);
    delete ModuleLoader.pendingMinigame;
  }

  static loadRandomMinigame(){
    var games = Fs.readdirSync("./minigames");
    var name = games[Math.floor(Math.random() * games.length)];
    ModuleLoader.loadMinigame(name);
  }

  static getMaxiGame() {
    return "minigamechoser";//aidungeon
  }

  static endMinigame(){
      var welcome_page = ModuleLoader.getPage("maxigames", ModuleLoader.getMaxiGame());
      AllPlayers.broadcastObject(welcome_page);

      // Remind everyone of player list
      var GameEngine = require('./game_engine.js');
      GameEngine.broadcastPlayersList();
  }
}

module.exports = ModuleLoader;
