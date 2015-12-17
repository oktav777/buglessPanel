var BuglessPanels = {
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
                self.leftPanel.moveX(Help.calculatePercentageX(e.touches[0].clientX));
            }
        });

        self.contentCMD.on('moveendright', function(e) {
            if(self.leftPanel.x > self.panelThreshold) {
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
                self.rightPanel.moveX(Help.calculatePercentageX(e.touches[0].clientX));
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
    }
}
