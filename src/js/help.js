var Help = {
    calculatePercentageX: function(value) {
        return value * 100 / window.innerWidth;
    },
    calculatePercentageY: function(value) {
        return value * 100 / window.innerHeight;
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
    },
    closest: function(el, selector) {
        var matchesFn, parent;

        // find vendor prefix
        ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
            if(typeof document.body[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        })

        // traverse parents
        while (el !== null) {
            parent = el.parentElement;
            if(parent!==null && parent[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }
        return null;
    }
}
