import { DixitLike } from '../../classes/minigame_template.js';
import * as SocketManager from '../../modules/server_socket_manager.js';
import Request from 'request-promise';
import Cheerio from 'cheerio';

// Initialization
var game = new DixitLike();

// Game Logic
// Getting the picture
var httpRequestCallback = function(html:string){
  try {
    var c = Cheerio.load(html);
    var src = c('.preview')[0].attribs.src;
    var title = "Unbeteitelt";
    try {
      var node = c('.title.outbound')[0].children[0] as any;
      if(node.data){
        title = node.data;
      }
    } catch (e){ console.log(e);}
    console.log(title);
    game.proposals["dummy"] = [title.toLowerCase()];

    if (!src){
      requestImg();
    }

    SocketManager.broadcast({CaptionStockImg: src});
  } catch (error) {
    requestImg();
  }
}

var requestImg = function() {
  Request('https://old.reddit.com/r/wtfstockphotos/random').then(httpRequestCallback);
}
requestImg();

game.startDefault();
