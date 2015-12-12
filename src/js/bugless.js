var BuglessPanel = {
    moveThreshold: 20, // in px
    panelThreshold: 40, // in %
    panels: [],
    init: function(params) {
        this.params = params;

        if(!params.content)
            throw new Error('"content" parameter was not passed');

        this.content = document.querySelector(params.content);
        if(!this.content)
            throw new Error('Content element not found');

        this.moveThreshold = this.params.moveThreshold || 20;
        this.panelThreshold = this.params.panelThreshold || 40;

        if(params.leftPanel) {
            if(!(params.leftPanel instanceof Panel))
                throw new Error('"leftPanel" parameter must be an instance of BuglessPanel.Panel');
            this.leftPanel = params.leftPanel;
            this.leftPanel.position = Panel.POSITION_LEFT;
            this.initContentCMD();
            this.listenRightSwipe();
        }

        if(params.rightPanel) {
            if(!(params.rightPanel instanceof Panel))
                throw new Error('"leftPanel" parameter must be an instance of BuglessPanel.Panel');
            this.rightPanel = params.rightPanel;
            this.rightPanel.position = Panel.POSITION_RIGHT;
            this.initContentCMD();
            this.listenLeftSwipe();
        }
    },
    initContentCMD: function() {
        var self = this;
        if(!this.contentCMD) {
            this.contentCMD = new CMD(this.content, {threshold: self.moveThreshold});
            this.contentCMD.on('touchstart', function(e) {
                self.panelsAnimateOff();
            });
        }
    },
    listenRightSwipe: function() {
        var self = this;
        self.contentCMD.on('moveright', function (e) {
            if(e.direction !== false) {
                self.leftPanel.translateX(Help.calculatePercentage(e.touches[0].clientX));
            }
        });

        self.contentCMD.on('moveendright', function(e) {
            if(self.leftPanel.x > self.panelThreshold) {
                self.leftPanel.open();
            } else {
                self.leftPanel.close();
            }
        });
    },
    listenLeftSwipe: function() {
        var self = this;
        self.contentCMD.on('moveleft', function (e) {
            if(e.direction !== false) {
                self.rightPanel.translateX(Help.calculatePercentage(e.touches[0].clientX));
            }
        });

        self.contentCMD.on('moveendleft', function(e) {
            if(self.rightPanel.x < 100 - self.panelThreshold) {
                self.rightPanel.open();
            } else {
                self.rightPanel.close();
            }
        });
    },
    panelsAnimateOff: function() {
        for(var i in this.panels) {
            this.panels[i].animateOff();
        }
    }
}


/**
*   Panel class
*/
Panel.POSITION_LEFT = 1;
Panel.POSITION_RIGHT = 2;
Panel.POSITION_TOP = 4;
Panel.POSITION_BOTTOM = 6;

function Panel(selector, params) {
    var self = this;

    BuglessPanel.panels.push(self);
    self.element = document.querySelector(selector);
    self.x = null;
    self.y = null;

    if(!self.element)
        throw new Error('Panel "' + selector + '" not found');

    if(!params.position)
        throw new Error('Please specify the panel position');

    self.position = params.position;

    if(params.closeBySwipe !== false) {
        self.elementCMD = new CMD(self.element, {
            threshold: BuglessPanel.moveThreshold,
            preventScroll: true,
            innerElement: self.element.querySelector('.inner')
        });

        switch(self.position) {
            case Panel.POSITION_LEFT:
                self.x = -100;
                self.y = 0;
                self.listenRightSwipe();
                break;
            case Panel.POSITION_RIGHT:
                self.x = 100;
                self.y = 0;
                self.listenLeftSwipe();
                break;
            case Panel.POSITION_TOP:
                self.x = 0;
                self.y = -100;
                self.listenBottomSwipe();
                break;
            case Panel.POSITION_BOTTOM:
                self.x = 0;
                self.y = 100;
                self.listenTopSwipe();
                break;
        }
    }

}

Panel.prototype.listenRightSwipe = function() {
    var self = this,
        sx = null;

    self.elementCMD.on('touchstart', function(e) {
        Help.removeClass(self.element, 'animate');
        sx = screen.width - e.touches[0].clientX;
    });

    self.elementCMD.on('moveleft', function(e) {
        if(e.direction !== false) {
            var v = Help.calculatePercentage(e.touches[0].clientX) + Help.calculatePercentage(sx);
            self.translateX(v < 100 ? v : 100);
        }
    });

    self.elementCMD.on('moveendleft', function(e) {
        if(self.x < 100 - BuglessPanel.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}

Panel.prototype.listenLeftSwipe = function() {
    var self = this,
        sx = null;

    self.elementCMD.on('touchstart', function(e) {
        Help.removeClass(self.element, 'animate');
        sx = e.touches[0].clientX;
    });

    self.elementCMD.on('moveright', function(e) {
        if(e.direction !== false) {
            var v = Help.calculatePercentage(e.touches[0].clientX) - Help.calculatePercentage(sx);
            self.translateX(v > 0 ? v : 0);
        }
    });

    self.elementCMD.on('moveendright', function(e) {
        if(self.x > BuglessPanel.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}

Panel.prototype.animateOff = function() {
    Help.removeClass(this.element, 'animate');
}

Panel.prototype.translateX = function (value) {
    this.x = value;
    value = this.position == Panel.POSITION_LEFT ? (-100 + value) : value;
    this.element.style.transform = 'translateX(' + value + '%)';
}

Panel.prototype.close = function () {
    Help.addClass(this.element, 'animate');
    var v;

    if(this.position == Panel.POSITION_LEFT) {
        v = 0;
    }
    if(this.position == Panel.POSITION_RIGHT) {
        v = 100;
    }
    this.translateX(v);
}

Panel.prototype.open = function () {
    Help.addClass(this.element, 'animate');
    var v;

    if(this.position == Panel.POSITION_LEFT) {
        v = 100;
    }
    if(this.position == Panel.POSITION_RIGHT) {
        v = 0;
    }
    this.translateX(v);
}







/**
*   Help functions
*/
var Help = {
    calculatePercentage: function(value) {
        return value * 100 / screen.width;
    },
    hasClass: function(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },
    addClass: function(el, className) {
        if (el.classList)
            el.classList.add(className);
        else if (!hasClass(el, className))
            el.className += " " + className;
    },
    removeClass: function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className = el.className.replace(reg, ' ')
        }
    }
}
