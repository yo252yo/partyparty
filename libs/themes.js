
var Fs = require('fs');

class Themes {
  static getModifiers(){
    var raw = Fs.readdirSync("./client/assets/avatars/modifiers");

    var modules = [];

    for (var i in raw){
      var s = raw[i].split("_")[0];
      if (raw.includes(s + "_above.png") && raw.includes(s + "_below.png")){
        modules.push(s);
      }
    }
    return modules;
  }

  static pickTheme() {
    var themes =  Fs.readdirSync("./client/assets/avatars/nouns");
    return themes[Math.floor(Math.random() * themes.length)].split(".")[0];
  }

  static getNouns(theme){
    var raw = Fs.readdirSync("./client/assets/avatars/nouns/" + theme);

    var nouns = [];
    for (var i in raw){
      nouns.push(raw[i].split(".")[0]);
    }
    return nouns;
  }
}

module.exports = Themes;
