//Beep function courtesy of http://stackoverflow.com/a/29641185/6230785
//All arguments are optional:
//duration of the tone in milliseconds.
//frequency of the tone in hertz.
//volume of the tone. Default is 1, off is 0.
//type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone

var audio = {
  AudioContext : window.AudioContext || window.webkitAudioContext,
  audioCtx: new AudioContext(),
	volume: 0.6,

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
};
