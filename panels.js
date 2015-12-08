// Help functions
function calculatePercentage(value) {
  return value * 100 / screen.width;
}

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className);
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else if (!hasClass(el, className))
    el.className += " " + className;
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ')
  }
}


// LSD - Listen swipe direction
function LSD(element) {
  this.element = element;
  this.initListeners();
}

LSD.prototype.initListeners = function () {
  var startX = 0,
      startY = 0,
      self = this,
      movementDirection = false,
      eventParams = {
        direction: null,
        touches: null,
        deltaX: null,
        deltaY: null
      };

  self.element.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, false);

  self.element.addEventListener('touchmove', function(e) {

    var deltaX = e.touches[0].clientX - startX,
        deltaY = e.touches[0].clientY - startY;

    if(movementDirection === false) {
      var distance = 10,
          movementX = Math.abs(deltaX) >= distance,
          movementY = Math.abs(deltaY) >= distance;

      if(movementX) {
        console.log('moveX');
        movementDirection = deltaX > 0 ? 'right' : 'left';
      } else if(movementY) {
        console.log('moveY');
        movementDirection = deltaY > 0 ? 'bottom' : 'top';
      }
    }

    if(movementDirection) {
      eventParams = {
        touches: e.touches,
        deltaX: deltaX,
        deltaY: deltaY,
        direction: movementDirection,
        preventDefault: function() {
          e.preventDefault();
        }
      }
      self.triggerEvent('move' + movementDirection, eventParams);
    }
  }, false);

  self.element.addEventListener('touchend', function(e) {
    self.triggerEvent('moveend' + movementDirection, eventParams);
    movementDirection = false;
  }, false);

  self.element.addEventListener('touchcancel', function(e) {
    self.triggerEvent('movecancel' + movementDirection, eventParams);
    movementDirection = false;
  }, false);
};

LSD.prototype.triggerEvent = function (eventName, eventParams) {
  var customEvent = document.createEvent('Event');
  customEvent.initEvent(eventName, true, true);
  for (var param in eventParams) {
    customEvent[param] = eventParams[param];
  }
  this.element.dispatchEvent(customEvent);
};

LSD.prototype.on = function (event, callback) {
  this.element.addEventListener(event, callback, false);
};

// Panel class
function Panel(selector, params) {
  this.element = document.querySelector(selector);
  this.position = params.position;
  this.initListeners();
}

Panel.prototype.translateX = function (value) {
  value = this.position == 'left' ? (-100 + value) : value;
  this.element.style.transform = 'translateX(' + value + '%)';
};

Panel.prototype.close = function () {
  addClass(this.element, 'animate');
  this.translateX(0);
};

Panel.prototype.open = function () {
  addClass(this.element, 'animate');
  this.translateX(100);
};

Panel.prototype.initListeners = function () {
  var self = this;

  // content listeners
  Panel.content.on('touchstart', function(e) {
    removeClass(self.element, 'animate');
  });

  Panel.content.on(self.position == 'left' ? 'moveright' : 'moveleft', function(e) {
    self.translateX(calculatePercentage(e.touches[0].clientX));
  });

  Panel.content.on(self.position == 'left' ? 'moveendright' : 'moveendleft', function(e) {
    if(calculatePercentage(e.touches[0].clientX) < (self.position == 'left' ? 40 : 60)) {
      self.close();
    } else {
      self.open();
    }
  });

  // panel listeners
  self.lsd = new LSD(self.element);
  var sx = null;
  self.lsd.on('touchstart', function(e) {
    removeClass(self.element, 'animate');
    sx = self.position == 'left' ? screen.width - e.touches[0].clientX : e.touches[0].clientX;
  });

  self.lsd.on(self.position == 'left' ? 'moveleft' : 'moveright', function(e) {
    var s = self.position == 'left' ? 1 : -1;
    var v = calculatePercentage(e.touches[0].clientX) + (calculatePercentage(sx) * s);
    self.translateX(v);
  });

  self.lsd.on(self.position == 'left' ? 'moveendleft' : 'moveendright', function(e) {
    if(calculatePercentage(e.touches[0].clientX) < (self.position == 'left' ? 60 : 40)) {
      self.close();
    } else {
      self.open();
    }
  });

  self.lsd.on('movebottom', function(e) {
    if(self.element.scrollTop <= 0) {
      e.preventDefault();
    }

  });

  self.lsd.on('movetop', function(e) {
    if(self.element.scrollTop + self.element.offsetHeight >= self.element.querySelector('.inner').offsetHeight) {
      e.preventDefault();
    }
  });


};


Panel.setContent = function(selector) {
  if(Panel.content === undefined) {
    Panel.content = new LSD(document.querySelector(selector));
  }
  return Panel.content;
};



Panel.setContent('.container');


var p1 = new Panel('#left-panel', {
  position: 'left'
});

var p2 = new Panel('#right-panel', {
  position: 'right'
});
