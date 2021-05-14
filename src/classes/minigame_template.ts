import { Scoreboard } from './scoreboard.js';
import { ServerSocket } from './server_socket.js';
import { SocketListener } from "../types/io";
import * as GamesLoader from '../modules/games_loader.js';
import * as SocketManager from '../modules/server_socket_manager.js';
import * as GameEngine from '../modules/game_engine.js';

class Minigame {
  scores: Scoreboard = new Scoreboard();
  ended: boolean = false;
  listener?: SocketListener;
  timeAfterEnd: number = 3000;

  start() {
    if (this.listener){
      ServerSocket.extraListener = this.listener;
    }
  }

  startWithDeadline(deadline: number) {
    var self = this;
    setTimeout(function(){ self.end(); }, deadline);
    this.start();
  }

  computeWinner() {
    console.log("# Minigame over with no winner (default)");
  }

  endingCleanup(){}

  end() {
    if (this.ended) { return; }
    this.ended = true;
    this.computeWinner();
    this.endingCleanup();
    setTimeout(GamesLoader.endMinigame, this.timeAfterEnd);
  }
}

export class LeastScoreWinner extends Minigame {
  computeWinner(){
    var winner = this.scores.getMinScore();
    console.log("# Minigame ended with winner: " + winner);
    SocketManager.broadcast({winnerAnnouncement: winner});

    if (winner) {
      GameEngine.getScoreboard().incrementScore(winner);
    }
  }
}

export class MostScoreWinner extends Minigame {
  computeWinner(){
    var winner = this.scores.getMaxScore() || "Noone you all suck";
    console.log("# Minigame ended with winner: " + winner);
    SocketManager.broadcast({winnerAnnouncement: winner});

    if (winner) {
      GameEngine.getScoreboard().incrementScore(winner);
    }
  }
}

export class DixitLike extends MostScoreWinner {
  proposals: { [key: string]: string[] } = {};

  startVotingPhase() {
    SocketManager.broadcast({DixitLikeProposals: this.proposals});
  }

  dixitListener(object: any, socket: ServerSocket) {
    if (object.ProposeQuizzModuleAnswer) {
      var proposal = object.ProposeQuizzModuleAnswer.toLowerCase();
      if(!this.proposals[socket.player_data().player_id]){
        this.proposals[socket.player_data().player_id] = [];
      }
      this.proposals[socket.player_data().player_id].push(proposal);
      console.log(`${socket.player_data().player_id} proposes ${proposal}`);
    }
    if (object.ProposeQuizzModuleVote){
      if (object.ProposeQuizzModuleVote != "dummy") {
        this.scores.incrementScore(object.ProposeQuizzModuleVote);
      }
    }
  }

  startDefault() {
    var self = this;
    this.listener = function(object, socket){ self.dixitListener(object, socket); }
    setTimeout(function(){self.startVotingPhase();}, 60000);
    this.startWithDeadline(60000+35000);
  }
}

export class QuizzGame extends MostScoreWinner {
  question: string = "";
  answer: string = "";

  static sanitizeForAnswerCheck(s: string){
    return s.replace(" ", "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
  }

  static obfuscateAll(s: string){
    return s.replace(/[a-zA-Z]/g, "-");
  }

  static obfuscatePartially(s: string){
    var answer_masked = QuizzGame.obfuscateAll(s).split("");
    var answer_split = s.split("");

    var clue = "";
    var hint = 0;
    // We want at least 3 hints...
    while(hint <= 3) {
      clue = "";
      hint = 0;

      for (var i = 0; i < answer_masked.length; i++){
        if (Math.random() < 0.15){
          clue += answer_split[i];
          hint ++;
        } else {
          clue += answer_masked[i];
        }
      }

      // ... unless the string is super short.
      if (s.length < 5) {
        break;
      }
    }

    return clue;
  }

  giveFirstClue() {
    if (this.ended || !this.answer) { return; }
    SocketManager.broadcast({QuizzModuleClue: QuizzGame.obfuscateAll(this.answer)});
  }

  giveSecondClue() {
    if (this.ended || !this.answer) { return; }
    SocketManager.broadcast({QuizzModuleClue: QuizzGame.obfuscatePartially(this.answer)});
  }

  quizListener(object: any, socket: ServerSocket) {
    if (object.ProposeQuizzModuleAnswer){
      var proposal = object.ProposeQuizzModuleAnswer;

      var winner = socket.player_data().player_id;
      console.log(`${winner} proposes ${proposal}`);
      if (proposal && this.answer && winner &&
          QuizzGame.sanitizeForAnswerCheck(proposal) == QuizzGame.sanitizeForAnswerCheck(this.answer)) {
        this.scores.incrementScore(winner);
        this.end();
      }
    }
  };

  startWithAnswer(question: string, answer: string) {
    console.log(`Question/answer: ${question}/${answer}`);
    SocketManager.broadcast({QuizzModuleQuestion: question});

    this.question = question;
    this.answer = answer;
    var self = this;
    this.listener = function(object, socket){ self.quizListener(object, socket); }

    var self = this;
    setTimeout(function(){ self.giveFirstClue(); }, 5000);
    setTimeout(function(){ self.giveSecondClue(); }, 10000);

    this.startWithDeadline(30000);
  }

  computeWinner(){
    SocketManager.broadcast({QuizzModuleAnswerAnnouncement: this.answer});
    super.computeWinner();
  }
}
