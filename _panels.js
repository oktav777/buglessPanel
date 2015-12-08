var panels = document.querySelectorAll('.m-panel');
var content = document.querySelector('.container');
var body = document.getElementsByTagName('body')[0];
var swipeDeltaX = screen.width / 3;
//var swipeDeltaX = screen.width;

content.addEventListener('touchstart', touchStart, false);
content.addEventListener('touchmove', handleTouchMoveContent(panels), false);
content.addEventListener('touchend', touchEnd, false);

for(var i = 0, l = panels.length; i < l; i++) {
  var p = panels[i];
  p.addEventListener('touchstart', touchStart, false);
  p.addEventListener('touchmove', handleTouchMovePanel(p), false);
}

function stopBottom(evt, panel) {
  if(panel.scrollTop + panel.offsetHeight >= panel.querySelector('.inner').offsetHeight) {
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    evt.returnValue = false;
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

var xDown, yDown, xEnd, yEnd = null;

function touchStart(evt) {
  console.log('started', evt.touches[0].clientX, evt.touches[0].clientY);
  xDown = evt.touches[0].clientX;
  yDown = evt.touches[0].clientY;
}

function touchEnd(evt) {
  console.log('ended', evt.changedTouches[0].clientX, evt.changedTouches[0].clientY);
  xEnd = evt.changedTouches[0].clientX || 0;
  yEnd = evt.changedTouches[0].clientY || 0;
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

    // x axis stop diff
    var xsd = xUp - xEnd || null;
    //y axis stop diff
    var ysd = yUp - yEnd || null;

    for(var i = 0, l = panels.length; i < l; i++) {
      var p = panels[i];

      function dragRight() {
        return 100 - (((screen.width - xUp) * 100) / screen.width);
      }

      function dragLeft() {
        return 100 - ((xUp * 100) / screen.width);
      }

      if(Math.abs(xDiff) > Math.abs(yDiff)) {
        if(xDiff > 0) {
          /* left swipe */
          if(p.getAttribute('pos') === 'right') {
            p.style.transform = 'translate(' + dragRight() + '%)';
            if(xsd === null) {
              if(Math.abs(xDiff) > swipeDeltaX) {
                addClass(body, 'open');
                addClass(p, 'open');
                p.removeAttribute('style');
                xDown = null;
                yDown = null;
              }
            } else if(Math.abs(xsd) > swipeDeltaX) {
              addClass(body, 'open');
              addClass(p, 'open');
              p.removeAttribute('style');
              xDown = null;
              yDown = null;
            } else {
              return;
            }
          }
        } else {
          /* right swipe */
          if(p.getAttribute('pos') === 'left') {
            p.style.transform = 'translate(-' + dragLeft() + '%)';
            if(xsd === null) {
              if(Math.abs(xDiff) > swipeDeltaX) {
                addClass(body, 'open');
                addClass(p, 'open');
                p.removeAttribute('style');
                xDown = null;
                yDown = null;
              }
            } else if(Math.abs(xsd) > swipeDeltaX) {
              addClass(body, 'open');
              addClass(p, 'open');
              p.removeAttribute('style');
              xDown = null;
              yDown = null;
            } else {
              return;
            }
          }
        }
      }
    }

    /* reset values */
    /*xDown = null;
    yDown = null;*/
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

    /*if(Math.abs(xDiff) > swipeDeltaX) {
      xDown = null;
      yDown = null;
      return;
    }*/

    /*most significant*/
    if(Math.abs(xDiff) > Math.abs(yDiff)) {
      //console.log('swiped');
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
