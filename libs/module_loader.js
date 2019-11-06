var Fs = require('fs');


class ModuleLoader {
  static loadModule(folder, name){
    var ServerSocket = require('./server_socket.js');
    ServerSocket.resetModuleListener();
      
    var document_html = "";
    var script = "";
    
    if (Fs.existsSync('./' + folder + '/' +  name + '.html')){
      document_html = Fs.readFileSync('./' + folder + '/' +  name + '.html').toString();
    }
    if (Fs.existsSync('./' + folder + '/' +  name + '.client.js')){
      script = Fs.readFileSync('./' + folder + '/' +  name + '.client.js').toString();
    }

    var page = {
      document_html: document_html,
      script: script
    };
    
    var AllPlayers = require('./all_players.js');
    AllPlayers.broadcastObject(page);
    
    if (Fs.existsSync('./' + folder + '/' +  name + '.server.js')){
      eval(Fs.readFileSync('./' + folder + '/' +  name + '.server.js').toString());
    }
  }

  static loadMinigame = function (name) { 
    ModuleLoader.loadModule('minigames', name + '.setup');
    
    setTimeout(function() {
      ModuleLoader.loadModule('minigames', name);
    }, 5000);
  }
}

module.exports = ModuleLoader;