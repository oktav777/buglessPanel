// CMD - Catch Move Direction
function CMD(element, params) {
    this.element = element;
    this.threshold = params.threshold || 20;
    this.preventScroll = params.preventScroll || false;
    this.innerElement = params.innerElement;

    this.startX = null;
    this.startY = null;
    this.initListeners();
}

CMD.prototype.initListeners = function () {
    var self = this,
        stableDirection = false,
        moveOrientation = false,
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

    self.element.addEventListener('touchmove', function(e) {
        var deltaX = e.touches[0].clientX - self.startX,
            deltaY = e.touches[0].clientY - self.startY,
            movementX = Math.abs(deltaX) > 0,
            movementY = Math.abs(deltaY) > 0;

        eventParams = {
            touches: e.touches,
            deltaX: deltaX,
            deltaY: deltaY,
            direction: stableDirection
        };

        if(self.preventScroll) {
            if(deltaY > 0 && self.element.scrollTop <= 0) {
                e.preventDefault();
            }
            if(self.innerElement && deltaY < 0 && self.element.scrollTop + self.element.offsetHeight >= self.innerElement.offsetHeight) {
                e.preventDefault();
            }
        }


        if(stableDirection === false) {
            if(Math.abs(deltaX) > self.threshold) {
                stableDirection = deltaX > 0 ? 'right' : 'left';
                moveOrientation = 'horizontal';
            }
            if(Math.abs(deltaY) > self.threshold) {
                stableDirection = deltaY > 0 ? 'bottom' : 'top';
                moveOrientation = 'vertical';
            }

            if(movementX) {
                if(deltaX > 0) {
                    self.triggerEvent('moveright', eventParams);
                } else if(deltaX < 0) {
                    self.triggerEvent('moveleft', eventParams);
                }
            }

            if(movementY) {
                if(deltaY > 0) {
                    self.triggerEvent('movebottom', eventParams);
                } else if(deltaY < 0) {
                    self.triggerEvent('movetop', eventParams);
                }
            }
        } else {
            if((moveOrientation == 'horizontal' && movementY) || (moveOrientation == 'vertical' && movementX)) {
                e.preventDefault();
            }
            self.triggerEvent('move' + stableDirection, eventParams);
        }

    }, false);

    self.element.addEventListener('touchend', function(e) {
        self.triggerEvent('moveend' + stableDirection, eventParams);
        stableDirection = false;
    }, false);

    self.element.addEventListener('touchcancel', function(e) {
        self.triggerEvent('movecancel' + stableDirection, eventParams);
        stableDirection = false;
    }, false);
}

CMD.prototype.triggerEvent = function (eventName, eventParams) {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent(eventName, true, true);
    for (var param in eventParams) {
        customEvent[param] = eventParams[param];
    }
    this.element.dispatchEvent(customEvent);
}

CMD.prototype.on = function (event, callback) {
    this.element.addEventListener(event, callback, false);
}
