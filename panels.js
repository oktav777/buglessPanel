var panels = document.querySelectorAll('.m-panel');
var content = document.querySelector('.container');
var body = document.getElementsByTagName('body')[0];
var swipeDeltaX = screen.width / 4;

content.addEventListener('touchstart', handleTouchStart, false);
content.addEventListener('touchmove', handleTouchMoveContent(panels), false);

for(var i = 0, l = panels.length; i < l; i++) {
  var p = panels[i];
  p.addEventListener('touchstart', handleTouchStart, false);
  p.addEventListener('touchmove', handleTouchMovePanel(p), false);
}

function stopBottom(evt, panel) {
  if(panel.scrollTop + panel.offsetHeight >= panel.querySelector('.inner').offsetHeight) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.returnValue = false;
    evt.stopImmediatePropagation();
    return false;
  }
}

function stopTop(evt, panel) {
  if(panel.scrollTop <= 0) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.returnValue = false;
    evt.stopImmediatePropagation();
    return false;
  }
}

var xDown = null;
var yDown = null;

function handleTouchStart(evt) {
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
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

function handleTouchMoveContent(panels) {
  return function(evt) {
    if (!xDown || !yDown)
      return;

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if(Math.abs(xDiff) < swipeDeltaX)
      return;

    for(var i = 0, l = panels.length; i < l; i++) {
      var p = panels[i];

      if(Math.abs(xDiff) > Math.abs(yDiff)) {
        if(xDiff > 0) {
          /* left swipe */
          if(p.getAttribute('pos') === 'right') {
            addClass(body, 'open');
            addClass(p, 'open');
          }
        } else {
          /* right swipe */
          if(p.getAttribute('pos') === 'left') {
            addClass(body, 'open');
            addClass(p, 'open');
          }
        }
      }
    }

    /* reset values */
    xDown = null;
    yDown = null;
  }
}

function handleTouchMovePanel(panel) {
  return function(evt) {
    if (!xDown || !yDown)
      return;

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if(Math.abs(xDiff) < swipeDeltaX)
      return;

    /*most significant*/
    if(Math.abs(xDiff) > Math.abs(yDiff)) {
      if(xDiff > 0) {
        /* left swipe */
        if(panel.getAttribute('pos') === 'left') {
          removeClass(body, 'open');
          removeClass(panel, 'open');
        }
      } else {
        /* right swipe */
        if(panel.getAttribute('pos') === 'right') {
          removeClass(body, 'open');
          removeClass(panel, 'open');
        }
      }
    } else {
      if(yDiff > 0) {
        /* up swipe */
        stopBottom(evt, panel);
      } else {
        /* down swipe */
        stopTop(evt, panel);
      }
    }

    /* reset values */
    xDown = null;
    yDown = null;
  }
}
