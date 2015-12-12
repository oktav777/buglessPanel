var menu = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT
});

var search = new Panel('#right-panel', {
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

BuglessPanel.init({
    content: '.container',
    leftPanel: menu,
    rightPanel: search,
});



var btn = document.querySelector('#open-panel');
btn.addEventListener('click', function(e) {
    clickPanel.open();
}, false);

document.querySelector('#open-bottom').addEventListener('click', function(e) {
    bottomPanel.open();
}, false);

document.querySelector('#open-top').addEventListener('click', function(e) {
    topPanel.open();
}, false);
