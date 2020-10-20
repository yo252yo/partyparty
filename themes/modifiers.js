
var Fs = require('fs');
var raw = Fs.readdirSync("./client/assets/avatars/modifiers");

var modules = [];

for (var i in raw){
  var s = raw[i].split("_")[0];
  if (raw.includes(s + "_above.png") && raw.includes(s + "_below.png")){
    modules.push(s);
  }
}

module.exports = modules;
