// ************* MODEL *************
//here goes the melody, the audio and gameplay vars
var model = {
  moveCount: 0,
  strictMode: false,
  speed: 600,
  playing: false,
  melody: [],
  playerSequence: [],

  init: function() {
    var random = null;
    for (var i = 0; i<=19; i++) {
      random = Math.floor((Math.random()*4)+1);
      model.melody.push(random);
    }
  }
};
// ************* CONTROLLER *************
var controller = {
  //initialize all
  init: function() {
    this.onSwitch = document.getElementById("onSwitch");
    this.onSwitch.addEventListener("change", function() {
      if(this.checked) {
        model.init();
        view.init();
      }
      else {
        view.shutdown();
        controller.gameOver();
      }
    });
  },
  //restart the game
  gameOver: function() {
    model.melody = [];
    model.playerSequence = [];
    model.moveCount = 0;
    model.playing = false;
    model.strictMode = false;
    model.init();
    view.render();
  },
  //main gameplay function
  play: function() {
    model.moveCount++;
    view.updateCounter(model.moveCount);
    var i = 0;
    var interval = setInterval(function() {
      var currentTile = controller.translateColor(model.melody[i]);
      view.animate(currentTile, model.speed);
      controller.speedChange(model.moveCount);
      i++;
      if(i == model.moveCount){
        clearInterval(interval);
      }
    }, model.speed+50);
    model.playing = true;
  },
//verify that player input is complete
  checkPlayerTurnComplete: function() {
    if(model.moveCount === model.playerSequence.length) {//check if player has entered enough colors
      if(model.moveCount == 20) { //if this was the 20th turn, player has won, end the game
        controller.win();
      }
      else { //if 20 turns are not over yet, continue playing
        model.playerSequence = [];
        model.playing = false;
        setTimeout(function() {
          controller.play();
        }, 1000);
      }//end else
    }//end outer if
  },
//compare player and ai melody arrays and act according to result
  compareMelodyArrays: function() {
    var melodyCheck = model.playerSequence.every(function(element, index){
      if(element == model.melody[index]){
        return true;
      }
      return false;
    });
    if (!melodyCheck){
      audio.beep(model.speed, 40, 0.9, 0.05, "triangle");
      if(model.strictMode){
        controller.gameOver();
        setTimeout(function() {
          controller.play();
        }, 1000);
      }
      else {
        model.playerSequence = [];
        model.moveCount--;
        model.playing = false;
        setTimeout(function() {
          controller.play();
        }, 1000);
      }//end else
    }//end outer if
    else {
      this.checkPlayerTurnComplete();
    }
  },
//add player move to player array and compare with ai melody
  playerAction: function(tile) {
    model.playerSequence.push(tile);
    this.compareMelodyArrays();
  },
//provide color according to given value
  translateColor: function(value) {
    switch(value) {
      case 1:
      return "green";
      break;
      case 2:
      return "red";
      break;
      case 3:
      return "blue";
      break;
      case 4:
      return "yellow";
      break;
    }
  },
//check status of playing variable that allows user interaction
  checkStatus: function() {
    return model.playing;
  },
  //change the replay speed variable
  speedChange: function(value) {
    if (value >=6){
      model.speed = 520;
     }
    else if (value >=14){
      model.speed = 420;
     }
     return model.speed;
  },
  // toggle strict mode
  changeStrict: function() {
    if (model.strictMode){
      model.strictMode = false;
    }
    else {
      model.strictMode = true;
    }
    return model.strictMode;
  },
  //proclaim player winning and restart the game
  win: function() {
        alert("Congratulations! You've won the game!");
          this.gameOver();
        }
};
// ************* VIEW *************
var view = {
  gameStarted: false,
  init: function() {
    //setup click handler for buttons
    this.startTag = document.getElementById("startTag");
    this.startBtn = document.getElementById("start");
    this.counter = document.getElementById("counter");
    this.startBtn.addEventListener("click", function() {
      if(!view.gameStarted){
        setTimeout(function() {
          view.gameStarted = true;
             this.startTag.textContent = "Restart";
             controller.play();
           }, 1000);
      }
      else {
        console.log("restart");
        controller.gameOver();
        setTimeout(function() {
             controller.play();
           }, 1000);
      }
    });
    this.strictBtn = document.getElementById("strict");
    this.render();
  },

  render: function() {
    // this.startTag.textContent = "START";
    $(".strictBtn").css("background-color", "#337ab7");
    this.counter.textContent = "--";
    this.strictBtn.addEventListener("click", function() {
      var strictMode = controller.changeStrict();
      if (strictMode){
        $(".strictBtn").css("background-color", "pink");
        }
      else {
        $(".strictBtn").css("background-color", "#337ab7");
        }
      });
    //initializing the colors
    this.greenTile = document.getElementById("green");
    this.greenTile.addEventListener("click", function(event) {
      if (controller.checkStatus()) {
        view.animate(event.target.id);
        controller.playerAction("1");
      }
    });
    this.redTile = document.getElementById("red");
    this.redTile.addEventListener("click", function(event) {
      if (controller.checkStatus()) {
        view.animate(event.target.id);
          controller.playerAction("2");
      }
    });
    this.blueTile = document.getElementById("blue");
    this.blueTile.addEventListener("click", function(event) {
      if (controller.checkStatus()) {
        view.animate(event.target.id);
          controller.playerAction("3");
      }
    });
    this.yellowTile = document.getElementById("yellow");
    this.yellowTile.addEventListener("click", function(event) {
      if (controller.checkStatus()) {
        view.animate(event.target.id);
          controller.playerAction("4");
      }
    });
  },

  updateCounter: function(moveCount) {
    this.counter.textContent = moveCount;
  },

  animate: function(tile, speed) {
    var speed = controller.speedChange();
    //var currentTile = document.getElementById(tile);
    switch (tile) {
      case "green":
      audio.beep(speed-50, 391.995, 0.6, 0.05, "sine");
      // audio.green.play();
      break;
      case "red":
      audio.beep(speed-50, 329.628, 0.6, 0.05, "sine");
      // audio.red.play();
      break;
      case "blue":
      audio.beep(speed-50, 195.998, 0.6, 0.05, "sine");
      // audio.blue.play();
      break;
      case "yellow":
      audio.beep(speed-50, 261.626, 0.6, 0.05, "sine");
      // audio.yellow.play();
      break;
    }
    $("#"+tile).addClass("light");
    setTimeout(function() {
      $("#"+tile).removeClass("light");
    }, speed);
  },

  shutdown: function() {
    this.counter.textContent = "";
    this.startTag.textContent = "START";
  },


};
// ************* AUDIO *************
var audio = {
  AudioContext : window.AudioContext || window.webkitAudioContext,
  audioCtx: new AudioContext(),
	volume: 0.6,
  //Beep function courtesy of http://stackoverflow.com/a/29641185/6230785
  //All arguments are optional:
  //duration of the tone in milliseconds.
  //frequency of the tone in hertz.
  //volume of the tone. Default is 1, off is 0.
  //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
  //callback to use on end of tone
  beep: function(duration, frequency, volume, delayVal, type, callback) {
    var oscillator = this.audioCtx.createOscillator();
    var gainNode = this.audioCtx.createGain();
    var delay = this.audioCtx.createDelay();
    var speed = controller.speedChange();

    oscillator.connect(gainNode);

    gainNode.connect(delay);
    delay.connect(this.audioCtx.destination);

    if (volume){gainNode.gain.value = volume;};
    if (frequency){oscillator.frequency.value = frequency;}
    if (delayVal) {delay.delayTime.value = delayVal}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}

    oscillator.start();
    setTimeout(function(){
      gainNode.gain.setTargetAtTime(0, audio.audioCtx.currentTime, 0.015);}, (duration ? duration : 420));
  }
  //   init: function() {
  //     this.green = new Audio(
  //   "http://s3.amazonaws.com/freecodecamp/simonSound1.mp3"), this.red = new Audio(
  //   "http://s3.amazonaws.com/freecodecamp/simonSound2.mp3"), this.blue = new Audio(
  //   "http://s3.amazonaws.com/freecodecamp/simonSound3.mp3"), this.yellow = new Audio(
  //   "http://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
  // },
};
controller.init();
