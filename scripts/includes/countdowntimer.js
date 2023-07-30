function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
  this.paused = false;
  this.project = "";
  this.requestStop = false;
  this.requestCancel = false;
}

function timerStart()

CountDownTimer.prototype.start = function(project) {
  if (this.running) {
    return;
  }
  this.running = true;
  this.project = project;
  var start = Date.now(),
      that = this,
      diff, obj;

  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);
    
    if (diff > 0 && !that.requestStop) {
      setTimeout(timer, that.granularity);
    } else {
	  console.log("adad");
      diff = 0;
      that.running = false;
	  that.requestStop = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function(ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }());
};

CountDownTimer.prototype.stop = function () {
	this.requestStop = true;
};

CountDownTimer.prototype.cancel = function () {
	this.requestStop = true;
};

CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};
