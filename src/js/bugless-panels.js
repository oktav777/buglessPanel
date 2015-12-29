var BuglessPanels = {
    moveThreshold: 20, // in px
    panelThreshold: 40, // in %
    panels: [],
    init: function(params) {
        var self = this;
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
                throw new Error('"leftPanel" parameter must be an instance of Panel');
            this.leftPanel = params.leftPanel;
            this.leftPanel.position = Panel.POSITION_LEFT;
            this.initContentCMD();
            this.listenRightSwipe();
        }

        if(params.rightPanel) {
            if(!(params.rightPanel instanceof Panel))
                throw new Error('"leftPanel" parameter must be an instance of Panel');
            this.rightPanel = params.rightPanel;
            this.rightPanel.position = Panel.POSITION_RIGHT;
            this.initContentCMD();
            this.listenLeftSwipe();
        }

        this.backdrop = document.querySelector('.bugless-backdrop');
        if(this.backdrop == null) {
            this.backdrop = document.createElement('div');
            this.backdrop.setAttribute('class', 'bugless-backdrop');
            document.body.appendChild(this.backdrop);
            this.backdrop.addEventListener('click', function(e) {
                self.closeAll();
            }, false);
            this.backdrop.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, false);
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
                if(self.leftPanel.onShow && !self.leftPanel.onShowWasCalled) {
                    self.leftPanel.onShow(self.leftPanel);
                    self.leftPanel.onShowWasCalled = true;
                }
                self.leftPanel.show();

                var cursorPos = Help.calculatePercentageX(e.touches[0].clientX); //%
                var x = cursorPos * 100 / self.leftPanel.width;
                self.leftPanel.moveX(x);
            }
        });

        self.contentCMD.on('moveendright', function(e) {
            var x = self.leftPanel.x * 100 / self.leftPanel.width;
            if(x > self.panelThreshold) {
                self.leftPanel.open();
            } else {
                self.leftPanel.close();
            }
            self.leftPanel.onShowWasCalled = false;
        });
    },
    listenLeftSwipe: function() {
        var self = this;
        self.contentCMD.on('moveleft', function (e) {
            if(e.direction !== false) {
                if(self.rightPanel.onShow && !self.rightPanel.onShowWasCalled) {
                    self.rightPanel.onShow(self.rightPanel);
                    self.rightPanel.onShowWasCalled = true;
                }
                self.rightPanel.show();
                var cursorPos = Help.calculatePercentageX(e.touches[0].clientX); //%

                var x = cursorPos * 100 / self.rightPanel.width;
                self.rightPanel.moveX(x - ((100 - self.rightPanel.width) * 100 / self.rightPanel.width));
            }
        });

        self.contentCMD.on('moveendleft', function(e) {
            if(self.rightPanel.x < 100 - self.panelThreshold) {
                self.rightPanel.open();
            } else {
                self.rightPanel.close();
            }
            self.rightPanel.onShowWasCalled = false;
        });
    },
    panelsAnimateOff: function() {
        for(var i in this.panels) {
            this.panels[i].animateOff();
        }
    },
    closeAll: function() {
        for(var i in this.panels) {
            this.panels[i].isOpened && this.panels[i].close();
        }
    },
    backdropOn: function() {
        Help.addClass(this.backdrop, 'in');
    },
    backdropOff: function() {
        Help.removeClass(this.backdrop, 'in');
    }
}
