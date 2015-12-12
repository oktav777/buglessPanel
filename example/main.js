var menu = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT
});

var search = new Panel('#right-panel', {
    position: Panel.POSITION_RIGHT
});

var clickPanel = new Panel('#click-panel', {
    position: Panel.POSITION_RIGHT
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
