var leftPanel = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT,
    onShow: function(p) {
        console.log('show');
    },
    onShown: function(p) {
        console.log('shown');
    },
    onClose: function(p) {
        console.log('close');
    },
    onClosed: function(p) {
        console.log('closed');
    }
});

var rigtPanel = new Panel('#right-panel', {
    position: Panel.POSITION_RIGHT
});

var clickPanel = new Panel('#click-panel', {
    position: Panel.POSITION_RIGHT
});

var bottomPanel = new Panel('#bottom-panel', {
    position: Panel.POSITION_BOTTOM
});

var topPanel = new Panel('#top-panel', {
    position: Panel.POSITION_TOP
});

document.querySelector('#open-panel').addEventListener('click', function(e) {
    clickPanel.open();
}, false);

document.querySelector('#open-bottom').addEventListener('click', function(e) {
    bottomPanel.open();
}, false);

document.querySelector('#open-top').addEventListener('click', function(e) {
    topPanel.open();
}, false);



BuglessPanels.init({
    content: '.container',
    leftPanel: leftPanel,
    rightPanel: rigtPanel,
    panelThreshold: 10
});
