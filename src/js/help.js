var Help = {
    calculatePercentageX: function(value) {
        return value * 100 / screen.width;
    },
    calculatePercentageY: function(value) {
        return value * 100 / screen.height;
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
    },
    transitionEvent: function() {
        var t,
            el = document.createElement('fakeelement'),
            transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd'
            }

        for(t in transitions){
            if(el.style[t] !== undefined){
                return transitions[t];
            }
        }
    }
}
