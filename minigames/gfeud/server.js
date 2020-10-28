// Paths are relative because executed from module_loader.js
var Request = require('request-promise');
var Scoreboard = require('./minigames/scoreboard.js');
var MinigamesCommon = require('./minigames/common.js');


// Initialization
var prompt = "";
var answers = [];
var words = new Set();
var game_ended = false;
var scores = new Scoreboard();
var revealed = new Set();

var verbs = ["accept", "add", "admire", "admit", "advise", "afford", "agree", "alert", "allow", "amuse", "analyse", "announce", "annoy", "answer", "apologise", "appear", "applaud", "appreciate", "approve", "argue", "arrange", "arrest", "arrive", "ask", "attach", "attack", "attempt", "attend", "attract", "avoid", "back", "bake", "balance", "ban", "bang", "bare", "bat", "bathe", "battle", "beam", "beg", "behave", "belong", "bleach", "bless", "blind", "blink", "blot", "blush", "boast", "boil", "bolt", "bomb", "book", "bore", "borrow", "bounce", "bow", "box", "brake", "branch", "breathe", "bruise", "brush", "bubble", "bump", "burn", "bury", "buzz", "calculate", "call", "camp", "care", "carry", "carve", "cause", "challenge", "change", "charge", "chase", "cheat", "check", "cheer", "chew", "choke", "chop", "claim", "clap", "clean", "clear", "clip", "close", "coach", "coil", "collect", "colour", "comb", "command", "communicate", "compare", "compete", "complain", "complete", "concentrate", "concern", "confess", "confuse", "connect", "consider", "consist", "contain", "continue", "copy", "correct", "cough", "count", "cover", "crack", "crash", "crawl", "cross", "crush", "cry", "cure", "curl", "curve", "cycle", "dam", "damage", "dance", "dare", "decay", "deceive", "decide", "decorate", "delay", "delight", "deliver", "depend", "describe", "desert", "deserve", "destroy", "detect", "develop", "disagree", "disappear", "disapprove", "disarm", "discover", "dislike", "divide", "double", "doubt", "drag", "drain", "dream", "dress", "drip", "drop", "drown", "drum", "dry", "dust", "earn", "educate", "embarrass", "employ", "empty", "encourage", "end", "enjoy", "enter", "entertain", "escape", "examine", "excite", "excuse", "exercise", "exist", "expand", "expect", "explain", "explode", "extend", "face", "fade", "fail", "fancy", "fasten", "fax", "fear", "fence", "fetch", "file", "fill", "film", "fire", "fit", "fix", "flap", "flash", "float", "flood", "flow", "flower", "fold", "follow", "fool", "force", "form", "found", "frame", "frighten", "fry", "gather", "gaze", "glow", "glue", "grab", "grate", "grease", "greet", "grin", "grip", "groan", "guarantee", "guard", "guess", "guide", "hammer", "hand", "handle", "hang", "happen", "harass", "harm", "hate", "haunt", "head", "heal", "heap", "heat", "help", "hook", "hop", "hope", "hover", "hug", "hum", "hunt", "hurry", "identify", "ignore", "imagine", "impress", "improve", "include", "increase", "influence", "inform", "inject", "injure", "instruct", "intend", "interest", "interfere", "interrupt", "introduce", "invent", "invite", "irritate", "itch", "jail", "jam", "jog", "join", "joke", "judge", "juggle", "jump", "kick", "kill", "kiss", "kneel", "knit", "knock", "knot", "label", "land", "last", "laugh", "launch", "learn", "level", "license", "lick", "lie", "lighten", "like", "list", "listen", "live", "load", "lock", "long", "look", "love", "man", "manage", "march", "mark", "marry", "match", "mate", "matter", "measure", "meddle", "melt", "memorise", "mend", "mess up", "milk", "mine", "miss", "mix", "moan", "moor", "mourn", "move", "muddle", "mug", "multiply", "murder", "nail", "name", "need", "nest", "nod", "note", "notice", "number", "obey", "object", "observe", "obtain", "occur", "offend", "offer", "open", "order", "overflow", "owe", "own", "pack", "paddle", "paint", "park", "part", "pass", "paste", "pat", "pause", "peck", "pedal", "peel", "peep", "perform", "permit", "phone", "pick", "pinch", "pine", "place", "plan", "plant", "play", "please", "plug", "point", "poke", "polish", "pop", "possess", "post", "pour", "practise", "pray", "preach", "precede", "prefer", "prepare", "present", "preserve", "press", "pretend", "prevent", "prick", "print", "produce", "program", "promise", "protect", "provide", "pull", "pump", "punch", "puncture", "punish", "push", "question", "queue", "race", "radiate", "rain", "raise", "reach", "realise", "receive", "recognise", "record", "reduce", "reflect", "refuse", "regret", "reign", "reject", "rejoice", "relax", "release", "rely", "remain", "remember", "remind", "remove", "repair", "repeat", "replace", "reply", "report", "reproduce", "request", "rescue", "retire", "return", "rhyme", "rinse", "risk", "rob", "rock", "roll", "rot", "rub", "ruin", "rule", "rush", "sack", "sail", "satisfy", "save", "saw", "scare", "scatter", "scold", "scorch", "scrape", "scratch", "scream", "screw", "scribble", "scrub", "seal", "search", "separate", "serve", "settle", "shade", "share", "shave", "shelter", "shiver", "shock", "shop", "shrug", "sigh", "sign", "signal", "sin", "sip", "ski", "skip", "slap", "slip", "slow", "smash", "smell", "smile", "smoke", "snatch", "sneeze", "sniff", "snore", "snow", "soak", "soothe", "sound", "spare", "spark", "sparkle", "spell", "spill", "spoil", "spot", "spray", "sprout", "squash", "squeak", "squeal", "squeeze", "stain", "stamp", "stare", "start", "stay", "steer", "step", "stir", "stitch", "stop", "store", "strap", "strengthen", "stretch", "strip", "stroke", "stuff", "subtract", "succeed", "suck", "suffer", "suggest", "suit", "supply", "support", "suppose", "surprise", "surround", "suspect", "suspend", "switch", "talk", "tame", "tap", "taste", "tease", "telephone", "tempt", "terrify", "test", "thank", "thaw", "tick", "tickle", "tie", "time", "tip", "tire", "touch", "tour", "tow", "trace", "trade", "train", "transport", "trap", "travel", "treat", "tremble", "trick", "trip", "trot", "trouble", "trust", "try", "tug", "tumble", "turn", "twist", "type", "undress", "unfasten", "unite", "unlock", "unpack", "untidy", "use", "vanish", "visit", "wail", "wait", "walk", "wander", "want", "warm", "warn", "wash", "waste", "watch", "water", "wave", "weigh", "welcome", "whine", "whip", "whirl", "whisper", "whistle", "wink", "wipe", "wish", "wobble", "wonder", "work", "worry", "wrap", "wreck", "wrestle", "wriggle", "x-ray", "yawn", "yell", "zip", "zoom"];

var phrases = ["How to ", "Why ", "Can I ", "What if I ", "Should I ", "Where to "];

var verb = function(){
  return verbs[Math.floor(Math.random() * verbs.length)];
}
var phrase = function(){
  return phrases[Math.floor(Math.random() * phrases.length)];
}


// Game Logic
// Getting the riddle
var sendPrompt = function (){
  AllPlayers.broadcastMessage("GFeudPrompt", formatAnswers().join("<br/>"));
}

var httpRequestCallback = function(html){
  var completes = JSON.parse(html.substr(4))[0];
  answers = [];
  words = new Set();
  for(var i = 0; i < completes.length; i++){
    var sentence = completes[i][0].replace(/<\/?[^>]+(>|$)/g, "").toLowerCase();
    var s_words = sentence.split(" ");
    for(var j = 0; j <s_words.length;j++){
      words.add(s_words[j]);
    }
    answers.push(sentence);
  }

  var s_words = prompt.split(" ");
  for(var j = 0; j <s_words.length;j++){
    words.delete(s_words[j]);
  }
  console.log("Answers:" + answers);
  if(answers == ""){
    generatePrompt();
  }
  sendPrompt();
}

var generatePrompt = function() {
  prompt = (phrase() + verb() + " ").toLowerCase();
  console.log("Prompt:" + prompt);
  Request('https://www.google.com/complete/search?q=' + prompt + '&cp=1&client=psy-ab&xssi=t&gs_ri=gws-wiz&hl=en-FR&authuser=0&pq=google%20autocomplete%20api&psi=JBeOX_vvCqqWlwSanqDYAg.1603147556060&dpr=1.25').then(httpRequestCallback);
}
generatePrompt();

var formatAnswers = function(){
  var result = [];
  for(var i = 0; i < answers.length; i++){
    var r = "";
    var s = answers[i].split(" ");
    for(var j = 0; j < s.length; j++){
      var w = s[j];
      if (words.has(w)){
        for(var k = 0; k < w.length; k++){
          if (revealed.has(w[k])){
            r += w[k];
          } else {
            r += "*";
          }
        }
        r += " ";
      } else {
        r += s[j] + " ";
      }
    }
    result.push(r);
  }
  return result;
}

var trueEndGame = function(){
MinigamesCommon.simpleOnePlayerWin(scores.getMaxScore());
}


var endGame = function(){
  if (game_ended) { return; }
  AllPlayers.broadcastMessage("GFeudPrompt", answers.join("<br/>"));
  game_ended = true;
  setTimeout(trueEndGame, 15000);
}
setTimeout(endGame, 60000); // Deadline

var tip = function(){
  if (game_ended) { return; }
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

  revealed.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
  sendPrompt();
  setTimeout(tip, 5000); // Deadline
}
setTimeout(tip, 5000); // Deadline

var moduleListener = function(event, webSocket){
  switch(event.data.split("|")[0]) {
    case "GFeudPropose":
      var proposal = event.data.split("|")[1].toLowerCase().split(" ");
      var points = 0;
      for(var i = 0; i < proposal.length; i++){
        if(words.has(proposal[i])){
          words.delete(proposal[i]);
          points += proposal[i].length;
        }
      }
      if (points > 0) {
          scores.incrementScore(webSocket.pp_data.player_id, points);
          sendPrompt();
      }
      break;
    default:
  }
}

ServerSocket.plugModuleListener(moduleListener);
