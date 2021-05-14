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
    var quote = c('.quote').children().first().text();
    var author = c('.author').children().first().next().text();

    var s = quote.split(',');
    if (s.length != 2)
      {
        fetchQuote();
      }
    else
    {
      game.proposals["dummy"] = [s[1].toLowerCase()];
      console.log(s[1]);
      SocketManager.broadcast({Quote: s[0] + ",<br>" + author});
    }
  } catch (error) {
    fetchQuote();
  }
}

var fetchQuote = function() {
  Request('http://www.quotationspage.com/random.php',
    {"method": "POST",
    "body": "number=4&collection%5B%5D=mgm&collection%5B%5D=motivate&collection%5B%5D=classic&collection%5B%5D=coles&collection%5B%5D=lindsly&collection%5B%5D=poorc&collection%5B%5D=altq&collection%5B%5D=20thcent&collection%5B%5D=bywomen&collection%5B%5D=devils&collection%5B%5D=contrib"
    }).then(httpRequestCallback);
}
fetchQuote();

game.startDefault();
