/* PUT YOUR HELPER FUNCTION HERE */

/*TOUCH DETECTION */

'use strict';

var htmlNode = document.getElementsByTagName('html')[0];

function isTouch() {
 return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0)  || (navigator.msMaxTouchPoints > 0));
}

if (!isTouch()) {
    htmlNode.className += ' '+'no-touch';
}else{
    htmlNode.className += ' '+'touch';
}

