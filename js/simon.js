// ************* MODEL *************
var model = {
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
// ************* VIEWMODEL *************
//Implementing knockout.js observables
var ViewModel = {
  strictMode : ko.observable(false),
  moveCount : ko.observable(0),
  increment : function() {
    this.moveCount(this.moveCount()+1);
  },
  decrement : function() {
    this.moveCount(this.moveCount()-1);
  },
  changeStrict : function() {
    if (!this.strictMode) {
      this.strictMode = true;
      $("#strictLed").addClass("redLed");
    }
    else {
      this.strictMode = false;
      $("#strictLed").removeClass("redLed");
    }
  }
};
ko.applyBindings(ViewModel);
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
        //"Off"-switch does not work yet, no idea why
        $("button").off("click", "**");
        ViewModel.moveCount(0);
      }
    });
  },
  //restart the game
  gameOver: function() {
    model.melody = [];
    model.init();
    view.gameStarted = false;
    model.playerSequence = [];
    ViewModel.moveCount(0);
    model.playing = false;
  },
  //main gameplay function
  play: function() {
    ViewModel.increment();
    //view.updateCounter(model.moveCount);
    var i = 0;
    var interval = setInterval(function() {
      var currentTile = controller.translateColor(model.melody[i]);
      view.animate(currentTile, model.speed);
      controller.speedChange(ViewModel.moveCount());
      i++;
      if(i == ViewModel.moveCount()){
        clearInterval(interval);
      }
    }, model.speed+50);
    model.playing = true;
  },
//verify that player input is complete
  checkPlayerTurnComplete: function() {
    if(ViewModel.moveCount() === model.playerSequence.length) {//check if player has entered enough colors
      if(ViewModel.moveCount() == 20) { //if this was the 20th turn, player has won, end the game
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
      audio.beep(800, 40, 0.9, 0.05, "triangle");
      if(ViewModel.strictMode){
        controller.gameOver();
        setTimeout(function() {
          controller.play();
        }, 1000);
      }
      else {
        model.playerSequence = [];
        ViewModel.decrement();
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
    this.restartBtn = document.getElementById("restart");
    this.counter = document.getElementById("counter");
    this.startBtn.addEventListener("click", function() {
      if(!view.gameStarted){
        setTimeout(function() {
          view.gameStarted = true;
             controller.play();
           }, 1000);
      }
    });
    this.restartBtn.addEventListener("click", function() {
        controller.gameOver();
        setTimeout(function() {
             controller.play();
           }, 1000);
      });
    this.render();
  },

  render: function() {
    ViewModel.moveCount(0);
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
//main animation functionality
  animate: function(tile, speed) {
    var speed = controller.speedChange();
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
  }
};

controller.init();
