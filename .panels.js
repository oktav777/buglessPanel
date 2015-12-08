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

LSD.prototype.getDirection = function (e) {
  var self = this,
      movementDirection = false,
      deltaX = e.touches[0].clientX - self.startX,
      deltaY = e.touches[0].clientY - self.startY;

  if(movementDirection === false) {
    var distance = 20,
        movementX = Math.abs(deltaY) < distance && Math.abs(deltaX) > distance,
        movementY = Math.abs(deltaY) > distance && Math.abs(deltaX) < distance;

    if(movementX || movementY) {
      if(movementX) {
        movementDirection = deltaX > 0 ? 'right' : 'left';
        return movementDirection;
      }

      if(movementY) {
        movementDirection = deltaY > 0 ? 'bottom' : 'top';
        return movementDirection;
      }
    }
  }

  //return movementDirection;
};

LSD.prototype.initListeners = function () {
  this.startX = 0;
  this.startY = 0;
  var self = this,
      movementDirection = false,
      eventParams = {
        direction: null,
        touches: null,
        deltaX: null,
        deltaY: null
      };

  self.element.addEventListener('touchstart', function(e) {
    self.startX = e.touches[0].clientX;
    self.startY = e.touches[0].clientY;
  }, false);
/*
  self.element.addEventListener('touchmove', function(e) {

    var deltaX = e.touches[0].clientX - startX,
        deltaY = e.touches[0].clientY - startY;

    if(movementDirection === false) {
      var distance = 20,
          movementX = Math.abs(deltaY) < distance && Math.abs(deltaX) > distance,
          movementY = Math.abs(deltaY) > distance && Math.abs(deltaX) < distance;

      if(movementX || movementY) {
        if(movementX) {
          var directionX = deltaX > 0 ? 'right' : 'left';
          movementDirection = directionX;
        }

        if(movementY) {
          var directionY = deltaY > 0 ? 'bottom' : 'top';
          movementDirection = directionY;
        }
      }
    }

    if(movementDirection) {
      eventParams = {
        touches: e.touches,
        deltaX: deltaX,
        deltaY: deltaY,
        direction: movementDirection
      }
    }
    e.direction = movementDirection;
    self.element.dispatchEvent(e);

  }, false);
  */
/*
  self.element.addEventListener('touchend', function(e) {
    self.triggerEvent('moveend' + movementDirection, eventParams);
    movementDirection = false;
  }, false);

  self.element.addEventListener('touchcancel', function(e) {
    self.triggerEvent('movecancel' + movementDirection, eventParams);
    movementDirection = false;
  }, false);
  */
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



var contentM = new LSD(document.querySelector('.container'));
contentM.on('touchmove', function(e) {

  console.log(contentM.getDirection(e));
});
