var Express = require('express');
var APPLICATION = Express();
var ExpressWs = require('express-ws')(APPLICATION);

var AllPlayers = require('./libs/all_players.js');
AllPlayers.bindExpressWs(ExpressWs);

require('./libs/setup_endpoints.js')(APPLICATION);

